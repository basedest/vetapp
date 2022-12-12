import {FC, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import MaterialReactTable, {MaterialReactTableProps, MRT_Cell, MRT_ColumnDef, MRT_Row,} from "material-react-table";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import {AttachMoney, Delete, Edit} from "@mui/icons-material";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Employee} from "../entities/employee";
import {AuthContext} from '../context/AuthContext';
import Api from '../api/api';
import {useFetching} from '../hooks/useFetching';

const IMMUTABLE_COLUMN_KEYS = ['id'];

const EmployeesTable : FC = () => {
    const {userInfo} = useContext(AuthContext)!;
    const [employees, setEmployees] = useState<Employee[]>([]);
    const api = useMemo(() => new Api(userInfo?.token), [userInfo]);
    
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<Employee[]>(() => employees);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    
    const [ajaxError, setAjaxError] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    const [fetchEmployees, isEmployeesLoading, employeesError] = useFetching(async () => {
        const employees = await api.getEmployees();
        setEmployees(employees);
        setTableData(employees);
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleCreateNewRow = (values: Employee) => {
        api.createEmployee({employee: values})
        .then(() => {
            setCreateModalOpen(false);
            fetchEmployees();
            setAjaxError(false);
            setSnackbarMessage('Сотрудник успешно добавлен');
            setSnackbarOpen(true);
        })
        .catch(() => {
            setSnackbarMessage('Не удалось сохранить изменения');
            setAjaxError(true);
            setSnackbarOpen(true);
        });
    };

    const handleSaveRowEdits: MaterialReactTableProps<Employee>['onEditingRowSave'] =
        ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                tableData[row.index] = values;
                api.updateEmployee({employee: values})
                .then(() => {
                    setTableData([...tableData]);
                    setAjaxError(false);
                    setSnackbarMessage('Изменения успешно сохранены');
                    setSnackbarOpen(true);
                })
                .catch(() => {
                    setSnackbarMessage('Не удалось сохранить изменения');
                    setAjaxError(true);
                    setSnackbarOpen(true);
                })
                .finally(() => {
                    exitEditingMode();
                });
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleGiveBonus = useCallback(
        (row: MRT_Row<Employee>) => {
            api.giveBonus(row.getValue<number>('id'), new Date())
            .then(() => {
                setAjaxError(false);
                setSnackbarMessage('Бонус успешно начислен');
                setSnackbarOpen(true);
            })
            .catch(() => {
                setSnackbarMessage('Не удалось начислить бонус');
                setAjaxError(true);
                setSnackbarOpen(true);
            });
        },
        [tableData],
    );

    const handleDeleteRow = useCallback(
        async (row: MRT_Row<Employee>) => {
            if (
                !confirm(`Вы точно хотите удалить приём №${row.getValue('id')}?`)
            ) {
                return;
            }
            if (await api.deleteEmployee(row.getValue<number>('id'))) {
                tableData.splice(row.index, 1);
                setTableData([...tableData]);
            } else {
                setSnackbarMessage('Не удалось удалить приём');
                setAjaxError(true);
                setSnackbarOpen(true);
            }
        },
        [tableData],
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<Employee>,
        ): MRT_ColumnDef<Employee>['muiTableBodyCellEditTextFieldProps'] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event) => {
                    const isValid = validateRequired(event.target.value);
                    if (!isValid) {
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `${cell.column.columnDef.header} не может быть пустым`,
                        });
                    } else {
                        delete validationErrors[cell.id];
                        setValidationErrors({
                            ...validationErrors,
                        });
                    }
                },
            };
        },
        [validationErrors],
    );

    const columns = useMemo<MRT_ColumnDef<Employee>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableColumnOrdering: false,
                enableEditing: false,
                enableSorting: false,
                size: 50,
            },
            {
                accessorKey: 'full_name',
                header: 'ФИО',
                size: 210,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'education',
                header: 'Образование',
                size: 100,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'position',
                header: 'Должность',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'salary',
                header: 'Зарплата',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'city',
                header: 'Филиал',
                enableEditing: false,
                size: 80,
            },
        ],
        [getCommonEditTextFieldProps],
    );

    if (isEmployeesLoading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={ajaxError ? 'error' : 'success'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <MaterialReactTable
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 80,
                    },
                }}
                columns={columns}
                data={tableData}
                editingMode="modal"
                enableColumnOrdering
                enableEditing
                localization={MRT_Localization_RU}
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip arrow placement="left" title="Редактировать">
                            <IconButton onClick={() => table.setEditingRow(row)}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Удалить">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Дать бонус">
                            <IconButton color="success" onClick={() => handleGiveBonus(row)}>
                                <AttachMoney />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Button
                        color="secondary"
                        onClick={() => setCreateModalOpen(true)}
                        variant="contained"
                    >
                        Добавить сотрудника
                    </Button>
                )}
            />
            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            />
        </>
    );
};

export const CreateNewAccountModal: FC<{
    columns: MRT_ColumnDef<Employee>[];
    onClose: () => void;
    onSubmit: (values: Employee) => void;
    open: boolean;
}> = ({ open, columns, onClose, onSubmit }) => {
    const [values, setValues] = useState<any>(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {} as any),
    );

    const handleSubmit = () => {
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Добавить сотрудника</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        {columns.filter(column => !IMMUTABLE_COLUMN_KEYS.includes(column.accessorKey!)).map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }
                            />
                        ))}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Отмена</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value: string) => !!value.length;

export default EmployeesTable;

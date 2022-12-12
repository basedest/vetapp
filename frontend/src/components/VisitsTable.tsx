import {FC, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import MaterialReactTable, {MaterialReactTableProps, MRT_Cell, MRT_ColumnDef, MRT_Row,} from "material-react-table";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Visit} from "../entities/visit";
import {AuthContext} from '../context/AuthContext';
import Api from '../api/api';
import {useFetching} from '../hooks/useFetching';

const IMMUTABLE_COLUMN_KEYS = ['id'];

const VisitsTable : FC = () => {
    const {userInfo} = useContext(AuthContext)!;
    const api = useMemo(() => new Api(userInfo?.token), [userInfo]);
    const [visits, setVisits] = useState<Visit[]>([]);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<Visit[]>(() => visits);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    const [fetchVisits, isVisitsLoading, visitsError] = useFetching(async () => {
        const visits = await api.getVisits();
        setVisits(visits);
        setTableData(visits.map((client) => ({ ...client, date: new Date(client.date) })));
    });

    useEffect(() => {
        fetchVisits();
    }, []);

    const handleCreateNewRow = async (values: Visit) => {
        if (await api.createVisit({visit: values})) {
            setCreateModalOpen(false);
            fetchVisits();
        }
    };

    const handleSaveRowEdits: MaterialReactTableProps<Visit>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                values.date = new Date(values.date);
                tableData[row.index] = values;
                if (await api.updateVisit({visit: values})
                ) {
                    setTableData([...tableData]);
                    exitEditingMode(); //required to exit editing mode and close modal
                }
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        async (row: MRT_Row<Visit>) => {
            if (
                !confirm(`Вы точно хотите удалить приём №${row.getValue('id')}?`)
            ) {
                return;
            }
            if (await api.deleteVisit(row.getValue('id'))) {
                setTableData(tableData.filter((visit) => visit.id !== row.getValue('id')));
            }
        },
        [tableData],
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<Visit>,
        ): MRT_ColumnDef<Visit>['muiTableBodyCellEditTextFieldProps'] => {
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

    const columns = useMemo<MRT_ColumnDef<Visit>[]>(
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
                accessorKey: 'procedures',
                header: 'Процедуры',
                size: 210,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'date',
                header: 'Дата',
                size: 100,
                enableEditing: false,
                Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString()
            },
            {
                accessorKey: 'cost',
                header: 'Сумма',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'client_id',
                header: 'ID клиента',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'employee_id',
                header: 'ID сотрудника',
                size: 80,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
        ],
        [getCommonEditTextFieldProps],
    );

    return (
        <>
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
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Button
                        color="secondary"
                        onClick={() => setCreateModalOpen(true)}
                        variant="contained"
                    >
                        Добавить приём
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
    columns: MRT_ColumnDef<Visit>[];
    onClose: () => void;
    onSubmit: (values: Visit) => void;
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
            <DialogTitle textAlign="center">Добавить приём</DialogTitle>
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

export default VisitsTable;

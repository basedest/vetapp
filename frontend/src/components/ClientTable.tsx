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
    MenuItem,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {Client} from "../entities/client";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {useFetching} from '../hooks/useFetching';
import {AuthContext} from '../context/AuthContext';
import Api from '../api/api';


const IMMUTABLE_COLUMN_KEYS = ['id', 'last_visit', 'total_spent', 'total_visits', 'regular_customer'];

const ClientsTable : FC = () => {
    const {userInfo} = useContext(AuthContext)!;
    const api = useMemo(() => new Api(userInfo?.token), [userInfo]);
    const [clients, setClients] = useState<Client[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<Client[]>(() => clients);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    const [fetchClients, isClientsLoading, clientsError] = useFetching(async () => {
        const clients = await api.getClients();
        setClients(clients);
        setTableData(clients.map((client) => ({ ...client, last_visit: new Date(client.last_visit) })));
    })

    useEffect(() => {
        fetchClients();
    }, []);

    const handleCreateNewRow = async (values: Client) => {
        if (await api.createClient({client: values})) {
            setCreateModalOpen(false);
            fetchClients();
        }
    };

    const handleSaveRowEdits: MaterialReactTableProps<Client>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                values.last_visit = new Date(values.last_visit);
                tableData[row.index] = values;
                await api.updateClient({client: values});
                setTableData([...tableData]);
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        async (row: MRT_Row<Client>) => {
            if (
                !confirm(`Вы точно хотите удалить ${row.getValue('full_name')}?`)
            ) {
                return;
            }
            if (await api.deleteClient(row.getValue('id'))) {
                setTableData(tableData.filter((client) => client.id !== row.getValue('id')));
            }

        },
        [tableData],
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<Client>,
        ): MRT_ColumnDef<Client>['muiTableBodyCellEditTextFieldProps'] => {
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

    const columns = useMemo<MRT_ColumnDef<Client>[]>(
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
                accessorKey: 'animal_name',
                header: 'Кличка животного',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'animal_kind',
                header: 'Вид животного',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'animal_gender',
                header: 'Пол',
                size: 80,
                muiTableBodyCellEditTextFieldProps: {
                    select: true,
                    children: ['женский', 'мужской'].map(sex => (
                        <MenuItem key={sex} value={sex}>
                            {sex}
                        </MenuItem>
                    )),
                },
            },
            {
                accessorKey: 'last_visit',
                header: 'Дата последнего визита',
                size: 100,
                enableEditing: false,
                Cell: ({ cell }) => {
                    return cell.getValue<Date>().getTime() === 0 ? 'Нет визитов' :
                    cell.getValue<Date>().toLocaleDateString()
                }
            },
            {
                accessorKey: 'total_spent',
                header: 'Всего потрачено',
                size: 80,
                enableEditing: false,
            },
            {
                accessorKey: 'total_visits',
                header: 'Всего приёмов',
                size: 50,
                enableEditing: false,
            },
            {
                accessorKey: 'regular_customer',
                header: 'Постоянный клиент',
                size: 50,
                enableEditing: false,
                Cell: ({ cell }) => cell.getValue<boolean>() ? 'Да' : 'Нет'
            }
        ],
        [getCommonEditTextFieldProps],
    );
    
    if (isClientsLoading) {
        return <CircularProgress />;
    }

    if (clientsError) {
        return <Alert severity="error">{clientsError}</Alert>;
    }

    return (
        <>
            <MaterialReactTable
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
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
                        Добавить клиента
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
    columns: MRT_ColumnDef<Client>[];
    onClose: () => void;
    onSubmit: (values: Client) => void;
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
            <DialogTitle textAlign="center">Добавить нового клиента</DialogTitle>
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

export default ClientsTable;
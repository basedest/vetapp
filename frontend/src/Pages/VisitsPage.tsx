import {Autocomplete, Box, CircularProgress, Paper, Stack, TextField, Typography} from "@mui/material"
import {useContext, useEffect, useMemo, useState} from "react";
import Api from "../api/api";
import VisitsTable from "../components/VisitsTable"
import {AuthContext} from "../context/AuthContext";
import {useFetching} from "../hooks/useFetching";

const VisitsPage = () => {
    const {userInfo} = useContext(AuthContext)!;
    const [id, setId] = useState<number>(0);
    const [appointments, setAppointments] = useState<number | null>(null);
    const api = useMemo(() => new Api(userInfo?.token), [userInfo]);

    const [fetchAppointments, isAppointmentsLoading, _] = useFetching(async () => {
        const appointments = await api.getEmployeeAppointmentCount(id);
        console.log(appointments);
        
        setAppointments(appointments);
    });

    useEffect(() => {
        fetchAppointments();
    }, [id]);

    return (
    <Stack margin={4} gap={4} alignItems='center'>
        <Paper elevation={2}>
            <Box paddingX={20} paddingY={4} maxWidth='lg'>
                <Autocomplete
                    value={id}
                    inputMode="numeric"
                    defaultValue={1}
                    datatype="number"
                    onChange={(event, newValue) => {
                        setId(newValue as number);
                    }}
                    selectOnFocus
                    clearOnBlur
                    options={[]}
                    freeSolo
                    disableClearable
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="ID сотрудника"
                            InputProps={{ ...params.InputProps, type: 'number' }}
                        />
                    )}
                />
                {
                isAppointmentsLoading ? <CircularProgress /> :
                appointments !== null &&
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {appointments === 0 ? 'Нет предстоящих приемов' : `Назначено приемов: ${appointments}`}
                </Typography>
                }
            </Box>
        </Paper>
        <VisitsTable />
    </Stack>
    )
}

export default VisitsPage
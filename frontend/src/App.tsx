import { useEffect, useMemo, useState } from 'react'
import {Container, createTheme, CssBaseline, ThemeProvider, Typography} from '@mui/material';
import { AuthContext, UserInfo } from './context/AuthContext';
import Dashboard from './Pages/Dashboard';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import ResponsiveAppBar, { MenuItemEntry } from './components/AppBar';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ClientsTable from './components/ClientTable';
import EmployeesTable from './components/EmployeesTable';
import VisitsPage from './Pages/VisitsPage';
import menuSwitch from './utils/menuSwitch';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#ff9800',
        },
        secondary: {
            main: '#4caf50',
        },
    },
});

const App = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            setUserInfo(JSON.parse(localStorage.getItem('userInfo')!))
        }
        setIsLoading(false)
    }, [])  

    const menuItems: MenuItemEntry[] = useMemo(() => {
        if (!userInfo) {
            return [];
        }
        return menuSwitch(userInfo!.user!.role);
    }, [userInfo])

    if (isLoading) {
        return <Typography>Загрузка...</Typography>
    }

    return (
        <AuthContext.Provider value={{
            userInfo,
            setUserInfo,
            isLoading,
        }}>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <ResponsiveAppBar menuItems={menuItems} />
                <Container component='main' maxWidth={'xl'} disableGutters>
                    <Routes>
                        <Route path='/' element={userInfo ? <Navigate to='/dashboard' /> : <Navigate to='/signin' />} />
                        <Route path='/dashboard' element={userInfo ? <Dashboard /> : <Navigate to='/signin' />} />
                        <Route path='/signin' element={!userInfo ? <SignIn /> : <Navigate to='/' />} />
                        <Route path='/signup' element={!userInfo ? <SignUp /> : <Navigate to='/' />} />
                        {    userInfo &&
                        <>
                            <Route path='/clients' element={<ClientsTable />} />
                            <Route path='/visits' element={<VisitsPage />} />
                            <Route path='/employees' element={<EmployeesTable />} />
                        </>
                        }
                        <Route path='*' element={<Typography>404</Typography>} />
                    </Routes>
                </Container>
            </ThemeProvider>
        </AuthContext.Provider>
    )
}

export default App

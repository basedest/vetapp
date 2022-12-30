import {Link as MaterialLink, Typography} from '@mui/material';
import {MenuItemEntry} from '../components/AppBar';
import {Link} from 'react-router-dom';
import {UserRole} from '../entities/user';

const employeeMenu : MenuItemEntry[] = [
    {
        label: 'Клиенты',
        component: <Typography 
            component={Link} 
            sx={{textDecoration: 'none', color: 'inherit'}} 
            to="/clients"
        >
            Клиенты</Typography>
    },
    {
        label: 'Приемы',
        component: <Typography 
            component={Link} 
            sx={{textDecoration: 'none', color: 'inherit'}} 
            to="/visits"
        >
            Приемы</Typography>
    }
]

const managerMenu : MenuItemEntry[] = [
    {
        label: 'Сотрудники',
        component: <Typography

            component={Link}
            sx={{textDecoration: 'none', color: 'inherit'}}
            to="/employees"
        >
            Сотрудники</Typography>
    }
]

const adminMenu : MenuItemEntry[] = [
    {
        label: 'База',
        component: <Typography
            component={MaterialLink}
            sx={{textDecoration: 'none', color: 'inherit'}}
            href="/pgadmin"
        >
            База</Typography>
    }
]

export default function menuSwitch(role: UserRole) : MenuItemEntry[] {
    switch (role) {
        case 'employee':
            return employeeMenu;
        case 'manager':
            return managerMenu;
        case 'admin':
            return [...employeeMenu, ...managerMenu, ...adminMenu];
        default:
            return [];
    }
}
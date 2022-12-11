import { Box, Button, Card, Container, Typography } from '@mui/material'
import React from 'react'
import { redirect } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
const Dashboard = () => {
    const userContext = React.useContext(AuthContext);
    return (
        <>
            <Container maxWidth={'sm'} sx={{
                        display: 'flex',
                        padding: '2rem',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',}}>
                <Card
                    sx={{
                        
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        padding: '2rem',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant='h5' sx={{ mb: 2 }}>
                        Имя пользователя: {userContext?.userInfo?.user.username}
                    </Typography>
                    <Typography variant='h5' sx={{ mb: 2 }}>
                        Роль: {userContext?.userInfo?.user.role}
                    </Typography>
                    <Button variant='contained' sx={{ mt: 2 }} onClick={() => {
                        localStorage.removeItem('userInfo')
                        userContext?.setUserInfo(null)
                        redirect('/')
                    }}>
                        Выйти
                    </Button>
                </Card>
            </Container>
        </>
    )
}

export default Dashboard
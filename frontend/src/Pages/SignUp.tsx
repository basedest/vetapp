import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Link as RouterLink} from 'react-router-dom';
import Api from '../api/api';
import {AuthContext} from '../context/AuthContext';
import {Dialog} from '@mui/material';
import {Stack} from '@mui/system';
import {Error} from '@mui/icons-material';

export default function SignUp() {
    const [errorModalOpen, setErrorModalOpen] = React.useState(false);
    const [errorModalText, setErrorModalText] = React.useState('');
    const api = React.useMemo(() => new Api(), []);

    const authContext = React.useContext(AuthContext);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            password: data.get('password'),
        });
        api.register(data.get('username') as string, data.get('password') as string)
            .then((response) => {
                authContext?.setUserInfo({
                    user: response.user,
                    token: response.token,
                });
                console.log(response);
                localStorage.setItem('userInfo', JSON.stringify(response));
            })
            .catch((error) => {
                console.log(error);
                setErrorModalText(error.message);
                setErrorModalOpen(true);
            });
    };

    return (
                <>
                    <Dialog 
                        open={errorModalOpen}
                        onClose={() => setErrorModalOpen(false)}
                    >
                        <Container>
                            <Stack direction="row" spacing={1} alignItems="center" component={Box} sx={{padding: 2}}>
                                <Error sx={{color: 'red'}} />
                                <Typography variant="h6">Ошибка</Typography>
                            </Stack>
                        <Typography>{errorModalText}</Typography>
                        </Container>
                    </Dialog>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Регистрация
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Имя пользователя"
                                name="username"
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Пароль"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Зарегистрироваться
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                </Grid>
                                <Grid item>
                                <RouterLink to={'/signin'}>
                                        <Link variant="body2">
                                        {"Уже есть аккаунт? Войти"}
                                        </Link>
                                    </RouterLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </>
    );
}
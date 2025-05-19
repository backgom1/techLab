import {
    Button,
    TextField,
    Container,
    Box,
    Typography,
    Paper,
    Snackbar, Alert
} from '@mui/material';
import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";
import * as React from "react";
import {useLocation, useNavigate} from "react-router";
import {authService, type LoginRequest} from "./AuthService.ts";
import {useAuth} from "../../common/AuthContext.tsx";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {setIsAuthenticated} = useAuth();

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });


    useEffect(() => {
        if (location.state?.registrationSuccess) {
            setSnackbar({
                open: true,
                message: '회원가입이 성공적으로 완료되었습니다!',
                severity: 'success'
            });

            navigate(location.pathname, {replace: true, state: {}});
        }
    }, [location, navigate]);

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };


    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const response = await authService.login(formData);
            // 로그인 성공 시 인증 상태 업데이트
            setIsAuthenticated(true); // 추가
            navigate('/dashboard');
        } catch (err: any) {
            console.log("로그인 실패");
            setSnackbar({
                open: true,
                message: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
                severity: 'error'
            });
        }
    };


    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{padding: 4, width: '100%'}}
                >
                    <Typography component="h1" variant="h5" align="center">
                        로그인
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="이메일 주소"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            로그인
                        </Button>
                    </Box>
                </Paper>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{width: '100%'}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default LoginPage;
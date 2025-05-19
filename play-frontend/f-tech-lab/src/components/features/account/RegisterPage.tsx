import React, {useState} from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    Avatar,
    Grid, Snackbar, Alert
} from '@mui/material';
import {Link} from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useNavigate} from "react-router";
import {type RegisterRequest, registerService} from "./RegisterService.ts";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 비밀번호 확인 검사만 간단히 수행
        if (formData.password !== formData.confirmPassword) {
            setSnackbar({
                open: true,
                message: '비밀번호가 일치하지 않습니다.',
                severity: 'error'
            });
            return;
        }

        try {

            // RegisterRequest 객체 생성
            const registerRequest: RegisterRequest = {
                name: formData.id,
                email: formData.email,
                password: formData.password
            };

            // API 호출
            const response = await registerService.register(registerRequest);

            // API 호출 성공
            if (response.status === 200 || response.status === 201) {
                setSnackbar({
                    open: true,
                    message: '회원가입이 성공적으로 완료되었습니다!',
                    severity: 'success'
                });
                navigate('/login', {
                    state: {
                        registrationSuccess: true,
                        message: '회원가입이 성공적으로 완료되었습니다!'
                    }
                });
            } else {
                throw new Error('회원가입 실패');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setSnackbar({
                open: true,
                message: '회원가입 중 오류가 발생했습니다.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    mt: 8,
                    mb: 2,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{mb: 3}}>
                    회원가입
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1, width: '100%'}}>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="id"
                        label="아이디"
                        name="id"
                        autoComplete="id"
                        autoFocus
                        size="small"
                        value={formData.id}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="이메일 주소"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        size="small"
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
                        autoComplete="new-password"
                        size="small"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="비밀번호 확인"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        size="small"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        가입하기
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Link to="/login"
                              style={{fontSize: '0.875rem', color: '#1976d2', textDecoration: 'underline'}}>
                            이미 계정이 있으신가요? 로그인
                        </Link>
                    </Grid>
                </Box>
            </Paper>

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
};

export default RegisterPage;
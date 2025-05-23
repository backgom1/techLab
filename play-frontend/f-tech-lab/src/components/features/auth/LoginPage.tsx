import {
    Button,
    TextField,
    Container,
    Box,
    Typography,
    Paper
} from '@mui/material';
import {type ChangeEvent, type FormEvent, useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router";
import {authService, type LoginRequest} from "./AuthService.ts";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });

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
            authService.saveToken(response.data.token);

            navigate('/dashboard');
        } catch (err : any) {
            console.log("로그인 실패")
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
        </Container>
    );
}

export default LoginPage;
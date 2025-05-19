import './App.css'
import {Outlet, useLocation, useNavigate} from "react-router";
import {AuthProvider, useAuth} from "./components/common/AuthContext.tsx";
import {useEffect} from "react";
import {authService} from './components/features/auth/AuthService.ts';

const AuthInterceptor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {setIsAuthenticated} = useAuth();

    useEffect(() => {
        // 인터셉터 설정
        const redirectCallback = (to: string, message?: string) => {
            // 인증 상태 업데이트
            setIsAuthenticated(false);

            // 현재 경로가 로그인 페이지가 아닌 경우에만 리다이렉트
            if (location.pathname !== '/login') {
                navigate(to, {
                    state: {
                        from: location.pathname,
                        errorMessage: message
                    }
                });
            }
        };

        authService.setupInterceptors(redirectCallback);
    }, [navigate, location.pathname, setIsAuthenticated]);

    return null;
};

function App() {
    return (
        <>
            <AuthProvider>
                <AuthInterceptor/>
                <div>
                    <Outlet/>
                </div>
            </AuthProvider>
        </>
    )
}

export default App

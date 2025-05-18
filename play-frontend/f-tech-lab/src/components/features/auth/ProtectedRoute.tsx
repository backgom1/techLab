import { Navigate, useLocation } from 'react-router-dom';
import type {ReactNode} from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const token = localStorage.getItem('accessToken');

    if (!token) {
        // 토큰이 없으면 로그인 페이지로 리다이렉트하고 현재 경로 정보를 state로 전달
        return <Navigate to="/login" state={{ from: location.pathname, errorMessage: '로그인이 필요한 페이지입니다.' }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
import React, {createContext, useContext, useState, type ReactNode} from 'react';

// 인증 상태를 관리할 컨텍스트 생성
const AuthContext = createContext<{
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}>({
    isAuthenticated: false,
    setIsAuthenticated: () => {
    },
});

// AuthProvider 컴포넌트
export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth 훅
export const useAuth = () => useContext(AuthContext);
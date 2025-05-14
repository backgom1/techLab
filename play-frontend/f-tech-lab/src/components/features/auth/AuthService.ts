import {HttpClient, type ApiResponse} from "../../common/HttpClient.ts";


const API_BASE_URL = 'http://localhost:8080/api';


export interface User {
    id: number;
    email: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export class AuthService {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient(API_BASE_URL);
    }

    // 로그인 메서드
    public async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return this.httpClient.post<LoginResponse, LoginRequest>('/api/v1/auth/login', request);
    }

    // 사용자 정보 조회
    public async getUserProfile(): Promise<ApiResponse<User>> {
        return this.httpClient.get<User>('/users/profile');
    }

    // 사용자 정보 업데이트
    public async updateUserProfile(user: Partial<User>): Promise<ApiResponse<User>> {
        return this.httpClient.put<User, Partial<User>>(`/users/profile`, user);
    }

    // 사용자 삭제
    public async deleteUser(userId: number): Promise<ApiResponse<void>> {
        return this.httpClient.delete<void>(`/users/${userId}`);
    }

    // JWT 토큰 저장
    public saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    // JWT 토큰 가져오기
    public getToken(): string | null {
        return localStorage.getItem('token');
    }

    // JWT 토큰 삭제 (로그아웃)
    public removeToken(): void {
        localStorage.removeItem('token');
    }
}

// API 서비스 인스턴스 생성 및 내보내기
export const authService = new AuthService();
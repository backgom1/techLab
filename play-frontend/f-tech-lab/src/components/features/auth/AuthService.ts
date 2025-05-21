import {HttpClient, type ApiResponse} from "../../common/HttpClient.ts";

const API_BASE_URL = '/api/v1';


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
    accessToken: string;
}

export class AuthService {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient(API_BASE_URL);
    }

    // 로그인 메서드
    public async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return this.httpClient.post<LoginResponse, LoginRequest>('/auth/login', request);
    }


    // 사용자 삭제
    public async deleteUser(userId: number): Promise<ApiResponse<void>> {
        return this.httpClient.delete<void>(`/users/${userId}`);
    }

}

// API 서비스 인스턴스 생성 및 내보내기
export const authService = new AuthService();
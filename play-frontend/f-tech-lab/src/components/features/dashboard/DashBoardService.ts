import {HttpClient, type ApiResponse} from "../../common/HttpClient.ts";


const API_BASE_URL = 'api/v1';


export class DashBoardService {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient(API_BASE_URL);
    }

    public async list(): Promise<ApiResponse<VoidFunction>> {
        return this.httpClient.get<VoidFunction>('/dashboard');
    }
}

// API 서비스 인스턴스 생성 및 내보내기
export const dashBoardService = new DashBoardService();
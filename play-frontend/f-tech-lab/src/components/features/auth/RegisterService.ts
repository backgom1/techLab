import {HttpClient, type ApiResponse} from "../../common/HttpClient.ts";


const API_BASE_URL = '/api/v1';


export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterService {

    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient(API_BASE_URL);
    }

    public async register(request: RegisterRequest): Promise<ApiResponse<VoidFunction>> {
        return this.httpClient.post<VoidFunction, RegisterRequest>('/account/register', request);
    }
}

export const registerService = new RegisterService();
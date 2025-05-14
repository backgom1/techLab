import axios, {AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse} from "axios";


export interface BackendResponse<T = any> {
    success: boolean;
    message: string;
    messageCode: string;
    data: T;
}

export interface ApiResponse<T = any> {
    data: BackendResponse<T>;
    status: number;
    statusText: string;
    headers: any;
}


export class HttpClient {
    private instance: AxiosInstance;
    private readonly baseURL: string;
    private readonly timeout: number;

    constructor(baseURL: string = "", timeout: number = 30000) {
        this.baseURL = baseURL;
        this.timeout = timeout;
        this.instance = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: {
                "Content-Type": "application/json",
            },
        });

        // 요청 인터셉터 설정
        this.instance.interceptors.request.use(
            (config) => {
                // 토큰이 필요한 경우 여기서 처리
                const token = localStorage.getItem("token");
                if (token) {
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 응답 인터셉터 설정
        this.instance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                // 401 에러 처리 (토큰 만료 등)
                if (error.response && error.response.status === 401) {
                    // 로그아웃 처리 또는 토큰 갱신 로직
                    localStorage.removeItem("token");
                    // window.location.href = "/login"; // 로그인 페이지로 리다이렉트
                }
                return Promise.reject(error);
            }
        );
    }

    // GET 요청
    public async get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<BackendResponse<T>> = await this.instance.get<BackendResponse<T>>(url, config);
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // POST 요청
    public async post<T = any, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<BackendResponse<T>> = await this.instance.post<BackendResponse<T>>(url, data, config);
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // PUT 요청
    public async put<T = any, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<BackendResponse<T>> = await this.instance.put<BackendResponse<T>>(url, data, config);
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // DELETE 요청
    public async delete<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<BackendResponse<T>> = await this.instance.delete<BackendResponse<T>>(url, config);
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }


    private handleError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                console.error('API 에러 응답:', {
                    data: axiosError.response.data,
                    status: axiosError.response.status,
                    statusText: axiosError.response.statusText,
                });
                throw new Error(`API 에러: ${axiosError.response.status} ${axiosError.response.statusText}`);
            } else if (axiosError.request) {
                console.error('응답 없음:', axiosError.request);
                throw new Error('서버로부터 응답이 없습니다.');
            } else {
                console.error('요청 설정 오류:', axiosError.message);
                throw new Error(`요청 오류: ${axiosError.message}`);
            }
        } else {
            console.error('예상치 못한 에러:', error);
            throw new Error('예상치 못한 오류가 발생했습니다.');
        }
    }
}
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosHeaders } from 'axios';

// 응답 인터페이스
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

// 토큰 관련 인터페이스
export interface TokenRefreshResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

// 확장된 AxiosRequestConfig 타입 (커스텀 속성 추가)
interface ExtendedRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
    _skipAuthRefresh?: boolean;
}

// 토큰 에러 코드
const TokenErrorCode = {
    MISSING: 'TOKEN-E-001',
    EXPIRED: 'TOKEN-E-002',
    INVALID: 'TOKEN-E-003'
};

export class HttpClient {
    private readonly instance: AxiosInstance;
    private refreshingPromise: Promise<boolean> | null = null;
    private unauthorizedCallback: () => void;
    private readonly baseURL: string;
    private readonly timeout: number;

    constructor(baseURL = '', timeout = 30000, unauthorizedCallback?: () => void) {
        // 클래스 멤버 변수로 설정
        this.baseURL = baseURL;
        this.timeout = timeout;

        // 인증 실패 콜백 설정
        this.unauthorizedCallback = unauthorizedCallback || (() => {
            console.warn('401 Unauthorized: redirectCallback이 제공되지 않았습니다.');
            window.location.href = '/login';
        });

        // Axios 인스턴스 생성
        this.instance = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        // 요청 인터셉터 설정
        this.setupRequestInterceptor();

        // 응답 인터셉터 설정
        this.setupResponseInterceptor();
    }

    /**
     * 요청 인터셉터 설정
     */
    private setupRequestInterceptor(): void {
        this.instance.interceptors.request.use(
            (config) => {
                // 헤더가 없으면 빈 AxiosHeaders 객체 생성
                if (!config.headers) {
                    config.headers = new AxiosHeaders();
                }

                // 캐시 방지 헤더 추가
                config.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
                config.headers.set('Pragma', 'no-cache');
                config.headers.set('Expires', '0');

                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    /**
     * 응답 인터셉터 설정
     */
    private setupResponseInterceptor(): void {
        this.instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                // 오류가 아닌 경우 혹은 Axios 에러가 아닌 경우 그대로 전달
                if (!axios.isAxiosError(error)) {
                    console.error('예상치 못한 에러:', error);
                    return Promise.reject(error);
                }

                const axiosError = error as AxiosError;

                // 응답이 없는 경우 (서버 연결 실패 등)
                if (!axiosError.response) {
                    this.logErrorDetails(axiosError);
                    return Promise.reject(error);
                }

                const config = axiosError.config as ExtendedRequestConfig | undefined;

                // 설정이 없거나 토큰 갱신 요청인 경우 인터셉터 처리 건너뛰기
                if (!config || config._skipAuthRefresh) {
                    return Promise.reject(error);
                }

                // 401 Unauthorized 에러 처리
                if (axiosError.response.status === 401) {
                    return this.handle401Error(axiosError, config);
                }

                // 기타 API 에러 로깅
                this.logErrorDetails(axiosError);
                return Promise.reject(error);
            }
        );
    }

    /**
     * 401 Unauthorized 에러 처리
     */
    private async handle401Error(axiosError: AxiosError, config: ExtendedRequestConfig): Promise<AxiosResponse> {
        const responseData = axiosError.response?.data as any;

        // 응답 데이터가 없거나 메시지 코드가 없는 경우
        if (!responseData || !responseData.messageCode) {
            this.unauthorizedCallback();
            return Promise.reject(axiosError);
        }

        // 토큰 상태에 따른 처리
        switch (responseData.messageCode) {
            case TokenErrorCode.MISSING:
                console.log(responseData.message || '토큰이 없습니다.');
                this.unauthorizedCallback();
                break;

            case TokenErrorCode.EXPIRED:

                // 이미 재시도했는지 확인
                if (config._retry) {
                    this.unauthorizedCallback();
                    return Promise.reject(axiosError);
                }

                // 토큰 갱신 시도
                config._retry = true;

                try {
                    const refreshed = await this.refreshAccessToken();

                    if (refreshed) {
                        return this.instance(config);
                    } else {
                        this.unauthorizedCallback();
                    }
                } catch (refreshError) {
                    this.unauthorizedCallback();
                }
                break;

            case TokenErrorCode.INVALID:
                this.unauthorizedCallback();
                break;

            default:
                this.unauthorizedCallback();
        }

        return Promise.reject(axiosError);
    }

    /**
     * 액세스 토큰 갱신
     */
    private refreshAccessToken(): Promise<boolean> {
        // 이미 진행 중인 갱신 작업이 있으면 그 결과를 반환
        if (this.refreshingPromise) {
            return this.refreshingPromise;
        }

        // Promise 생성자에서 async를 사용하지 않도록 수정
        this.refreshingPromise = new Promise<boolean>((resolve) => {
            // 비동기 작업을 즉시 실행 함수로 이동
            (async () => {
                try {

                    // 헤더 생성 - AxiosHeaders 객체 사용
                    const headers = new AxiosHeaders();
                    headers.set('Content-Type', 'application/json');
                    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
                    headers.set('Pragma', 'no-cache');
                    headers.set('Expires', '0');

                    // 토큰 갱신 요청 - 인터셉터 무시 플래그 포함
                    const response = await this.instance.post<BackendResponse<TokenRefreshResponse>>(
                        '/auth/refresh',
                        {},
                        {
                            withCredentials: true,
                            _skipAuthRefresh: true, // 인터셉터 건너뛰기
                            headers
                        } as ExtendedRequestConfig
                    );

                    if (response.data.success) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const axiosError = error as AxiosError;
                        const status = axiosError.response?.status;
                        const data = axiosError.response?.data;
                    } else {
                        console.error('토큰 갱신 중 예상치 못한 오류:', error);
                    }
                    resolve(false);
                } finally {
                    this.refreshingPromise = null;
                }
            })();
        });

        return this.refreshingPromise;
    }

    /**
     * 에러 상세 로깅
     */
    private logErrorDetails(axiosError: AxiosError): void {
        const config = axiosError.config as ExtendedRequestConfig | undefined;
        const isTokenRefreshRequest = config?.url?.includes('/auth/refresh');

        // 토큰 갱신 요청이면서 401 오류인 경우 로깅 건너뛰기
        if (isTokenRefreshRequest && axiosError.response?.status === 401) {
            return;
        }


        if (axiosError.response) {
            console.error('API 에러 응답:', {
                status: axiosError.response.status,
                statusText: axiosError.response.statusText,
                data: axiosError.response.data
            });
        } else if (axiosError.request) {
            console.error('응답 없음:', axiosError.request);
        } else {
            console.error('요청 설정 오류:', axiosError.message);
        }
    }

    /**
     * 인증 실패 콜백 설정
     */
    public setUnauthorizedCallback(callback: () => void): void {
        this.unauthorizedCallback = callback;
    }

    /**
     * GET 요청 메서드
     */
    public async get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            // 헤더 설정을 함수로 분리
            const fullConfig = this.addCacheHeaders(config);
            const response = await this.instance.get<BackendResponse<T>>(url, fullConfig);
            return this.createSuccessResponse(response);
        } catch (error) {
            return this.handleRequestError(error);
        }
    }

    /**
     * POST 요청 메서드
     */
    public async post<T = any, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const fullConfig = this.addCacheHeaders(config);
            const response = await this.instance.post<BackendResponse<T>>(url, data, fullConfig);
            return this.createSuccessResponse(response);
        } catch (error) {
            return this.handleRequestError(error);
        }
    }

    /**
     * PUT 요청 메서드
     */
    public async put<T = any, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const fullConfig = this.addCacheHeaders(config);
            const response = await this.instance.put<BackendResponse<T>>(url, data, fullConfig);
            return this.createSuccessResponse(response);
        } catch (error) {
            return this.handleRequestError(error);
        }
    }

    /**
     * DELETE 요청 메서드
     */
    public async delete<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const fullConfig = this.addCacheHeaders(config);
            const response = await this.instance.delete<BackendResponse<T>>(url, fullConfig);
            return this.createSuccessResponse(response);
        } catch (error) {
            return this.handleRequestError(error);
        }
    }

    /**
     * 캐시 방지 헤더 추가
     */
    private addCacheHeaders(config?: AxiosRequestConfig): AxiosRequestConfig {
        const newConfig = config ? { ...config } : {};

        // 헤더가 없으면 생성
        if (!newConfig.headers) {
            newConfig.headers = new AxiosHeaders();
        }

        // AxiosHeaders의 메서드를 사용하여 헤더 추가
        if (newConfig.headers instanceof AxiosHeaders) {
            newConfig.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            newConfig.headers.set('Pragma', 'no-cache');
            newConfig.headers.set('Expires', '0');
        } else {
            // 헤더가 일반 객체인 경우 처리
            newConfig.headers = {
                ...newConfig.headers,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            };
        }

        return newConfig;
    }

    /**
     * 성공 응답 생성
     */
    private createSuccessResponse<T>(response: AxiosResponse<BackendResponse<T>>): ApiResponse<T> {
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        };
    }

    /**
     * 요청 에러 처리
     */
    private handleRequestError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                throw new Error(`API 에러: ${axiosError.response.status} ${axiosError.response.statusText}`);
            } else if (axiosError.request) {
                throw new Error('서버로부터 응답이 없습니다.');
            } else {
                throw new Error(`요청 오류: ${axiosError.message}`);
            }
        } else {
            throw new Error('예상치 못한 오류가 발생했습니다.');
        }
    }
}
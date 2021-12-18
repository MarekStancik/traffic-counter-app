import {BehaviorSubject, firstValueFrom, Observable, timer} from "rxjs";

export type ApiServiceState = "init" | "unauthenticated" | "authenticated";

class ApiService {
    public static readonly SESSION_TOKEN_STORAGE_KEY = "traffic-app.session-token";

    private _state$: BehaviorSubject<ApiServiceState> = new BehaviorSubject("init" as ApiServiceState);
    private _sessionToken: string | null = null;

    constructor() {
        this.initialize();
    }

    public get state$(): Observable<ApiServiceState> {
        return this._state$.asObservable();
    }

    private async initialize(): Promise<void> {
        await firstValueFrom(timer(1000));
        const storedSessionKey = window.localStorage.getItem(ApiService.SESSION_TOKEN_STORAGE_KEY);
        if (storedSessionKey) {
            this._sessionToken = storedSessionKey;
            try {
                await this.invoke("get", "authentication");
                this._state$.next("authenticated");
            } catch (error) {
                this._sessionToken = null;
                this._state$.next("unauthenticated");
            }
        } else {
            this._sessionToken = null;
            this._state$.next("unauthenticated");
        }
    }

    public async authenticate(username: string, password: string): Promise<void> {
        const response = {sessionToken: "mockToken"};//await this.invoke("post", "authentication", {username, password}, true);
        if (response?.sessionToken) {
            this._sessionToken = response.sessionToken as string;
            window.localStorage.setItem(ApiService.SESSION_TOKEN_STORAGE_KEY, this._sessionToken);
            this._state$.next("authenticated");
        }
    }

    public async deauthenticate(): Promise<void> {
        await this.invoke("delete", "authentication");
        this._sessionToken = null;
        window.localStorage.removeItem(ApiService.SESSION_TOKEN_STORAGE_KEY);
        this._state$.next("unauthenticated");
    }

    public async invoke<T = any>(method: "get" | "post" | "put" | "delete", url: string, data?: any, noToken?: boolean): Promise<T> {
        const headers = new Headers();
        if (method === "post" || method === "put") {
            headers.append("content-type", "application/json");
        }
        if (this._sessionToken && !noToken) {
            headers.append("x-session-token", this._sessionToken);
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
            method,
            headers,
            body: ["post", "put"].includes(method) && data ? JSON.stringify(data) : undefined
        });
        const responseData = await response.json();
        if (response.status === 200 || response.status === 201) {
            return responseData as T;
        } else {
            throw new Error(responseData.errorMessage);
        }
    }
}

const apiService = new ApiService();
export default apiService;
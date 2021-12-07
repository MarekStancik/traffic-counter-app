import { BehaviorSubject, delay, Observable, of, tap } from "rxjs";

class AuthenticationService {
    private static readonly SESSION_TOKEN_KEY: string = "session.token";

    private isAuthenticated: BehaviorSubject<boolean>;

    public get isAuthenticated$(): Observable<boolean> {
        return this.isAuthenticated.pipe();
    }

    constructor() {
        const sessionToken = localStorage.getItem(AuthenticationService.SESSION_TOKEN_KEY);
        this.isAuthenticated = new BehaviorSubject<boolean>(!!sessionToken);
    }

    public authenticate(credentials: {username: string, password: string}): Observable<void> {
        return of(undefined).pipe(
            delay(1000), // Fake loading
            tap(_ => { if(credentials.password !== "pass") throw new Error("Invalid Credentials");}), 
            tap(_ => this.isAuthenticated.next(true)), 
            tap(_ => localStorage.setItem(AuthenticationService.SESSION_TOKEN_KEY,"mockToken"))
        );
    }

    public deauthenticate(): void {
        this.isAuthenticated.next(false);
        localStorage.removeItem(AuthenticationService.SESSION_TOKEN_KEY);
    }
}

const authenticationService = new AuthenticationService();
export default authenticationService;
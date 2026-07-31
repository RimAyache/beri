import {Injectable, inject, signal}   from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { config } from '../../config';
import { IUser } from '../../models/user.model';
import { RegisterRequest, RegisterResponse, TokenPayload } from '../../models/auth.model';
import { endpoint } from './endpoints';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    http=inject(HttpClient);
    cookieservice=inject(CookieService);
    router=inject(Router);
    baseUrl= config.apiUrl;
    tokenKey = 'token';
    userKey = 'user';

    currentUser: IUser | undefined;
    isLoggedIn = signal<boolean>(false);

    constructor ()
    {
        this.isLoggedIn.set(this.checkToken());
        this.currentUser = this.getUser();
    }


private readTokenCookie(): string | null {
    return this.cookieservice.get(this.tokenKey) || null;
}

private decodePayload(token: string): TokenPayload | undefined {
    try {
        return jwtDecode<TokenPayload>(token);
    } catch {
        return undefined;
    }
}
getTokenExpiry(): number | undefined {
    const token = this.readTokenCookie();
    const exp = token ? this.decodePayload(token)?.exp : undefined;
    return exp === undefined ? undefined : exp * config.time.msPerSecond;
}

private isExpired(token: string): boolean {
    const exp = this.decodePayload(token)?.exp;
    return exp !== undefined && exp * config.time.msPerSecond <= Date.now();
}
private cookieExpiry(token: string): Date {
    const exp = this.decodePayload(token)?.exp;
    return exp === undefined
        ? new Date(Date.now() + config.auth.fallbackToken)
        : new Date(exp * config.time.msPerSecond);
}

getToken(): string | null {
    const token = this.readTokenCookie();
    if (!token) {
        return null;
    }
    if (this.isExpired(token)) {
        this.clearUserData();
        return null;
    }
    return token;
}

setToken(token: string, user?: IUser): void {
    const expires = this.cookieExpiry(token);
    this.cookieservice.set(this.tokenKey, token, expires, '/');
    if (user) {
        this.cookieservice.set(this.userKey, JSON.stringify(user), expires, '/');
    }
    this.currentUser = user ?? this.getUser();
    this.isLoggedIn.set(this.checkToken());
}

decodeToken(): IUser | undefined {
    const token = this.getToken();
    if (!token) {
        return undefined;
    }
    const payload = this.decodePayload(token);
    return payload
        ? { id: payload.userId, email: payload.userEmail, role: payload.userRole }
        : undefined;
}

checkToken(): boolean {
    return !!this.getToken();
}

getUser(): IUser | undefined {
    if (!this.getToken()) {
        return undefined;
    }
    const cached = this.cookieservice.get(this.userKey);
    if (cached) {
        try {
            return JSON.parse(cached) as IUser;
        } catch {
            return this.decodeToken();
        }
    }
    return this.decodeToken();
}

register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}${endpoint.register}`, payload);
}

login(
    email: string,
    password: string) : Observable<string | undefined> {
        return this.http.post<{token: string; user: IUser}>(`${this.baseUrl}${endpoint.login}`, { email, password }).pipe(
            tap((response) => {
                this.setToken(response.token, response.user);
                this.router.navigate([response.user.role === 'admin' ? '/admin/dashboard' : '/']);
            }),
            map((response) => response.token),
            catchError(() => of(undefined))
        );
    }

refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}${endpoint.refresh}`, {}).pipe(
        tap((response) => this.setToken(response.token))
    );
}

logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}${endpoint.logout}`, {}).pipe(
        catchError(() => of(null)),
        tap(() => {
            this.clearUserData();
            this.router.navigate(['/login']);
        })
    );
}

clearUserData(): void {
    this.cookieservice.delete(this.tokenKey, '/');
    this.cookieservice.delete(this.userKey, '/');
    this.currentUser = undefined;
    this.isLoggedIn.set(false);
}

}
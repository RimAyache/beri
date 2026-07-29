import {Injectable, inject, signal}   from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { config } from '../../config';
import { IUser } from '../../models/user.model';
import { RegisterRequest, RegisterResponse } from '../../models/auth.model';
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

    currentUser: IUser | undefined = this.getUser();
    isLoggedIn = signal<boolean>(this.checkToken());

    constructor ()
    {
    }


getToken(): string | null {
 return this.cookieservice.get(this.tokenKey);
}

setToken(token: string, user?: IUser): void {
    this.cookieservice.set(this.tokenKey, token);
    this.currentUser = user ?? this.decodeToken();
    this.isLoggedIn.set(true);
}

decodeToken(): IUser | undefined {
    const token = this.getToken();
    if (!token) {
        return undefined;
    }
    try {
        return jwtDecode<IUser>(token);
    } catch {
        return undefined;
    }
}

checkToken(): boolean {
    return !!this.getToken();
}

getUser(): IUser | undefined {
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
                this.router.navigate(['/']);
            }),
            map((response) => response.token),
            catchError(() => of(undefined))
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
    this.cookieservice.delete(this.tokenKey);
    this.currentUser = undefined;
    this.isLoggedIn.set(false);
}

}
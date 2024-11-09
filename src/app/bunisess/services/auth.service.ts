import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = '/api/chat/users';  // URL para crear usuarios

  constructor(private http: HttpClient) {}

  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, user);
  }
}
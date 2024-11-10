import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from './chat.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'https://musical-space-winner-5gx4qp46q9gwc7x4x-8080.app.github.dev/api/chat';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }
    }
  }

  login(email: string, name: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      switchMap(users => {
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
          this.currentUserSubject.next(existingUser);
          localStorage.setItem('currentUser', JSON.stringify(existingUser));
          return of(existingUser);
        } else {
          return this.http.post<User>(`${this.apiUrl}/users`, { name, email }).pipe(
            tap(user => {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            })
          );
        }
      }),
      catchError(error => {
        console.error('Error en autenticación:', error);
        return throwError(() => new Error('Error en la autenticación'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
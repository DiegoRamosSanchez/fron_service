import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
  active?: string;
  createdAt?: Date;
}

export interface Conversation {
  id?: number;
  userId: number;
  startTime?: Date;
  endTime?: Date;
  active?: string;
}

export interface Message {
  id?: number;
  conversationId: number;
  query: string;
  response: string;
  sentAt?: Date;
  active?: string;
}

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private apiUrl = 'https://musical-space-winner-5gx4qp46q9gwc7x4x-8080.app.github.dev/api/chat';

  constructor(private http: HttpClient) {}

  // User endpoints
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  // Conversation endpoints
  startConversation(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/conversations/${userId}`, {});
  }

  endConversation(conversationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/conversations/${conversationId}/end`, {});
  }

  getConversations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversations`);
  }

  // Message endpoints
  sendMessage(conversationId: number, query: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/conversations/${conversationId}/messages`, { query });
  }

  getConversationHistory(conversationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }
}
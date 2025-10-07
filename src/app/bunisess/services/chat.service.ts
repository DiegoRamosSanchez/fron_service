import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message } from '../models/message.model';
import { User } from '../models/models';
import { Conversation } from '../models/conversations.model';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private apiUrl = environment.apiUrl + '/api/chat';

  constructor(private http: HttpClient) {}

  // User endpoints
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Conversation endpoints
  getUserConversations(userId: number): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/users/${userId}/conversations`);
  }

  startConversation(userId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/conversations/${userId}`, {});
  }

  endConversation(conversationId: number): Observable<Conversation> {
    return this.http.put<Conversation>(`${this.apiUrl}/conversations/${conversationId}/end`, {});
  }

  // Message endpoints
  sendMessage(conversationId: number, query: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/conversations/${conversationId}/messages`, { query });
  }

  getConversationHistory(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }

  // Logical delete conversation
  logicalDeleteConversation(conversationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/conversations/${conversationId}/delete`, {});
  }
}
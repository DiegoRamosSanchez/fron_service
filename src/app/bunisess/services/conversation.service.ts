import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Messages } from '../models/message.model';
import { Conversation } from './chat.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ConversationService {
  private apiUrl = environment.apiUrl + '/api/chat'; // Cambia esto según tu configuración

  constructor(private http: HttpClient) {}

  startConversation(userId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/conversations/${userId}`, {});
  }

  endConversation(conversationId: number): Observable<Conversation> {
    return this.http.put<Conversation>(`${this.apiUrl}/conversations/${conversationId}/end`, {});
  }

  getConversations(userId: number): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations?userId=${userId}`);
  }

  sendMessage(conversationId: number, message: Messages): Observable<Messages> {
    return this.http.post<Messages>(`${this.apiUrl}/conversations/${conversationId}/messages`, { query: message.query });
  }

  getMessagesByConversationId(conversationId: number): Observable<Messages[]> {
    return this.http.get<Messages[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }
}
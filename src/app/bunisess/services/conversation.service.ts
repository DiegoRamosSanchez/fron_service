import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Conversation } from '../models/conversations.model';
import { Message } from '../models/message.model';

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

  sendMessage(conversationId: number, message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/conversations/${conversationId}/messages`, { query: message.query });
  }

  getMessagesByConversationId(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }
}
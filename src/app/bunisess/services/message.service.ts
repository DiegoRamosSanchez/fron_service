import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private apiUrl = environment.apiUrl + '/api/chat'; // Cambia esto según tu configuración

  constructor(private http: HttpClient) {}

  sendMessage(conversationId: number, query: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/conversations/${conversationId}/messages`, { query });
  }

  getConversationHistory(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }
}
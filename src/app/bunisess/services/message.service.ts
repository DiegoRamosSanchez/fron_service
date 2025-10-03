import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Messages } from '../models/message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private apiUrl = environment.apiUrl + '/api/chat'; // Cambia esto según tu configuración

  constructor(private http: HttpClient) {}

  sendMessage(conversationId: number, query: string): Observable<Messages> {
    return this.http.post<Messages>(`${this.apiUrl}/conversations/${conversationId}/messages`, { query });
  }

  getConversationHistory(conversationId: number): Observable<Messages[]> {
    return this.http.get<Messages[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }
}
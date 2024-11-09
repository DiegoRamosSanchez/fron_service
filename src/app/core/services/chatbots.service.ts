// chatbots.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Chat {
  id: number;
  query: string;
  response: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotsService {

  constructor(private http: HttpClient) { }

  listarChat(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${environment.apiUrl}/api/queries`);
  }

  eliminarChat(chatbotsId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/queries/${chatbotsId}`);
  }

  crearChat(mensajeIA: any): Observable<Chat> {
    return this.http.post<Chat>(`${environment.apiUrl}/api/queries`, mensajeIA);
  }

  actualizarChat(id: number, mensajeIA: any): Observable<Chat> {
    return this.http.put<Chat>(`${environment.apiUrl}/api/queries/${id}`, mensajeIA);
  }

}

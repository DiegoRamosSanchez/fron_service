// chatbots.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chat, ChatbotsService } from '../../core/services/chatbots.service';

@Component({
  selector: 'app-chatBots',
  templateUrl: './chatBots.component.html',
  styleUrls: ['./chatBots.component.scss']
})

export class ChatBotsComponent implements OnInit {

  messages: Chat[] = [];
  newMessage: string = '';

  constructor(private chatbotsService: ChatbotsService) { }

  ngOnInit(): void {
    this.loadChats();
  }

  loadChats(): void {
    this.chatbotsService.listarChat().subscribe((chats: Chat[]) => {
      this.messages = chats;
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const mensajeIA = { query: this.newMessage };

      // Crea un nuevo mensaje del usuario con response vacío
      const userMessage: Chat = {
        id: 0, // ID temporal, se reemplazará con el de la respuesta del servicio
        query: this.newMessage,
        response: '',  // Inicializa la respuesta como vacío
        time: '' // Temporal, se reemplazará con el de la respuesta del servicio
      };

      // Agrega el mensaje del usuario a la lista de mensajes
      this.messages.push(userMessage);
      this.newMessage = '';

      // Envía el mensaje al chatbot
      this.chatbotsService.crearChat(mensajeIA).subscribe((chat: Chat) => {
        // Llama a la función para escribir letra por letra con la respuesta limpiada
        chat.response = this.cleanText(chat.response);
        this.typeResponse(chat.response);

        // Actualiza el mensaje con el ID y timestamp que retorna el servicio
        userMessage.id = chat.id; // Asigna el ID retornado
        userMessage.time = chat.time; // Asigna el timestamp retornado
      });

      // Desplaza hacia abajo después de agregar el mensaje
      this.scrollToBottom();
    }
  }

  typeResponse(text: string, index: number = 0): void {
    // Asegúrate de que hay un mensaje en el que se va a escribir la respuesta
    const lastMessageIndex = this.messages.length - 1;

    if (index < text.length && lastMessageIndex >= 0) {
      // Agrega una letra a la respuesta actual
      this.messages[lastMessageIndex].response += text.charAt(index);

      // Desplaza hacia el final cada vez que se agrega una letra
      this.scrollToBottom();

      // Llama a la función de nuevo después de un pequeño intervalo para agregar la siguiente letra
      setTimeout(() => this.typeResponse(text, index + 1), 50);  // 50ms entre letras
    }
  }

  cleanText(text: string): string {
    // Elimina etiquetas HTML, símbolos o caracteres especiales
    return text.replace(/<\/?[^>]+(>|$)|[*_~`]/g, '').trim();
  }

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }
}

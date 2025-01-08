import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService, Conversation, Message, User } from '../../bunisess/services/chat.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../bunisess/services/auth.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  conversations: Conversation[] = [];
  currentConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  loading: boolean = false;
  error: string = '';
  private userSubscription: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.id) {
        this.loadUserConversations();
      } else {
        this.router.navigate(['/auth']); // Redirige si no hay usuario
      }
    });
  }

  ngOnInit() {
    // La suscripción ya maneja la carga inicial
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadUserConversations() {
    if (!this.currentUser?.id || this.loading) return; // Asegúrate de que currentUser y su id no sean null
    this.loading = true;
    this.chatService.getUserConversations(this.currentUser.id).subscribe({
      next: (conversations) => {
        this.conversations = conversations.filter(conv => conv.active === 'A');
        if (this.conversations.length > 0) {
          this.selectConversation(this.conversations[this.conversations.length - 1]);
        } else {
          this.startNewConversation();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
        this.error = 'Error al cargar conversaciones';
        this.loading = false;
      }
    });
  }  

  startNewConversation() {
    if (!this.currentUser?.id || this.loading) return;

    this.loading = true;
    this.chatService.startConversation(this.currentUser.id).subscribe({
      next: (conversation) => {
        this.conversations.push(conversation);
        this.selectConversation(conversation);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error starting conversation:', error);
        this.error = 'Error al iniciar nueva conversación';
        this.loading = false;
      }
    });
  }

  selectConversation(conversation: Conversation) {
    if (this.loading || this.currentConversation?.id === conversation.id) return;

    this.currentConversation = conversation;
    this.messages = [];
    this.loadConversationHistory(conversation.id!); // Usar el operador de aserción no nula
  }

  loadConversationHistory(conversationId: number) {
    this.loading = true;
    this.chatService.getConversationHistory(conversationId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.error = 'Error al cargar mensajes';
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentConversation?.id || this.loading) return;

    const messageToSend = this.newMessage.trim();
    this.loading = true;

    const userMessage: Message = {
      query: messageToSend,
      response: '', // Inicialmente vacío
      conversationId: this.currentConversation.id,
    };

    this.messages.push(userMessage); // Agrega el mensaje del usuario

    this.chatService.sendMessage(this.currentConversation.id, messageToSend).subscribe({
      next: (response) => {
        if (response) {
          userMessage.response = ''; // Inicializa la respuesta
          this.typeResponse(response.response, userMessage); // Llama a typeResponse para mostrar letra por letra
        } else {
          userMessage.response = 'No se recibió respuesta del bot.';
        }
        this.newMessage = '';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        userMessage.response = 'Error al recibir respuesta del bot';
        this.loading = false;
      }
    });
  }

  typeResponse(text: string, userMessage: Message, index: number = 0): void {
    if (index < text.length) {
      userMessage.response += text.charAt(index); // Agrega una letra a la respuesta
      setTimeout(() => this.typeResponse(text, userMessage, index + 1), 50); // Llama a la función después de 50ms
    }
  }

  clearError() {
    this.error = ''; // Limpia el mensaje de error
  }
  
  logout() {
    this.authService.logout(); // Asegúrate de que el método logout esté definido en AuthService
    this.router.navigate(['/auth']); // Redirige a la página de autenticación
  }
}

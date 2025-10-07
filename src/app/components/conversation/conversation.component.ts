import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../bunisess/services/chat.service';
import { AuthService } from '../../bunisess/services/auth.service';
import { Message } from '../../bunisess/models/message.model';
import { User } from '../../bunisess/models/models';
import { Conversation } from '../../bunisess/models/conversations.model';

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
        this.router.navigate(['/auth']);
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
    if (!this.currentUser?.id || this.loading) return;
    
    this.loading = true;
    this.chatService.getUserConversations(this.currentUser.id).subscribe({
      next: (conversations) => {
        this.conversations = conversations
          .filter(conv => conv.active === 'A')
          .sort((a, b) => {
            const timeA = a.startTime ? new Date(a.startTime).getTime() : 0;
            const timeB = b.startTime ? new Date(b.startTime).getTime() : 0;
            return timeB - timeA; // Ordenar por más reciente primero
          });
        
        if (this.conversations.length > 0) {
          this.selectConversation(this.conversations[0]);
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
        this.conversations.unshift(conversation); // Agregar al inicio
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
    this.loadConversationHistory(conversation.id!);
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

  // Método para manejar el evento Enter en el textarea
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentConversation?.id || this.loading) return;

    const messageToSend = this.newMessage.trim();
    this.loading = true;

    const userMessage: Message = {
      query: messageToSend,
      response: '',
      conversationId: this.currentConversation.id,
    };

    this.messages.push(userMessage);

    this.chatService.sendMessage(this.currentConversation.id, messageToSend).subscribe({
      next: (response) => {
        if (response) {
          userMessage.response = '';
          this.typeResponse(response.response, userMessage);
          
          // Actualizar el título de la conversación si se generó
          if (response.conversationId && this.messages.length === 1) {
            this.refreshCurrentConversation();
          }
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

  // Método para refrescar la conversación actual y obtener el título actualizado
  private refreshCurrentConversation() {
    if (this.currentUser?.id) {
      this.chatService.getUserConversations(this.currentUser.id).subscribe({
        next: (conversations) => {
          const updatedConv = conversations.find(c => c.id === this.currentConversation?.id);
          if (updatedConv) {
            // Actualizar en la lista
            const index = this.conversations.findIndex(c => c.id === updatedConv.id);
            if (index !== -1) {
              this.conversations[index] = updatedConv;
              this.currentConversation = updatedConv;
            }
          }
        }
      });
    }
  }

  typeResponse(text: string, userMessage: Message, index: number = 0): void {
    if (index < text.length) {
      userMessage.response += text.charAt(index);
      setTimeout(() => this.typeResponse(text, userMessage, index + 1), 50);
    }
  }

  deleteConversation(conversation: Conversation, event: Event) {
    event.stopPropagation();
    
    if (!conversation.id || this.loading) return;
    
    if (confirm('¿Estás seguro de eliminar esta conversación?')) {
      this.loading = true;
      this.chatService.logicalDeleteConversation(conversation.id).subscribe({
        next: () => {
          this.conversations = this.conversations.filter(c => c.id !== conversation.id);
          
          if (this.currentConversation?.id === conversation.id) {
            if (this.conversations.length > 0) {
              this.selectConversation(this.conversations[0]);
            } else {
              this.startNewConversation();
            }
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting conversation:', error);
          this.error = 'Error al eliminar la conversación';
          this.loading = false;
        }
      });
    }
  }

  clearError() {
    this.error = '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
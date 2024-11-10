import { Component, OnDestroy, OnInit } from '@angular/core';
import { Conversation } from '../../bunisess/models/conversations.model';
import { ChatService, Message, User } from '../../bunisess/services/chat.service';
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
    this.loading = true;
    this.chatService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations.filter(
          conv => conv.userId === this.currentUser?.id && conv.active === 'A'
        );
        
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

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentConversation?.id || this.loading) return;
    
    const messageToSend = this.newMessage.trim();
    this.loading = true;
    this.chatService.sendMessage(this.currentConversation.id, messageToSend).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.newMessage = '';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.error = 'Error al enviar mensaje';
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  clearError() {
    this.error = '';
  }
}
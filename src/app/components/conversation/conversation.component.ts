import { Component, OnInit } from '@angular/core';
import { Conversation } from '../../bunisess/models/conversations.model';
import { ChatService, Message, User } from '../../bunisess/services/chat.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})

export class ConversationComponent implements OnInit {
  currentUser: User | null = null;
  conversations: Conversation[] = [];
  currentConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  loading: boolean = false;

  constructor(private chatService: ChatService) {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }

  ngOnInit() {
    if (this.currentUser?.id) {
      this.startNewConversation();
    }
  }

  startNewConversation() {
    if (this.currentUser?.id) {
      this.chatService.startConversation(this.currentUser.id).subscribe({
        next: (conversation) => {
          this.currentConversation = conversation;
          this.messages = [];
        },
        error: (error) => console.error('Error starting conversation:', error)
      });
    }
  }

  selectConversation(conversation: Conversation) {
    this.currentConversation = conversation;
    this.loadConversationHistory(conversation.id!);
  }

  loadConversationHistory(conversationId: number) {
    this.chatService.getConversationHistory(conversationId).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => console.error('Error loading messages:', error)
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.currentConversation?.id) {
      this.loading = true;
      this.chatService.sendMessage(this.currentConversation.id, this.newMessage).subscribe({
        next: (message) => {
          this.messages.push(message);
          this.newMessage = '';
          this.loading = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.loading = false;
        }
      });
    }
  }
}
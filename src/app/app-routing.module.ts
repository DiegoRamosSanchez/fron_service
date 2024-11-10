import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { LoginGuard } from './bunisess/guards/login.guard';
import { AuthGuard } from './bunisess/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'conversation',
    component: ConversationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/conversation',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

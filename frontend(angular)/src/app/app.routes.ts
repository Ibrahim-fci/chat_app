import { Routes } from '@angular/router';
import { SignupComponent } from './Pages/signup/signup.component';
import { LoginComponent } from './Pages/login/login.component';
import { ChatComponent } from './Pages/chat/chat.component';

export const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: '',
    component: ChatComponent
  }

];

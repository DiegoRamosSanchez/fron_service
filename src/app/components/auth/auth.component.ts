import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../bunisess/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';
      const { email, name } = this.loginForm.value;
      
      this.authService.login(email, name).subscribe({
        next: () => {
          this.router.navigate(['/conversation']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
          this.loading = false;
        }
      });
    }
  }
}
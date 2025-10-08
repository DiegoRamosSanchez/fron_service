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
  isLoginMode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Si está en modo login, el nombre no es requerido inicialmente
    this.updateFormValidators();
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.loginForm.reset();
    this.updateFormValidators();
  }

  private updateFormValidators(): void {
    const nameControl = this.loginForm.get('name');
    
    if (this.isLoginMode) {
      // En modo login, el nombre no es necesario
      nameControl?.clearValidators();
      nameControl?.updateValueAndValidity();
    } else {
      // En modo registro, el nombre es obligatorio
      nameControl?.setValidators([Validators.required, Validators.minLength(2)]);
      nameControl?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';
      
      const { email, password, name } = this.loginForm.value;
      
      if (this.isLoginMode) {
        this.performLogin(email, password);
      } else {
        this.performRegister(name, email, password);
      }
    }
  }

  private performLogin(email: string, password: string): void {
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response.message);
        this.router.navigate(['/conversation']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Error al iniciar sesión. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  private performRegister(name: string, email: string, password: string): void {
    this.authService.register(name, email, password).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response.message);
        this.router.navigate(['/conversation']);
      },
      error: (error) => {
        console.error('Register error:', error);
        this.errorMessage = error.message || 'Error al registrar. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }
}
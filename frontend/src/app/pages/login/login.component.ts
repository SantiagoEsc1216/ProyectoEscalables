import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode: boolean = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    // Formulario de login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Formulario de registro
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        this.isLoading = true;
        const { email, password } = this.loginForm.value;
        
        this.userService.login(email, password).subscribe({
          next: (response) => {
            // Guardar el token y la información del usuario en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log(localStorage.getItem('token'));
            this.isLoading = false;
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error.message || 'Error al iniciar sesión';
          }
        });
      }
    } else {
      if (this.registerForm.valid) {
        this.isLoading = true;
        const { fullName, email, password } = this.registerForm.value;
        
        this.userService.register({ name: fullName, email, password }).subscribe({
          next: () => {
            this.isLoading = false;
            this.isLoginMode = true;
            this.errorMessage = 'Registro exitoso. Por favor inicia sesión.';
            this.registerForm.reset();
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error.message || 'Error al registrar usuario';
          }
        });
      }
    }
  }

  // Getters para acceder fácilmente a los campos del formulario
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }
  get registerFullName() { return this.registerForm.get('fullName'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerPassword() { return this.registerForm.get('password'); }
  get registerConfirmPassword() { return this.registerForm.get('confirmPassword'); }
}

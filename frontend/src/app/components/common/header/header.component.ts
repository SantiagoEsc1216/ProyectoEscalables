import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userName: string = '';

  constructor() {
    // TODO: Implementar la lógica de autenticación real
    // Por ahora usamos datos de ejemplo
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userName = '';
  }

  ngOnInit(): void {
    // TODO: Suscribirse a los cambios del estado de autenticación
  }

  logout(): void {
    // TODO: Implementar la lógica de cierre de sesión
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userName = '';
  }
}

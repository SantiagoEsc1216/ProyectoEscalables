import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl:'./admin.component.html',
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
    }
    .admin-nav {
      width: 200px;
      background-color: #2c3e50;
      padding: 20px;
    }
    .admin-nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .admin-nav li {
      margin-bottom: 10px;
    }
    .admin-nav a {
      color: white;
      text-decoration: none;
      display: block;
      padding: 10px;
      border-radius: 4px;
    }
    .admin-nav a:hover, .admin-nav a.active {
      background-color: #34495e;
    }
    .admin-content {
      flex: 1;
      padding: 20px;
    }
  `],
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  standalone: true
})
export class AdminComponent {} 
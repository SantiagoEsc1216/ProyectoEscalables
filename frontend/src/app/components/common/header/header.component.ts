import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userName: string = '';
  private authSubscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del estado de autenticación
    this.authSubscription = this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.userName = user.name;
        console.log(user);
        this.isAdmin = user.role === 'admin';
      } else {
        this.isLoggedIn = false;
        this.userName = '';
        this.isAdmin = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}

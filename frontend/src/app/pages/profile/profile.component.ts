import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { OrderService } from '../../services/order/order.service';
import { ReviewService } from '../../services/review/review.service';
import { User } from '../../services/user/user.interface';
import { Order } from '../../services/order/order.interface';
import { Review } from '../../services/review/review.interface';
import { MovieService } from '../../services/movie/movie.service';
import { Movie } from '../../services/movie/movie.interface';
import { NgbNavModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NgbNavModule, NgbRatingModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  orders: Order[] = [];
  reviews: Review[] = [];
  movies: { [key: string]: Movie } = {};
  activeTab = 1;

  constructor(
    private router: Router,
    private userService: UserService,
    private orderService: OrderService,
    private reviewService: ReviewService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.loadOrders();
        this.loadReviews();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private loadOrders() {
    if (this.user?.id) {
      this.orderService.getOrdersByUser(this.user.id).subscribe(orders => {
        this.orders = orders;
        // Cargar detalles de películas para cada orden
        orders.forEach(order => {
          if (order.schedule?.movieId) {
            this.loadMovieDetails(order.schedule.movieId);
          }
        });
      });
    }
  }

  private loadReviews() {
    if (this.user?.id) {
      this.reviewService.getReviewsByUserId(this.user.id).subscribe(reviews => {
        this.reviews = reviews;
        // Cargar detalles de películas para cada reseña
        reviews.forEach(review => {
          this.loadMovieDetails(review.movieId);
        });
      });
    }
  }

  private loadMovieDetails(movieId: string) {
    if (!this.movies[movieId]) {
      this.movieService.getMovie(movieId).subscribe(movie => {
        this.movies[movieId] = movie;
      });
    }
  }

  getMovieTitle(movieId: string): string {
    return this.movies[movieId]?.title || 'Cargando...';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  viewOrder(orderId: string) {
    this.router.navigate(['/order', orderId]);
  }

  viewMovie(movieId: string) {
    this.router.navigate(['/movie', movieId]);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
} 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { ReviewService } from '../../services/review/review.service';
import { OrderService } from '../../services/order/order.service';
import { Movie } from '../../services/movie/movie.interface';
import { Schedule } from '../../services/schedule/schedule.interface';
import { Review } from '../../services/review/review.interface';
import { Order } from '../../services/order/order.interface';
import { NgbNavModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, NgbNavModule, NgbRatingModule, FormsModule, ReactiveFormsModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent implements OnInit {
  movie: Movie | null = null;
  schedules: Schedule[] = [];
  reviews: Review[] = [];
  activeTab = 1;
  averageRating: number = 0;
  canReview: boolean = false;
  reviewForm: FormGroup;
  currentUserId: string = 'u1'; // Esto debería venir del servicio de autenticación

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private scheduleService: ScheduleService,
    private reviewService: ReviewService,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10)]],
      rate: [5, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit() {
    const movieId = this.route.snapshot.params['id'];
    this.loadMovieDetails(movieId);
    this.checkIfUserCanReview(movieId);
  }

  ariaValueText(current: number, max: number) {
		return `${current} out of ${max} hearts`;
	}

  private loadMovieDetails(movieId: string) {
    this.movieService.getMovies().subscribe(movies => {
      this.movie = movies.find(m => m.id === movieId) || null;
      if (this.movie) {
        this.loadSchedules(movieId);
        this.loadReviews(movieId);
      }
    });
  }

  private loadSchedules(movieId: string) {
    this.scheduleService.getSchedules().subscribe(schedules => {
      this.schedules = schedules.filter(s => s.movieId === movieId);
    });
  }

  private loadReviews(movieId: string) {
    this.reviewService.getReviews().subscribe(reviews => {
      this.reviews = reviews.filter(r => r.movieId === movieId);
      this.calculateAverageRating();
    });
  }

  private calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews.reduce((acc, review) => acc + review.rate, 0);
    this.averageRating = sum / this.reviews.length;
  }

  private checkIfUserCanReview(movieId: string) {
    this.orderService.getOrders().subscribe(orders => {
      // Verificar si el usuario tiene alguna orden confirmada para esta película
      const userOrders = orders.filter(order =>
        order.user === this.currentUserId &&
        order.schedule.movieId === movieId
      );
      this.canReview = userOrders.length > 0;
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  selectSeats(scheduleId: string) {
    this.router.navigate(['/selectSeats', scheduleId]);
  }

  submitReview() {
    if (this.reviewForm.valid && this.movie) {
      const newReview: Review = {
        id: `r${Date.now()}`,
        user: {
          id: this.currentUserId,
          name: 'Usuario Actual', // Esto debería venir del servicio de autenticación
          email: 'usuario@example.com',
          role: 'viewer'
        },
        movieId: this.movie.id,
        comment: this.reviewForm.get('comment')?.value,
        rate: this.reviewForm.get('rate')?.value,
        date: new Date()
      };

      this.reviewService.addReview(newReview).subscribe(() => {
        this.reviews.unshift(newReview);
        this.calculateAverageRating();
        this.reviewForm.reset({ rate: 5 });
        this.canReview = false; // Evitar múltiples reseñas
      });
    }
  }
}

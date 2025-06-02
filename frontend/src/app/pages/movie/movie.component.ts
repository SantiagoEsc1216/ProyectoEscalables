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
import { User } from '../../services/user/user.interface';
import { NgbNavModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';

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
  userReview: Review | null = null;
  isEditing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private scheduleService: ScheduleService,
    private reviewService: ReviewService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
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
    this.movieService.getMovie(movieId).subscribe(movie => {
      this.movie = movie;
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
    this.reviewService.getReviewsByMovieId(movieId).subscribe(reviews => {      // Separar la reseña del usuario actual del resto de reseñas
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("Revies:", this.userReview)
        console.log(reviews);
        this.userReview = reviews.find(r => r.user.email === user.email) || null;

        if(this.userReview){
          this.reviewForm.patchValue({
            comment: this.userReview.comment,
            rate: this.userReview.rate
          });
        }
        
        this.reviews = reviews.filter(r => r.user.email !== user.email);
        console.log("Revies:", this.userReview);
      } else {
        this.reviews = reviews;
      }
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
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
  
      // Paso 1: Verifica que haya ordenado al menos una vez
      this.orderService.getOrdersByUserAndMovie(user.id, movieId).subscribe({
        next: orders => {
          console.log("orders:", orders);
          const hasOrders = orders.length > 0;
  
          if (!hasOrders) {
            this.canReview = false;
            return;
          }
  
          this.reviewService.getReviewsByUserId(user.id).subscribe({
            next: reviews => {
              const existingReview = reviews.find(r => r.movieId === movieId);
              if (existingReview) {
                this.userReview = existingReview;
                this.reviewForm.patchValue({
                  comment: existingReview.comment,
                  rate: existingReview.rate
                });
              }
              this.canReview = true;
            },
            error: err => {
              console.error('Error al obtener reviews:', err);
              this.canReview = false;
            }
          });
        },
        error: error => {
          console.error('Error al obtener órdenes:', error);
          this.canReview = false;
        }
      });
    } else {
      this.canReview = false;
    }
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
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        const reviewData = {
          user: user.id,
          movieId: this.movie.id,
          comment: this.reviewForm.get('comment')?.value,
          rate: this.reviewForm.get('rate')?.value,
          date: new Date()
        };

        if (this.userReview) {
          console.log(this.userReview);
          // Actualizar reseña existente
          this.reviewService.updateReview(this.userReview._id, reviewData).subscribe(updatedReview => {
            const index = this.reviews.findIndex(r => r.id === updatedReview.id);
            if (index !== -1) {
              this.reviews[index] = updatedReview;
            }
            this.userReview = updatedReview;
            this.calculateAverageRating();
            this.isEditing = false;
          });
        } else {
          // Crear nueva reseña
          this.reviewService.addReview(reviewData).subscribe(createdReview => {
            this.reviews.unshift(createdReview);
            this.userReview = createdReview;
            this.calculateAverageRating();
            this.reviewForm.reset({ rate: 5 });
          });
        }
      }
    }
  }

  editReview() {
    this.isEditing = true;
    if (this.userReview) {
      this.reviewForm.patchValue({
        comment: this.userReview.comment,
        rate: this.userReview.rate
      });
    }
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.isEditing = false;
    if (this.userReview) {
      this.reviewForm.patchValue({
        comment: this.userReview.comment,
        rate: this.userReview.rate
      });
    } else {
      this.reviewForm.reset({ rate: 5 });
    }
  }
}

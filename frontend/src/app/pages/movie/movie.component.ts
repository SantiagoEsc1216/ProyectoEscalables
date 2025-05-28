import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { ReviewService } from '../../services/review/review.service';
import { Movie } from '../../services/movie/movie.interface';
import { Schedule } from '../../services/schedule/schedule.interface';
import { Review } from '../../services/review/review.interface';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, NgbNavModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent implements OnInit {
  movie: Movie | null = null;
  schedules: Schedule[] = [];
  reviews: Review[] = [];
  activeTab = 1;
  averageRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private scheduleService: ScheduleService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const movieId = params['id'];
      this.loadMovieDetails(movieId);
    });
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
    if (this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rate, 0);
      this.averageRating = sum / this.reviews.length;
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
}

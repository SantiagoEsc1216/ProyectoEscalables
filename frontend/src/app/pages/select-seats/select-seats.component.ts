import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { SeatService } from '../../services/seat/seat.service';
import { MovieService } from '../../services/movie/movie.service';
import { Schedule } from '../../services/schedule/schedule.interface';
import { Seat } from '../../services/seat/seat.interface';
import { Movie } from '../../services/movie/movie.interface';

@Component({
  selector: 'app-select-seats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-seats.component.html',
  styleUrl: './select-seats.component.css'
})
export class SelectSeatsComponent implements OnInit {
  schedule: Schedule | null = null;
  movie: Movie | null = null;
  seatsByRow: { [key: string]: Seat[] } = {};
  selectedSeats: string[] = [];
  rows: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService,
    private seatService: SeatService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    const scheduleId = this.route.snapshot.params['id'];
    this.loadScheduleAndSeats(scheduleId);
  }

  private loadScheduleAndSeats(scheduleId: string) {
    this.scheduleService.getScheduleById(scheduleId).subscribe(schedule => {
      if (schedule) {
        this.schedule = schedule;
        this.loadMovieDetails(schedule.movieId);
        this.loadSeats(schedule);
      }
    });
  }

  private loadMovieDetails(movieId: string) {
    this.movieService.getMovies().subscribe(movies => {
      this.movie = movies.find(m => m.id === movieId) || null;
    });
  }

  private loadSeats(schedule: Schedule) {
    this.seatService.getSeatsByRow(schedule.seats).subscribe(seatsByRow => {
      this.seatsByRow = seatsByRow;
      this.rows = Object.keys(seatsByRow).sort();
    });
  }

  toggleSeat(seatId: string) {
    const index = this.selectedSeats.indexOf(seatId);
    if (index === -1) {
      this.selectedSeats.push(seatId);
    } else {
      this.selectedSeats.splice(index, 1);
    }
  }

  isSeatSelected(seatId: string): boolean {
    return this.selectedSeats.includes(seatId);
  }

  isSeatAvailable(seat: Seat): boolean {
    return seat.free;
  }

  getSeatClass(seat: Seat): string {
    if (this.isSeatSelected(seat.id)) {
      return 'seat-selected';
    }
    return this.isSeatAvailable(seat) ? 'seat-available' : 'seat-occupied';
  }

  continueToFoods() {
    if (this.selectedSeats.length > 0 && this.schedule) {
      this.router.navigate(['/selectFoods', this.schedule.id], {
        state: { selectedSeats: this.selectedSeats }
      });
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

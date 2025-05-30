import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { SeatService } from '../../services/seat/seat.service';
import { MovieService } from '../../services/movie/movie.service';
import { OrderService } from '../../services/order/order.service';
import { Schedule } from '../../services/schedule/schedule.interface';
import { Seat } from '../../services/seat/seat.interface';
import { Movie } from '../../services/movie/movie.interface';
import { Order } from '../../services/order/order.interface';

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
    private movieService: MovieService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    const scheduleId = this.route.snapshot.params['id'];
    this.loadScheduleAndSeats(scheduleId);
  }

  private loadScheduleAndSeats(scheduleId: string) {
    this.scheduleService.getScheduleById(scheduleId).subscribe({
      next: (schedule) => {
        if (schedule) {
          this.schedule = schedule;
          this.loadMovieDetails(schedule.movieId);
          this.loadSeats(schedule);
        }
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  private loadMovieDetails(movieId: string) {
    this.movieService.getMovie(movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
      },
      error: () => {
        this.movie = null;
      }
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
      // Get user ID from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        this.router.navigate(['/login']);
        return;
      }

      const user = JSON.parse(userStr);
      const order: Partial<Order> = {
        user: user.id,
        schedule: this.schedule,
        seats: this.selectedSeats,
        foods: [],
        price: 0
      };
      
      this.orderService.createOrder(order).subscribe({
        next: () => {
          this.router.navigate(['/selectFoods', this.schedule?.id]);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
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

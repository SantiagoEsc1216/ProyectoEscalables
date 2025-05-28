import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { MovieService } from '../../services/movie/movie.service';
import { Order } from '../../services/order/order.interface';
import { Movie } from '../../services/movie/movie.interface';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  order: Order | null = null;
  movie: Movie | null = null;
  qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ORDER-123456';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.params['id'];
    this.loadOrder(orderId);
  }

  private loadOrder(orderId: string) {
    this.orderService.getOrders().subscribe(orders => {
      this.order = orders.find(o => o.id === orderId) || null;
      if (this.order) {
        this.loadMovieDetails(this.order.schedule.movieId);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private loadMovieDetails(movieId: string) {
    this.movieService.getMovies().subscribe(movies => {
      this.movie = movies.find(m => m.id === movieId) || null;
    });
  }

  getMovieTitle(): string {
    return this.movie?.title || 'Película no encontrada';
  }

  getScheduleInfo(): string {
    if (!this.order?.schedule) return '';
    const date = new Date(this.order.schedule.date);
    const time = new Date(this.order.schedule.hour);
    return `${date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  }

  getSeatsInfo(): string {
    if (!this.order?.seats.length) return 'No hay asientos seleccionados';
    return this.order.seats.join(', ');
  }

  getFoodsInfo(): string {
    if (!this.order?.foods.length) return 'No se seleccionaron alimentos';
    return this.order.foods.map(food => `${food.name} x${food.amount}`).join(', ');
  }

  printTicket() {
    window.print();
  }

  returnToHome() {
    this.router.navigate(['/']);
  }
}

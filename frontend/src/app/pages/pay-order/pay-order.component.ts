import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { Order } from '../../services/order/order.interface';
import { Food } from '../../services/food/food.interface';
import { MovieService } from '../../services/movie/movie.service';
import { Movie } from '../../services/movie/movie.interface';

@Component({
  selector: 'app-pay-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pay-order.component.html',
  styleUrl: './pay-order.component.css'
})
export class PayOrderComponent implements OnInit {
  order: Order | null = null;
  movie: Movie | null = null;
  paymentForm: FormGroup;
  isProcessing = false;
  errorMessage = '';
  selectedSeats: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private movieService: MovieService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      cardHolder: ['', [Validators.required, Validators.minLength(3)]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit() {
    this.loadOrder();
  }

  private loadOrder() {
    this.orderService.getCurrentOrder().subscribe(order => {
      if (!order) {
        this.router.navigate(['/']);
        return;
      }
      this.order = order;
      console.log(order);
      this.selectedSeats = order.seats;
      this.loadMovieDetails(order.schedule.movieId);
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
    if (!this.selectedSeats.length) return 'No hay asientos seleccionados';
    return this.selectedSeats.join(', ');
  }

  getFoodsInfo(): Food[] {
    return this.order?.foods.filter(food => food.amount > 0) || [];
  }

  getFoodSubtotal(food: Food): number {
    return food.price * food.amount;
  }

  getTotalPrice(): number {
    return this.order?.price || 0;
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.isProcessing = true;
      this.errorMessage = '';

      // Simular procesamiento de pago
      setTimeout(() => {
        this.isProcessing = false;
        this.orderService.confirmOrder(this.order!).subscribe(() => {
          this.router.navigate(['/order', this.order?.id]);
        });
      }, 2000);
    } else {
      this.errorMessage = 'Por favor, verifica los datos de tu tarjeta.';
    }
  }

  cancelOrder() {
    this.orderService.clearCurrentOrder();
    this.router.navigate(['/movie', this.order?.schedule.movieId]);
  }

  // Helpers para validación de formulario
  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (!field) return '';

    if (field.errors?.['required']) return 'Este campo es requerido';
    if (field.errors?.['pattern']) {
      switch (fieldName) {
        case 'cardNumber': return 'Número de tarjeta inválido';
        case 'expiryDate': return 'Formato inválido (MM/YY)';
        case 'cvv': return 'CVV inválido';
        default: return 'Formato inválido';
      }
    }
    if (field.errors?.['minlength']) return 'Mínimo 3 caracteres';

    return '';
  }
}

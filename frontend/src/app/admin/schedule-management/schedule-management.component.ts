import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { MovieService } from '../../services/movie/movie.service';
import { Schedule } from '../../services/schedule/schedule.interface';
import { Movie } from '../../services/movie/movie.interface';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule-management',
  template: `
    <div class="schedule-management">
      <h2>Gestión de Horarios</h2>
      
      <button (click)="showAddForm()" class="add-button">Agregar Nuevo Horario</button>

      <div *ngIf="showForm" class="schedule-form">
        <h3>{{ editingSchedule ? 'Editar' : 'Agregar' }} Horario</h3>
        <form [formGroup]="scheduleForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Película:</label>
            <select formControlName="movieId" required>
              <option value="">Seleccione una película</option>
              <option *ngFor="let movie of movies" [value]="movie.id">{{ movie.title }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Sala (1-10):</label>
            <input type="number" formControlName="room" min="1" max="10" required>
          </div>
          
          <div class="form-group">
            <label>Fecha:</label>
            <input type="date" formControlName="date" required>
          </div>
          
          <div class="form-group">
            <label>Hora:</label>
            <input type="time" formControlName="time" required>
          </div>
          
          <div class="form-actions">
            <button type="submit" [disabled]="!scheduleForm.valid">Guardar</button>
            <button type="button" (click)="cancelEdit()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="schedule-list">
        <table>
          <thead>
            <tr>
              <th>Película</th>
              <th>Sala</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let schedule of schedules">
              <td>{{ getMovieTitle(schedule.movieId) }}</td>
              <td>{{ schedule.room }}</td>
              <td>{{ schedule.date | date:'dd/MM/yyyy' }}</td>
              <td>{{ schedule.hour }}</td>
              <td>
                <button (click)="editSchedule(schedule)">Editar</button>
                <button (click)="deleteSchedule(schedule.id)">Eliminar</button>
                <button (click)="showSeats(schedule)">Ver Asientos</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showSeatsModal" class="seats-modal">
        <div class="seats-content">
          <h3>Asientos - Sala {{ selectedSchedule?.room }}</h3>
          <div class="seats-grid">
            <div *ngFor="let row of [0,1,2,3,4,5,6,7,8,9]" class="seat-row">
              <div *ngFor="let col of [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]" 
                   class="seat" 
                   [class.occupied]="isSeatOccupied(row, col)"
                   (click)="toggleSeat(row, col)">
                {{ row + 1 }}-{{ col + 1 }}
              </div>
            </div>
          </div>
          <div class="seats-legend">
            <div class="legend-item">
              <div class="seat available"></div>
              <span>Disponible</span>
            </div>
            <div class="legend-item">
              <div class="seat occupied"></div>
              <span>Ocupado</span>
            </div>
          </div>
          <button (click)="closeSeatsModal()">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .schedule-management {
      padding: 20px;
    }
    .add-button {
      margin-bottom: 20px;
      padding: 10px 20px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .schedule-form {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-group input, .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-actions {
      display: flex;
      gap: 10px;
    }
    .form-actions button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .form-actions button[type="submit"] {
      background-color: #3498db;
      color: white;
    }
    .form-actions button[type="button"] {
      background-color: #e74c3c;
      color: white;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    button {
      margin-right: 5px;
    }
    .seats-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .seats-content {
      background-color: white;
      padding: 20px;
      border-radius: 4px;
      max-width: 800px;
      width: 100%;
    }
    .seats-grid {
      display: grid;
      gap: 5px;
      margin: 20px 0;
    }
    .seat-row {
      display: flex;
      gap: 5px;
      justify-content: center;
    }
    .seat {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #2ecc71;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .seat.occupied {
      background-color: #e74c3c;
    }
    .seats-legend {
      display: flex;
      gap: 20px;
      margin: 20px 0;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .legend-item .seat {
      cursor: default;
    }
  `],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe]
})
export class ScheduleManagementComponent implements OnInit {
  schedules: Schedule[] = [];
  movies: Movie[] = [];
  scheduleForm: FormGroup;
  showForm = false;
  editingSchedule: Schedule | null = null;
  showSeatsModal = false;
  selectedSchedule: Schedule | null = null;
  seats: boolean[][] = Array(10).fill(null).map(() => Array(20).fill(false));

  constructor(
    private scheduleService: ScheduleService,
    private movieService: MovieService,
    private fb: FormBuilder
  ) {
    this.scheduleForm = this.fb.group({
      movieId: ['', Validators.required],
      room: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSchedules();
    this.loadMovies();
  }

  loadSchedules() {
    this.scheduleService.getSchedules().subscribe(schedules => {
      this.schedules = schedules;
    });
  }

  loadMovies() {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
    });
  }

  getMovieTitle(movieId: string): string {
    const movie = this.movies.find(m => m.id === movieId);
    return movie ? movie.title : 'Película no encontrada';
  }

  showAddForm() {
    this.editingSchedule = null;
    this.scheduleForm.reset();
    this.showForm = true;
  }

  editSchedule(schedule: Schedule) {
    this.editingSchedule = schedule;
    this.scheduleForm.patchValue(schedule);
    this.showForm = true;
  }

  cancelEdit() {
    this.showForm = false;
    this.editingSchedule = null;
    this.scheduleForm.reset();
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      const scheduleData = this.scheduleForm.value;
      
      if (this.editingSchedule) {
        this.scheduleService.updateSchedule(this.editingSchedule.id, scheduleData).subscribe(() => {
          this.loadSchedules();
          this.cancelEdit();
        });
      } else {
        this.scheduleService.createSchedule(scheduleData).subscribe(() => {
          this.loadSchedules();
          this.cancelEdit();
        });
      }
    }
  }

  deleteSchedule(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este horario?')) {
      this.scheduleService.deleteSchedule(id).subscribe(() => {
        this.loadSchedules();
      });
    }
  }

  showSeats(schedule: Schedule) {
    this.selectedSchedule = schedule;
    this.showSeatsModal = true;
    // Aquí deberías cargar el estado actual de los asientos desde el backend
  }

  closeSeatsModal() {
    this.showSeatsModal = false;
    this.selectedSchedule = null;
  }

  isSeatOccupied(row: number, col: number): boolean {
    return this.seats[row][col];
  }

  toggleSeat(row: number, col: number) {
    if (this.selectedSchedule) {
      const seatId = `${row + 1}-${col + 1}`;
      const newStatus = !this.seats[row][col];
      
      this.scheduleService.updateSeatAvailability(
        this.selectedSchedule.id,
        seatId,
        !newStatus
      ).subscribe(() => {
        this.seats[row][col] = newStatus;
      });
    }
  }
} 
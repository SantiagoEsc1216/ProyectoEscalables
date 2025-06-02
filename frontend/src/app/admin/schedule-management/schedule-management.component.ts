import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { MovieService } from '../../services/movie/movie.service';
import { Schedule } from '../../services/schedule/schedule.interface';
import { Movie } from '../../services/movie/movie.interface';
import { Seat } from '../../services/seat/seat.interface'; // Importar la interfaz Seat
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule-management',
  templateUrl:'./schedule-management.component.html' ,
  styleUrls: ['./schedule-management.component.css'],
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
      hour: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSchedules();
    this.loadMovies();
  }


  generateSeats(): Seat[] {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const rowLetter = rows[rowIndex];
      
      for (let column = 1; column <= 20; column++) {
        const seat: Seat = {
          id: `${rowLetter}${column}`, // Ej: A1, A2, B1, etc.
          row: rowLetter,
          column: column,
          free: true // Todos los asientos empiezan libres
        };
        seats.push(seat);
      }
    }
    
    return seats;
  }


  generateSeatId(rowLetter: string, column: number): string {
    return `${rowLetter}${column.toString().padStart(2, '0')}`; // Ej: A01, A02, B01, etc.
  }

  getRowLetter(rowIndex: number): string {
    return String.fromCharCode(65 + rowIndex); // 65 es el código ASCII de 'A'
  }

  loadSchedules() {
    this.scheduleService.getSchedules().subscribe(schedules => {
      this.schedules = schedules;
      console.log(this.schedules);
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
      const scheduleData = {
        ...this.scheduleForm.value,
        seats: this.generateSeats() // Agregar los asientos generados al horario
      };
      
      if (this.editingSchedule) {
        this.scheduleService.updateSchedule(this.editingSchedule.id, scheduleData).subscribe({
          next: () => {
            this.loadSchedules();
            this.cancelEdit();
            console.log('Horario actualizado exitosamente');
          },
          error: (error) => {
            console.error('Error al actualizar horario:', error);
          }
        });
      } else {
        this.scheduleService.createSchedule(scheduleData).subscribe({
          next: () => {
            this.loadSchedules();
            this.cancelEdit();
            console.log('Horario creado exitosamente con', scheduleData.seats.length, 'asientos');
          },
          error: (error) => {
            console.error('Error al crear horario:', error);
          }
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
  
    // Reiniciar la matriz de ocupación
    this.seats = Array(10).fill(null).map(() => Array(20).fill(false));
  
    // Mapear los asientos ocupados desde el horario
    schedule.seats.forEach(seat => {
      const rowIndex = seat.row.charCodeAt(0) - 65; // 'A' = 65
      const colIndex = seat.column - 1;
  
      if (rowIndex >= 0 && rowIndex < 10 && colIndex >= 0 && colIndex < 20) {
        this.seats[rowIndex][colIndex] = !seat.free; // ocupado = !free
      }
    });
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
      const rowLetter = this.getRowLetter(row);
      const seatId = `${rowLetter}${col + 1}`;
      const newStatus = !this.seats[row][col];
      
      this.scheduleService.updateSeatAvailability(
        this.selectedSchedule.id,
        seatId,
        !newStatus // free es lo opuesto a occupied
      ).subscribe({
        next: () => {
          this.seats[row][col] = newStatus;
          console.log(`Asiento ${seatId} ${newStatus ? 'ocupado' : 'liberado'}`);
        },
        error: (error) => {
          console.error('Error al actualizar asiento:', error);
        }
      });
    }
  }

  getSeatInfo(row: number, col: number) {
    const rowLetter = this.getRowLetter(row);
    const seatNumber = col + 1;
    const seatId = `${rowLetter}${seatNumber}`;
    
    return {
      id: seatId,
      row: rowLetter,
      column: seatNumber,
      isOccupied: this.isSeatOccupied(row, col),
      displayName: `${rowLetter}${seatNumber}`
    };
  }

  getAvailableSeatsCount(): number {
    let available = 0;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 20; col++) {
        if (!this.isSeatOccupied(row, col)) {
          available++;
        }
      }
    }
    return available;
  }

  getOccupiedSeatsCount(): number {
    return 200 - this.getAvailableSeatsCount(); // Total de asientos - disponibles
  }
}
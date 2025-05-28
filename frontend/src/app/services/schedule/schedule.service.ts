import { Injectable } from '@angular/core';
import { Movie } from '../movie/movie.interface';
import { Schedule } from './schedule.interface';
import { Seat } from '../seat/seat.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  // Función helper para generar asientos de una sala
  private generateSeats(rows: string[], columns: number, occupancyRate: number = 0.3): Seat[] {
    const seats: Seat[] = [];
    
    rows.forEach(row => {
      for (let col = 1; col <= columns; col++) {
        seats.push({
          id: `${row}${col}`,
          row: row,
          column: col,
          free: Math.random() > occupancyRate // 30% de ocupación por defecto
        });
      }
    });
    
    return seats;
  }

  private SCHEDULES: Schedule[] = [
    // Inception - Sala 1
    {
      id: 's1',
      movieId: '1', // Inception
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T15:00:00'),
      room: 1,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.25)
    },
    {
      id: 's2',
      movieId: '1', // Inception
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T18:30:00'),
      room: 1,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.45)
    },
    {
      id: 's3',
      movieId: '1', // Inception
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T21:00:00'),
      room: 1,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.60)
    },

    // Titanic - Sala 2
    {
      id: 's4',
      movieId: '2', // Titanic
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T16:00:00'),
      room: 2,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E', 'F'], 10, 0.35)
    },
    {
      id: 's5',
      movieId: '2', // Titanic
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T20:00:00'),
      room: 2,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E', 'F'], 10, 0.55)
    },

    // The Dark Knight - Sala 3
    {
      id: 's6',
      movieId: '3', // The Dark Knight
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T17:00:00'),
      room: 3,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.40)
    },
    {
      id: 's7',
      movieId: '3', // The Dark Knight
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T20:30:00'),
      room: 3,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.65)
    },

    // Forrest Gump - Sala 4
    {
      id: 's8',
      movieId: '4', // Forrest Gump
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T15:30:00'),
      room: 4,
      seats: this.generateSeats(['A', 'B', 'C', 'D'], 6, 0.20)
    },
    {
      id: 's9',
      movieId: '4', // Forrest Gump
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T19:00:00'),
      room: 4,
      seats: this.generateSeats(['A', 'B', 'C', 'D'], 6, 0.50)
    },

    // Avengers: Endgame - Sala Premium (más grande)
    {
      id: 's10',
      movieId: '5', // Avengers: Endgame
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T16:30:00'),
      room: 5,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 12, 0.45)
    },
    {
      id: 's11',
      movieId: '5', // Avengers: Endgame
      date: new Date('2025-05-28'),
      hour: new Date('2025-05-28T20:15:00'),
      room: 5,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 12, 0.70)
    },

    // Interstellar - Sala 6
    {
      id: 's12',
      movieId: '6', // Interstellar
      date: new Date('2025-05-29'),
      hour: new Date('2025-05-29T15:00:00'),
      room: 6,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.30)
    },
    {
      id: 's13',
      movieId: '6', // Interstellar
      date: new Date('2025-05-29'),
      hour: new Date('2025-05-29T18:45:00'),
      room: 6,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.55)
    },

    // The Godfather - Sala 1 (día siguiente)
    {
      id: 's14',
      movieId: '7', // The Godfather
      date: new Date('2025-05-29'),
      hour: new Date('2025-05-29T17:30:00'),
      room: 1,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.35)
    },
    {
      id: 's15',
      movieId: '7', // The Godfather
      date: new Date('2025-05-29'),
      hour: new Date('2025-05-29T21:15:00'),
      room: 1,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.60)
    },

    // Pulp Fiction - Sala 2
    {
      id: 's16',
      movieId: '8', // Pulp Fiction
      date: new Date('2025-05-29'),
      hour: new Date('2025-05-29T16:15:00'),
      room: 2,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E', 'F'], 10, 0.40)
    },
    {
      id: 's17',
      movieId: '8', // Pulp Fiction
      date: new Date('2025-05-29'),
      hour: new Date('2025-05-29T19:45:00'),
      room: 2,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E', 'F'], 10, 0.65)
    },

    // The Matrix - Sala 3
    {
      id: 's18',
      movieId: '9', // The Matrix
      date: new Date('2025-05-29'),
      hour: new Date('2025-05-29T15:45:00'),
      room: 3,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.30)
    },
    {
      id: 's19',
      movieId: '9', // The Matrix
      date: new Date('2025-05-29'),
      hour: new Date('2025-05-29T20:00:00'),
      room: 3,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.55)
    },

    // The Shawshank Redemption - Sala 4
    {
      id: 's20',
      movieId: '10', // The Shawshank Redemption
      date: new Date('2025-05-30'),
      hour: new Date('2025-05-30T16:00:00'),
      room: 4,
      seats: this.generateSeats(['A', 'B', 'C', 'D'], 6, 0.25)
    },
    {
      id: 's21',
      movieId: '10', // The Shawshank Redemption
      date: new Date('2025-05-30'),
      hour: new Date('2025-05-30T19:30:00'),
      room: 4,
      seats: this.generateSeats(['A', 'B', 'C', 'D'], 6, 0.50)
    },

    // La La Land - Sala 6 (función especial de fin de semana)
    {
      id: 's22',
      movieId: '14', // La La Land
      date: new Date('2025-05-30'),
      hour: new Date('2025-05-30T18:00:00'),
      room: 6,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.45)
    },
    {
      id: 's23',
      movieId: '14', // La La Land
      date: new Date('2025-05-30'),
      hour: new Date('2025-05-30T21:30:00'),
      room: 6,
      seats: this.generateSeats(['A', 'B', 'C', 'D', 'E'], 8, 0.60)
    },

    // The Lion King - Función familiar (sábado temprano)
    {
      id: 's24',
      movieId: '12', // The Lion King
      date: new Date('2025-05-31'),
      hour: new Date('2025-05-31T14:00:00'),
      room: 4,
      seats: this.generateSeats(['A', 'B', 'C', 'D'], 6, 0.70) // Alta ocupación para función familiar
    },
    {
      id: 's25',
      movieId: '12', // The Lion King
      date: new Date('2025-05-31'),
      hour: new Date('2025-05-31T16:30:00'),
      room: 4,
      seats: this.generateSeats(['A', 'B', 'C', 'D'], 6, 0.80)
    }
  ];

  constructor() { }

  getSchedules(): Observable<Schedule[]> {
    return of(this.SCHEDULES);
  }

  getSchedulesByMovieId(movieId: string): Observable<Schedule[]> {
    const movieSchedules = this.SCHEDULES.filter(schedule => schedule.movieId === movieId);
    return of(movieSchedules);
  }

  getSchedulesByDate(date: Date): Observable<Schedule[]> {
    const dateSchedules = this.SCHEDULES.filter(schedule => 
      schedule.date.toDateString() === date.toDateString()
    );
    return of(dateSchedules);
  }

  getSchedulesByRoom(room: number): Observable<Schedule[]> {
    const roomSchedules = this.SCHEDULES.filter(schedule => schedule.room === room);
    return of(roomSchedules);
  }

  getScheduleById(id: string): Observable<Schedule | undefined> {
    const schedule = this.SCHEDULES.find(schedule => schedule.id === id);
    return of(schedule);
  }

  updateSeatAvailability(scheduleId: string, seatId: string, free: boolean): Observable<boolean> {
    const schedule = this.SCHEDULES.find(s => s.id === scheduleId);
    if (schedule) {
      const seat = schedule.seats.find(seat => seat.id === seatId);
      if (seat) {
        seat.free = free;
        return of(true);
      }
    }
    return of(false);
  }
}
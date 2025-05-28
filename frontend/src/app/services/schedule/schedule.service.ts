import { Injectable } from '@angular/core';
import { Movie } from '../movie/movie.interface';
import { Schedule } from './schedule.interface';
import { Seat } from '../seat/seat.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private  demoMovie: Movie = {
    id: 'm1',
    title: 'Inception',
    sinopsis: 'Un ladrón experto en robar secretos del subconsciente durante los sueños recibe una tarea inusual.',
    genre: 'Ciencia ficción',
    director: 'Christopher Nolan',
    actors: 'Leonardo DiCaprio, Ellen Page, Tom Hardy',
    duration: 148
  };

  private SCHEDULES: Schedule[] = [
    {
      id: 's1',
      movie: this.demoMovie,
      date: new Date('2025-06-01'),
      hour: new Date('2025-06-01T15:00:00'),
      room: 1,
      seats: [
        { id: 'A1', row: 'A', column: 1, free: true },
        { id: 'A2', row: 'A', column: 2, free: false },
        { id: 'A3', row: 'A', column: 3, free: true }
      ]
    },
    {
      id: 's2',
      movie: this.demoMovie,
      date: new Date('2025-06-01'),
      hour: new Date('2025-06-01T18:00:00'),
      room: 2,
      seats: [
        { id: 'B1', row: 'B', column: 1, free: true },
        { id: 'B2', row: 'B', column: 2, free: true },
        { id: 'B3', row: 'B', column: 3, free: false }
      ]
    },
    {
      id: 's3',
      movie: this.demoMovie,
      date: new Date('2025-06-02'),
      hour: new Date('2025-06-02T21:00:00'),
      room: 3,
      seats: [
        { id: 'C1', row: 'C', column: 1, free: false },
        { id: 'C2', row: 'C', column: 2, free: true },
        { id: 'C3', row: 'C', column: 3, free: true }
      ]
    }
  ];

  constructor() { }

  getSchedules() : Observable<Schedule[]>{
    return of(this.SCHEDULES);
  }
}

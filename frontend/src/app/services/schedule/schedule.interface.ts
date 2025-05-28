
import { Seat } from "../seat/seat.interface";

export interface Schedule {
    id: string;
    movieId: string; // Cambiado de 'movie: Movie' a 'movieId: string'
    date: Date;
    hour: Date;
    room: number;
    seats: Seat[];
  }
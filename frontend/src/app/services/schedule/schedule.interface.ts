import { Movie } from "../movie/movie.interface";
import { Seat } from "../seat/seat.interface";

export interface Schedule{
    id: string,
    movie: Movie,
    date: Date,
    hour: Date,
    room: number,
    seats: Seat[]
}
import { Movie } from "../movie/movie.interface";
import { User } from "../user/user.interface";

export interface Review{
    id: string,
    user: User,
    movie: Movie,
    comment: string,
    rate: number,
    date :Date
}
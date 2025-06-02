
import { User } from "../user/user.interface";

export interface Review {
  
    id: string,
    _id: string,
    user: User,
    movieId: string, // Cambiado de 'movie: Movie' a 'movieId: string'
    comment: string,
    rate: number, // 1-5 stars
    date: Date
  }
  
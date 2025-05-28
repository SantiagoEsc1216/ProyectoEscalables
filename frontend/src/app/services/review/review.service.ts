import { Injectable } from '@angular/core';
import { User } from '../user/user.interface';
import { Movie } from '../movie/movie.interface';
import { Review } from './review.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private demoUser1: User = {
    id: 'u1',
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    role: 'viewer'
  };
  
  private demoUser2: User = {
    id: 'u2',
    name: 'Carlos Sánchez',
    email: 'carlos.sanchez@example.com',
    role: 'viewer'
  };
  
  private demoMovie1: Movie = {
    id: 'm1',
    title: 'Inception',
    sinopsis: 'Un ladrón experto en robar secretos del subconsciente durante los sueños recibe una tarea inusual.',
    genre: 'Ciencia ficción',
    director: 'Christopher Nolan',
    actors: 'Leonardo DiCaprio, Ellen Page, Tom Hardy',
    duration: 148
  };
  
  private demoMovie2: Movie = {
    id: 'm2',
    title: 'Titanic',
    sinopsis: 'Una joven aristócrata se enamora de un artista pobre a bordo del Titanic.',
    genre: 'Romance',
    director: 'James Cameron',
    actors: 'Leonardo DiCaprio, Kate Winslet',
    duration: 195
  };

  private REVIEWS: Review[] = [
    {
      id: 'r1',
      user: this.demoUser1,
      movie: this.demoMovie1,
      comment: '¡Una película impresionante! El concepto de los sueños dentro de sueños me voló la cabeza.',
      rate: 5,
      date: new Date('2025-06-01')
    },
    {
      id: 'r2',
      user: this.demoUser2,
      movie: this.demoMovie2,
      comment: 'Muy emotiva. Lloré al final. Los efectos y la música son excelentes.',
      rate: 4,
      date: new Date('2025-06-02')
    },
    {
      id: 'r3',
      user: this.demoUser1,
      movie: this.demoMovie2,
      comment: 'La historia es buena, pero algo larga para mi gusto.',
      rate: 3,
      date: new Date('2025-06-03')
    }
  ];

  constructor() { }

  getReviews() : Observable<Review[]>{
    return of(this.REVIEWS);
  }
}

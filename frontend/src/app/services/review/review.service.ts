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

  private demoUser3: User = {
    id: 'u3',
    name: 'María González',
    email: 'maria.gonzalez@example.com',
    role: 'viewer'
  };

  private demoUser4: User = {
    id: 'u4',
    name: 'Roberto López',
    email: 'roberto.lopez@example.com',
    role: 'viewer'
  };

  // Referencias a las películas del MovieService usando solo los IDs
  private REVIEWS: Review[] = [
    {
      id: 'r1',
      user: this.demoUser1,
      movieId: '1', // Inception
      comment: '¡Una película impresionante! El concepto de los sueños dentro de sueños me voló la cabeza.',
      rate: 5,
      date: new Date('2025-05-01')
    },
    {
      id: 'r2',
      user: this.demoUser2,
      movieId: '2', // Titanic
      comment: 'Muy emotiva. Lloré al final. Los efectos y la música son excelentes.',
      rate: 4,
      date: new Date('2025-05-02')
    },
    {
      id: 'r3',
      user: this.demoUser1,
      movieId: '2', // Titanic
      comment: 'La historia es buena, pero algo larga para mi gusto.',
      rate: 3,
      date: new Date('2025-05-03')
    },
    {
      id: 'r4',
      user: this.demoUser3,
      movieId: '3', // The Dark Knight
      comment: 'Heath Ledger como el Joker es simplemente perfecto. Una obra maestra del cine.',
      rate: 5,
      date: new Date('2025-05-04')
    },
    {
      id: 'r5',
      user: this.demoUser4,
      movieId: '4', // Forrest Gump
      comment: 'Una película que te hace reflexionar sobre la vida. Tom Hanks increíble como siempre.',
      rate: 4,
      date: new Date('2025-05-05')
    },
    {
      id: 'r6',
      user: this.demoUser2,
      movieId: '5', // Avengers: Endgame
      comment: 'El final perfecto para la saga. Lloré, reí y me emocioné durante 3 horas.',
      rate: 5,
      date: new Date('2025-05-06')
    },
    {
      id: 'r7',
      user: this.demoUser3,
      movieId: '6', // Interstellar
      comment: 'Nolan otra vez demostrando su genialidad. La ciencia y las emociones perfectamente balanceadas.',
      rate: 4,
      date: new Date('2025-05-07')
    },
    {
      id: 'r8',
      user: this.demoUser1,
      movieId: '7', // The Godfather
      comment: 'Un clásico que nunca pasa de moda. Marlon Brando legendario.',
      rate: 5,
      date: new Date('2025-05-08')
    },
    {
      id: 'r9',
      user: this.demoUser4,
      movieId: '8', // Pulp Fiction
      comment: 'Tarantino en su máxima expresión. Diálogos brillantes y narrativa única.',
      rate: 4,
      date: new Date('2025-05-09')
    },
    {
      id: 'r10',
      user: this.demoUser2,
      movieId: '9', // The Matrix
      comment: 'Revolucionó el cine de ciencia ficción. Los efectos siguen siendo impresionantes.',
      rate: 5,
      date: new Date('2025-05-10')
    },
    {
      id: 'r11',
      user: this.demoUser3,
      movieId: '10', // The Shawshank Redemption
      comment: 'La mejor película sobre la esperanza y la amistad. Me emociona cada vez que la veo.',
      rate: 5,
      date: new Date('2025-05-11')
    },
    {
      id: 'r12',
      user: this.demoUser1,
      movieId: '11', // Gladiator
      comment: 'Russell Crowe espectacular. Las escenas de combate son épicas.',
      rate: 4,
      date: new Date('2025-05-12')
    },
    {
      id: 'r13',
      user: this.demoUser4,
      movieId: '12', // The Lion King
      comment: 'Una joya de Disney. La música de Hans Zimmer es sublime.',
      rate: 4,
      date: new Date('2025-05-13')
    },
    {
      id: 'r14',
      user: this.demoUser2,
      movieId: '13', // Fight Club
      comment: 'Una película que te hace cuestionar todo. El final es impactante.',
      rate: 4,
      date: new Date('2025-05-14')
    },
    {
      id: 'r15',
      user: this.demoUser3,
      movieId: '14', // La La Land
      comment: 'Hermosa película musical. Ryan Gosling y Emma Stone tienen una química perfecta.',
      rate: 4,
      date: new Date('2025-05-15')
    },
    {
      id: 'r16',
      user: this.demoUser1,
      movieId: '15', // The Social Network
      comment: 'Fascinante ver cómo se creó Facebook. Jesse Eisenberg perfecto como Zuckerberg.',
      rate: 3,
      date: new Date('2025-05-16')
    },
    {
      id: 'r17',
      user: this.demoUser4,
      movieId: '1', // Inception - segunda review
      comment: 'Cada vez que la veo descubro algo nuevo. Christopher Nolan es un genio.',
      rate: 5,
      date: new Date('2025-05-17')
    },
    {
      id: 'r18',
      user: this.demoUser3,
      movieId: '3', // The Dark Knight - segunda review
      comment: 'La mejor película de superhéroes jamás hecha. Oscura y realista.',
      rate: 5,
      date: new Date('2025-05-18')
    }
  ];


  constructor() { }

  getReviews(): Observable<Review[]> {
    return of(this.REVIEWS);
  }

  getReviewsByMovieId(movieId: string): Observable<Review[]> {
    const movieReviews = this.REVIEWS.filter(review => review.movieId === movieId);
    return of(movieReviews);
  }

  getReviewsByUserId(userId: string): Observable<Review[]> {
    const userReviews = this.REVIEWS.filter(review => review.user.id === userId);
    return of(userReviews);
  }

  addReview(review: Review): Observable<Review> {
    this.REVIEWS.push(review);
    return of(review);
  }
}

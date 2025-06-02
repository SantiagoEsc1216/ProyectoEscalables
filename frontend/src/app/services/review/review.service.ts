import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Review } from './review.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) { }

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  getReviewsByMovieId(movieId: string): Observable<Review[]> {
    return this.http.get<any[]>(`${this.apiUrl}/movie/${movieId}`).pipe(
      map(reviews => reviews.map(review => ({
        ...review,
        id: review.id || review._id
      })))
    );
  }

  getReviewsByUserId(userId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
  }

  addReview(review: any): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, {
      userId: review.user,
      movieId: review.movieId,
      comment: review.comment,
      rate: review.rate
    });
  }

  updateReview(reviewId: string, review: any): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`, {
      userId: review.user,
      movieId: review.movieId,
      comment: review.comment,
      rate: review.rate
    });
  }
}

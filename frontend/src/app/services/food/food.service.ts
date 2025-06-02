import { Injectable } from '@angular/core';
import { Food } from './food.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = `${environment.apiUrl}/api/food`;

  constructor(private http: HttpClient) { }

  getFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(this.apiUrl);
  }

  getFood(id: string): Observable<Food> {
    return this.http.get<Food>(`${this.apiUrl}/${id}`);
  }

  createFood(food: Food): Observable<Food> {
    return this.http.post<Food>(this.apiUrl, food);
  }

  updateFood(id: string, food: Food): Observable<Food> {
    return this.http.put<Food>(`${this.apiUrl}/${id}`, food);
  }

  deleteFood(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

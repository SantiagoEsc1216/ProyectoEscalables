import { Injectable } from '@angular/core';
import { Food } from '../food/food.interface';
import { Schedule } from '../schedule/schedule.interface';
import { Order } from './order.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/orders`;
  private currentOrder: Order | null = null;

  constructor(private http: HttpClient) { }

  createOrder(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getCurrentOrder(): Observable<Order | null> {
    return new Observable(observer => {
      observer.next(this.currentOrder);
      observer.complete();
    });
  }

  clearCurrentOrder(): void {
    this.currentOrder = null;
  }

  confirmOrder(order: Order): Observable<Order> {
    this.currentOrder = null;
    return this.http.post<Order>(this.apiUrl, order);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateOrder(id: string, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

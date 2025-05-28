import { Injectable } from '@angular/core';
import { Food } from '../food/food.interface';
import { Schedule } from '../schedule/schedule.interface';
import { Order } from './order.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private foodItems: Food[] = [
    { id: 'f1', name: 'Palomitas grandes', image: 'popcorn.png', price: '80', amount: 1 },
    { id: 'f2', name: 'Refresco mediano', image: 'soda.png', price: '45', amount: 2 }
  ];

  private sampleSchedule: Schedule = {
    id: 's1',
    movie: {
      id: 'm1',
      title: 'Inception',
      sinopsis: 'Un ladrón experto en robar secretos del subconsciente durante los sueños recibe una tarea inusual.',
      genre: 'Ciencia ficción',
      director: 'Christopher Nolan',
      actors: 'Leonardo DiCaprio, Ellen Page, Tom Hardy',
      duration: 148
    },
    date: new Date('2025-06-10'),
    hour: new Date('2025-06-10T19:30:00'),
    room: 2,
    seats: [
      { id: 'D1', row: 'D', column: 1, free: false },
      { id: 'D2', row: 'D', column: 2, free: false }
    ]
  };

  private ORDERS: Order[] = [
    {
      id: 'o1',
      user: 'u1',
      schedule: this.sampleSchedule,
      foods: this.foodItems,
      seats: ['D1', 'D2'],
      price: 170,
      date: new Date('2025-06-05')
    },
    {
      id: 'o2',
      user: 'u2',
      schedule: this.sampleSchedule,
      foods: [],
      seats: ['C3'],
      price: 100,
      date: new Date('2025-06-05')
    },
    {
      id: 'o3',
      user: 'u1',
      schedule: this.sampleSchedule,
      foods: [
        { id: 'f3', name: 'Nachos con queso', image: 'nachos.png', price: '60', amount: 1 }
      ],
      seats: ['E1'],
      price: 160,
      date: new Date('2025-06-06')
    }
  ];

  constructor() { }

  getOrders(): Observable<Order[]>{
    return of(this.ORDERS);
  }
}

import { Injectable } from '@angular/core';
import { Food } from './food.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private FOODS: Food[] = [
    {
      id: '1',
      name: 'Palomitas',
      image: 'https://example.com/images/pizza-margarita.jpg',
      price: '150.00',
      amount: 0
    },
    {
      id: '2',
      name: 'HotDog',
      image: 'https://example.com/images/hamburguesa-clasica.jpg',
      price: '120.00',
      amount: 0
    },
    {
      id: '3',
      name: 'Nachos',
      image: 'https://example.com/images/sushi-variado.jpg',
      price: '180.00',
      amount: 0
    },
    {
      id: '4',
      name: 'Icee',
      image: 'https://example.com/images/tacos-al-pastor.jpg',
      price: '90.00',
      amount: 0
    },
    {
      id: '5',
      name: 'Coca-Cola',
      image: 'https://example.com/images/ensalada-cesar.jpg',
      price: '75.00',
      amount: 0
    }
  ];
  
  constructor() { }

  getFoods() : Observable<Food[]>{
    return of(this.FOODS);
  }
}

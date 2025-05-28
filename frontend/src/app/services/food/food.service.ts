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
      image: 'https://comerbeber.com/archivos/imagen/2022/09/nachos-cv_1200.jpg',
      price: '150.00',
      amount: 0
    },
    {
      id: '2',
      name: 'HotDog',
      image: 'https://comerbeber.com/archivos/imagen/2022/09/nachos-cv_1200.jpg',
      price: '120.00',
      amount: 0
    },
    {
      id: '3',
      name: 'Nachos',
      image: 'https://comerbeber.com/archivos/imagen/2022/09/nachos-cv_1200.jpg',
      price: '180.00',
      amount: 0
    },
    {
      id: '4',
      name: 'Icee',
      image: 'https://comerbeber.com/archivos/imagen/2022/09/nachos-cv_1200.jpg',
      price: '90.00',
      amount: 0
    },
    {
      id: '5',
      name: 'Coca-Cola',
      image: 'https://comerbeber.com/archivos/imagen/2022/09/nachos-cv_1200.jpg',
      price: '75.00',
      amount: 0
    }
  ];
  
  constructor() { }

  getFoods() : Observable<Food[]>{
    return of(this.FOODS);
  }
}

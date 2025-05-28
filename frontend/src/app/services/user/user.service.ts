import { Injectable } from '@angular/core';
import { User } from './user.interface';
import { Observable, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USERS: User[] = [
    {
      id: '1',
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Luis Pérez',
      email: 'luis.perez@example.com',
      role: 'editor'
    },
    {
      id: '3',
      name: 'María Gómez',
      email: 'maria.gomez@example.com',
      role: 'viewer'
    },
    {
      id: '4',
      name: 'Carlos Sánchez',
      email: 'carlos.sanchez@example.com',
      role: 'editor'
    },
    {
      id: '5',
      name: 'Sofía Ramírez',
      email: 'sofia.ramirez@example.com',
      role: 'admin'
    }
  ]

  constructor() { }

  getUsers() : Observable<User[]>{
    return of(this.USERS);
  }
}

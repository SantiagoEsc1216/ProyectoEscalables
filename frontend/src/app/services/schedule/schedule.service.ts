import { Injectable } from '@angular/core';
import { Movie } from '../movie/movie.interface';
import { Schedule } from './schedule.interface';
import { Seat } from '../seat/seat.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = `${environment.apiUrl}/api/schedules`;

  constructor(private http: HttpClient) { }

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.apiUrl);
  }

  getSchedulesByMovieId(movieId: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/movie/${movieId}`);
  }

  getSchedulesByDate(date: Date): Observable<Schedule[]> {
    const dateStr = date.toISOString().split('T')[0];
    return this.http.get<Schedule[]>(`${this.apiUrl}/date/${dateStr}`);
  }

  getSchedulesByRoom(room: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/room/${room}`);
  }

  getScheduleById(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.apiUrl}/${id}`);
  }

  updateSeatAvailability(scheduleId: string, seatId: string, free: boolean): Observable<Schedule> {
    return this.http.patch<Schedule>(`${this.apiUrl}/${scheduleId}/seat/${seatId}`, { free });
  }

  createSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(this.apiUrl, schedule);
  }

  updateSchedule(id: string, schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.apiUrl}/${id}`, schedule);
  }

  deleteSchedule(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
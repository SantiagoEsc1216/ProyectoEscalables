import { Injectable } from '@angular/core';
import { Seat } from './seat.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  constructor() { }

  /**
   * Obtiene todos los asientos de un horario específico
   */
  getSeatsByScheduleId(scheduleId: string, allSchedules: any[]): Observable<Seat[]> {
    const schedule = allSchedules.find(s => s.id === scheduleId);
    return of(schedule ? schedule.seats : []);
  }

  /**
   * Obtiene solo los asientos disponibles (libres) de un horario
   */
  getAvailableSeats(seats: Seat[]): Observable<Seat[]> {
    const availableSeats = seats.filter(seat => seat.free);
    return of(availableSeats);
  }

  /**
   * Obtiene solo los asientos ocupados de un horario
   */
  getOccupiedSeats(seats: Seat[]): Observable<Seat[]> {
    const occupiedSeats = seats.filter(seat => !seat.free);
    return of(occupiedSeats);
  }

  /**
   * Cuenta el número total de asientos disponibles
   */
  countAvailableSeats(seats: Seat[]): number {
    return seats.filter(seat => seat.free).length;
  }

  /**
   * Cuenta el número total de asientos ocupados
   */
  countOccupiedSeats(seats: Seat[]): number {
    return seats.filter(seat => !seat.free).length;
  }

  /**
   * Obtiene el porcentaje de ocupación de la sala
   */
  getOccupancyPercentage(seats: Seat[]): number {
    if (seats.length === 0) return 0;
    const occupiedCount = this.countOccupiedSeats(seats);
    return Math.round((occupiedCount / seats.length) * 100);
  }

  /**
   * Agrupa los asientos por fila
   */
  getSeatsByRow(seats: Seat[]): Observable<{[key: string]: Seat[]}> {
    const seatsByRow = seats.reduce((acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = [];
      }
      acc[seat.row].push(seat);
      return acc;
    }, {} as {[key: string]: Seat[]});

    // Ordena los asientos dentro de cada fila por columna
    Object.keys(seatsByRow).forEach(row => {
      seatsByRow[row].sort((a, b) => a.column - b.column);
    });

    return of(seatsByRow);
  }

  /**
   * Busca un asiento específico por su ID
   */
  getSeatById(seatId: string, seats: Seat[]): Observable<Seat | undefined> {
    const seat = seats.find(s => s.id === seatId);
    return of(seat);
  }

  /**
   * Verifica si un asiento específico está disponible
   */
  isSeatAvailable(seatId: string, seats: Seat[]): boolean {
    const seat = seats.find(s => s.id === seatId);
    return seat ? seat.free : false;
  }

  /**
   * Busca asientos disponibles consecutivos en una fila
   */
  findConsecutiveSeats(seats: Seat[], row: string, quantity: number): Observable<Seat[]> {
    const rowSeats = seats
      .filter(seat => seat.row === row && seat.free)
      .sort((a, b) => a.column - b.column);

    const consecutiveSeats: Seat[] = [];
    
    for (let i = 0; i <= rowSeats.length - quantity; i++) {
      let isConsecutive = true;
      const tempSeats = [rowSeats[i]];
      
      for (let j = 1; j < quantity; j++) {
        if (rowSeats[i + j] && rowSeats[i + j].column === rowSeats[i + j - 1].column + 1) {
          tempSeats.push(rowSeats[i + j]);
        } else {
          isConsecutive = false;
          break;
        }
      }
      
      if (isConsecutive && tempSeats.length === quantity) {
        consecutiveSeats.push(...tempSeats);
        break;
      }
    }
    
    return of(consecutiveSeats);
  }

  /**
   * Busca los mejores asientos disponibles (centro de la sala)
   */
  getBestAvailableSeats(seats: Seat[], quantity: number = 1): Observable<Seat[]> {
    const availableSeats = seats.filter(seat => seat.free);
    
    if (availableSeats.length === 0) {
      return of([]);
    }

    // Obtener todas las filas y columnas para calcular el centro
    const rows = [...new Set(seats.map(seat => seat.row))].sort();
    const maxColumns = Math.max(...seats.map(seat => seat.column));
    
    const centerRow = Math.floor(rows.length / 2);
    const centerColumn = Math.floor(maxColumns / 2);
    
    // Calcular distancia al centro para cada asiento disponible
    const seatsWithDistance = availableSeats.map(seat => {
      const rowIndex = rows.indexOf(seat.row);
      const rowDistance = Math.abs(rowIndex - centerRow);
      const colDistance = Math.abs(seat.column - centerColumn);
      const totalDistance = rowDistance + colDistance;
      
      return {
        seat,
        distance: totalDistance
      };
    });
    
    // Ordenar por distancia al centro (los más cercanos primero)
    seatsWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Devolver la cantidad solicitada de mejores asientos
    const bestSeats = seatsWithDistance
      .slice(0, quantity)
      .map(item => item.seat);
    
    return of(bestSeats);
  }

  /**
   * Simula la reserva de asientos (marca como ocupados)
   */
  reserveSeats(seatIds: string[], seats: Seat[]): Observable<boolean> {
    let allReserved = true;
    
    seatIds.forEach(seatId => {
      const seat = seats.find(s => s.id === seatId);
      if (seat && seat.free) {
        seat.free = false;
      } else {
        allReserved = false;
      }
    });
    
    return of(allReserved);
  }

  /**
   * Simula la liberación de asientos (marca como disponibles)
   */
  releaseSeats(seatIds: string[], seats: Seat[]): Observable<boolean> {
    let allReleased = true;
    
    seatIds.forEach(seatId => {
      const seat = seats.find(s => s.id === seatId);
      if (seat && !seat.free) {
        seat.free = true;
      } else {
        allReleased = false;
      }
    });
    
    return of(allReleased);
  }

  /**
   * Obtiene estadísticas de ocupación de la sala
   */
  getSeatStatistics(seats: Seat[]): Observable<{
    total: number;
    available: number;
    occupied: number;
    occupancyPercentage: number;
    availabilityPercentage: number;
  }> {
    const total = seats.length;
    const available = this.countAvailableSeats(seats);
    const occupied = this.countOccupiedSeats(seats);
    const occupancyPercentage = this.getOccupancyPercentage(seats);
    const availabilityPercentage = 100 - occupancyPercentage;

    return of({
      total,
      available,
      occupied,
      occupancyPercentage,
      availabilityPercentage
    });
  }

  /**
   * Valida si es posible hacer una reserva con los asientos seleccionados
   */
  validateSeatSelection(seatIds: string[], seats: Seat[]): Observable<{
    valid: boolean;
    message: string;
    unavailableSeats: string[];
  }> {
    const unavailableSeats: string[] = [];
    
    seatIds.forEach(seatId => {
      const seat = seats.find(s => s.id === seatId);
      if (!seat) {
        unavailableSeats.push(seatId);
      } else if (!seat.free) {
        unavailableSeats.push(seatId);
      }
    });

    const valid = unavailableSeats.length === 0;
    let message = '';

    if (!valid) {
      if (unavailableSeats.length === 1) {
        message = `El asiento ${unavailableSeats[0]} no está disponible.`;
      } else {
        message = `Los asientos ${unavailableSeats.join(', ')} no están disponibles.`;
      }
    } else {
      message = 'Todos los asientos seleccionados están disponibles.';
    }

    return of({
      valid,
      message,
      unavailableSeats
    });
  }
}
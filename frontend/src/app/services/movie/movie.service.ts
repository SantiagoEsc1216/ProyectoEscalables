import { Injectable } from '@angular/core';
import { Movie } from './movie.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private MOVIES: Movie[] = [
    {
      id: '1',
      title: 'Inception',
      sinopsis: 'Un ladrón que roba secretos corporativos a través del uso de la tecnología de sueños compartidos recibe la tarea inversa de implantar una idea en la mente de un director ejecutivo.',
      genre: 'Ciencia ficción',
      director: 'Christopher Nolan',
      actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page',
      duration: 148
    },
    {
      id: '2',
      title: 'Titanic',
      sinopsis: 'Una joven aristócrata se enamora de un artista pobre a bordo del lujoso e infortunado RMS Titanic.',
      genre: 'Romance',
      director: 'James Cameron',
      actors: 'Leonardo DiCaprio, Kate Winslet',
      duration: 195
    },
    {
      id: '3',
      title: 'The Dark Knight',
      sinopsis: 'Batman enfrenta al Joker, un criminal caótico que busca sumir a Gotham en la anarquía.',
      genre: 'Acción',
      director: 'Christopher Nolan',
      actors: 'Christian Bale, Heath Ledger, Aaron Eckhart',
      duration: 152
    },
    {
      id: '4',
      title: 'Forrest Gump',
      sinopsis: 'La historia de un hombre con bajo coeficiente intelectual que influye en muchos eventos históricos en EE.UU. durante el siglo XX.',
      genre: 'Drama',
      director: 'Robert Zemeckis',
      actors: 'Tom Hanks, Robin Wright',
      duration: 142
    },
    {
      id: '5',
      title: 'Avengers: Endgame',
      sinopsis: 'Los Vengadores restantes deben encontrar una manera de restaurar el orden en el universo después del chasquido de Thanos.',
      genre: 'Superhéroes',
      director: 'Anthony y Joe Russo',
      actors: 'Robert Downey Jr., Chris Evans, Scarlett Johansson',
      duration: 181
    }
  ]

  constructor() { }

  getMovies(): Observable<Movie[]>{
    return of(this.MOVIES);
  }
}

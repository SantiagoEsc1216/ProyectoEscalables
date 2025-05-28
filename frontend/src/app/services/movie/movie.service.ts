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
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Un ladrón que roba secretos corporativos a través del uso de la tecnología de sueños compartidos recibe la tarea inversa de implantar una idea en la mente de un director ejecutivo.',
      genre: 'Ciencia ficción',
      director: 'Christopher Nolan',
      actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page',
      duration: 148
    },
    {
      id: '2',
      title: 'Titanic',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Una joven aristócrata se enamora de un artista pobre a bordo del lujoso e infortunado RMS Titanic.',
      genre: 'Romance',
      director: 'James Cameron',
      actors: 'Leonardo DiCaprio, Kate Winslet',
      duration: 195
    },
    {
      id: '3',
      title: 'The Dark Knight',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Batman enfrenta al Joker, un criminal caótico que busca sumir a Gotham en la anarquía.',
      genre: 'Acción',
      director: 'Christopher Nolan',
      actors: 'Christian Bale, Heath Ledger, Aaron Eckhart',
      duration: 152
    },
    {
      id: '4',
      title: 'Forrest Gump',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'La historia de un hombre con bajo coeficiente intelectual que influye en muchos eventos históricos en EE.UU. durante el siglo XX.',
      genre: 'Drama',
      director: 'Robert Zemeckis',
      actors: 'Tom Hanks, Robin Wright',
      duration: 142
    },
    {
      id: '5',
      title: 'Avengers: Endgame',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Los Vengadores restantes deben encontrar una manera de restaurar el orden en el universo después del chasquido de Thanos.',
      genre: 'Superhéroes',
      director: 'Anthony y Joe Russo',
      actors: 'Robert Downey Jr., Chris Evans, Scarlett Johansson',
      duration: 181
    },
    {
      id: '6',
      title: 'Interstellar',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por asegurar el futuro de la humanidad.',
      genre: 'Ciencia ficción',
      director: 'Christopher Nolan',
      actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
      duration: 169
    },
    {
      id: '7',
      title: 'The Godfather',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'La historia de la familia criminal Corleone, centrada en el ascenso de Michael como jefe de la mafia.',
      genre: 'Crimen',
      director: 'Francis Ford Coppola',
      actors: 'Marlon Brando, Al Pacino, James Caan',
      duration: 175
    },
    {
      id: '8',
      title: 'Pulp Fiction',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Historias entrelazadas de crimen en Los Ángeles contadas con narrativa no lineal.',
      genre: 'Crimen',
      director: 'Quentin Tarantino',
      actors: 'John Travolta, Uma Thurman, Samuel L. Jackson',
      duration: 154
    },
    {
      id: '9',
      title: 'The Matrix',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Un hacker descubre la verdadera naturaleza de su realidad y su papel en la guerra contra sus controladores.',
      genre: 'Ciencia ficción',
      director: 'Lana y Lilly Wachowski',
      actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
      duration: 136
    },
    {
      id: '10',
      title: 'The Shawshank Redemption',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Dos hombres encarcelados entablan una amistad que dura décadas mientras encuentran consuelo y redención a través de actos comunes de decencia.',
      genre: 'Drama',
      director: 'Frank Darabont',
      actors: 'Tim Robbins, Morgan Freeman',
      duration: 142
    },
    {
      id: '11',
      title: 'Gladiator',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Un general romano traicionado se convierte en gladiador y busca venganza contra el emperador corrupto.',
      genre: 'Acción',
      director: 'Ridley Scott',
      actors: 'Russell Crowe, Joaquin Phoenix',
      duration: 155
    },
    {
      id: '12',
      title: 'The Lion King',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Un joven león debe reclamar su lugar como rey tras la muerte de su padre.',
      genre: 'Animación',
      director: 'Roger Allers, Rob Minkoff',
      actors: 'Matthew Broderick, Jeremy Irons, James Earl Jones',
      duration: 88
    },
    {
      id: '13',
      title: 'Fight Club',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Un insomne forma un club secreto de peleas con un vendedor de jabón carismático.',
      genre: 'Drama',
      director: 'David Fincher',
      actors: 'Brad Pitt, Edward Norton, Helena Bonham Carter',
      duration: 139
    },
    {
      id: '14',
      title: 'La La Land',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'Un músico y una actriz persiguen sus sueños en Los Ángeles mientras enfrentan los desafíos del amor y el éxito.',
      genre: 'Musical',
      director: 'Damien Chazelle',
      actors: 'Ryan Gosling, Emma Stone',
      duration: 128
    },
    {
      id: '15',
      title: 'The Social Network',
      poster: 'https://i.blogs.es/89d7af/inception-poster/450_1000.jpg',
      sinopsis: 'La historia del surgimiento de Facebook y las disputas legales que enfrentó su creador.',
      genre: 'Biográfico',
      director: 'David Fincher',
      actors: 'Jesse Eisenberg, Andrew Garfield, Justin Timberlake',
      duration: 120
    }
  ]

  constructor() { }

  getMovies(): Observable<Movie[]>{
    return of(this.MOVIES);
  }
}

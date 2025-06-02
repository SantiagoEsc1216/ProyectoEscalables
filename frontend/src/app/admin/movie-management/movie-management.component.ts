import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie/movie.service';
import { Movie } from '../../services/movie/movie.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-management',
  templateUrl: './movie-management.component.html',
  styleUrls: ['movie-management.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MovieManagementComponent implements OnInit {
  movies: Movie[] = [];
  movieForm: FormGroup;
  showForm = false;
  editingMovie: Movie | null = null;

  posterPreview: string | null = null;

  constructor(
    private movieService: MovieService,
    private fb: FormBuilder
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      poster: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      genre: ['', Validators.required],
      director: ['', Validators.required],
      actors: ['', Validators.required],
      sinopsis: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getAdminMovies().subscribe(movies => {
      this.movies = movies;
    });
  }

  showAddForm() {
    this.editingMovie = null;
    this.movieForm.reset();
    this.showForm = true;
  }


  editMovie(movie: Movie) {
    console.log(movie);
    this.editingMovie = movie;
    this.movieForm.setValue({
      title: movie.title || '',
      poster: movie.poster || '',
      duration: movie.duration || 1,
      genre: movie.genre || '',
      director: movie.director || '',
      actors: movie.actors || '',
      sinopsis: movie.sinopsis || ''
    });
    this.posterPreview = movie.poster || null;
    this.showForm = true;
  }

  cancelEdit() {
    this.showForm = false;
    this.editingMovie = null;
    this.movieForm.reset();
  }

  onSubmit() {
    if (this.movieForm.valid) {
      const movieData = this.movieForm.value;

      if (this.editingMovie) {
        this.movieService.updateMovie(this.editingMovie.id, movieData).subscribe(() => {
          this.loadMovies();
          this.cancelEdit();
        });
      } else {
        this.movieService.createMovie(movieData).subscribe(() => {
          this.loadMovies();
          this.cancelEdit();
        });
      }
    }
  }

  deleteMovie(id: string) {
    if (confirm('¿Está seguro de que desea eliminar esta película?')) {
      this.movieService.deleteMovie(id).subscribe(() => {
        this.loadMovies();
      });
    }
  }
} 
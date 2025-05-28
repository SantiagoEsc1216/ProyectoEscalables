import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { Movie } from '../../services/movie/movie.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  currentMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getMovies().subscribe(movies => {
      // For demo purposes, we'll split the movies array in half
      const half = Math.ceil(movies.length / 2);
      this.currentMovies = movies.slice(0, half);
      this.upcomingMovies = movies.slice(half);
    });
  }

  scrollCarousel(direction: 'left' | 'right', carouselId: string) {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
      const scrollAmount = 300; // Adjust this value based on your needs
      const currentScroll = carousel.scrollLeft;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      
      let newScroll: number;
      
      if (direction === 'left') {
        // Si estamos al inicio y queremos ir a la izquierda, vamos al final
        if (currentScroll <= 0) {
          newScroll = maxScroll;
        } else {
          newScroll = currentScroll - scrollAmount;
        }
      } else {
        // Si estamos al final y queremos ir a la derecha, volvemos al inicio
        if (currentScroll >= maxScroll) {
          newScroll = 0;
        } else {
          newScroll = currentScroll + scrollAmount;
        }
      }
      
      carousel.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  }
}

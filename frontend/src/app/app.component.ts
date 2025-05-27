import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  template: `<h1>{{ mensaje }}</h1>`
})
export class AppComponent implements OnInit {
  mensaje = 'Cargando...';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getSaludo().subscribe({
      next: (data) => this.mensaje = data.mensaje,
      error: (err) => this.mensaje = 'Error al conectar con el backend'
    });
  }
}

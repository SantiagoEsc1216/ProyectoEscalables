import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports:[RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  mensaje = 'Cargando...';

  constructor(private api: ApiService) { }

  ngOnInit() {

  }
}

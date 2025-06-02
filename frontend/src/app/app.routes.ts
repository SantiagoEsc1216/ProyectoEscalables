import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { MovieComponent } from './pages/movie/movie.component';
import { LoginComponent } from './pages/login/login.component';
import { OrderComponent } from './pages/order/order.component';
import { PayOrderComponent } from './pages/pay-order/pay-order.component';
import { SelectFoodsComponent } from './pages/select-foods/select-foods.component';
import { SelectSeatsComponent } from './pages/select-seats/select-seats.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'movie/:id', component: MovieComponent},
    {path: 'login', component: LoginComponent},
    {path: 'order/:id', component: OrderComponent},
    {path: 'payOrder/:id', component: PayOrderComponent},
    {path: 'selectFoods/:id', component: SelectFoodsComponent},
    {path: 'selectSeats/:id', component: SelectSeatsComponent},
    {path: 'profile', component: ProfileComponent}
];

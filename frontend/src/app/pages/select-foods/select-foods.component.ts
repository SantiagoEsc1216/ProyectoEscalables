import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FoodService } from '../../services/food/food.service';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { OrderService } from '../../services/order/order.service';
import { Food } from '../../services/food/food.interface';
import { Schedule } from '../../services/schedule/schedule.interface';
import { Order } from '../../services/order/order.interface';

@Component({
  selector: 'app-select-foods',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-foods.component.html',
  styleUrl: './select-foods.component.css'
})
export class SelectFoodsComponent implements OnInit {
  foods: Food[] = [];
  selectedFoods: Food[] = [];
  schedule: Schedule | null = null;
  currentOrder: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private foodService: FoodService,
    private scheduleService: ScheduleService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    const scheduleId = this.route.snapshot.params['id'];
    this.loadSchedule(scheduleId);
    this.loadFoods();
    this.loadCurrentOrder();
  }

  private loadSchedule(scheduleId: string) {
    this.scheduleService.getScheduleById(scheduleId).subscribe({
      next: (schedule) => {
        if (schedule) {
          this.schedule = schedule;
        }
      },
      error: () => {
        console.log("load schedule");
        this.router.navigate(['/']);
      }
    });
  }

  private loadFoods() {
    this.foodService.getFoods().subscribe({
      next: (foods) => {
        this.foods = foods;
        this.selectedFoods = foods.map(food => ({...food}));
      },
      error: (error) => {
        console.error('Error loading foods:', error);
      }
    });
  }

  private loadCurrentOrder() {
    this.orderService.getCurrentOrder().subscribe({
      next: (order) => {
        if (!order) {
          console.log("load curren !order");
          this.router.navigate(['/']);
          return;
        }
        this.currentOrder = order;
      },
      error: (error) => {
        console.log("error", error);
        this.router.navigate(['/']);
      }
    });
  }

  updateFoodAmount(food: Food, increment: boolean) {
    const selectedFood = this.selectedFoods.find(f => f.id === food.id);
    if (selectedFood) {
      if (increment) {
        selectedFood.amount++;
      } else if (selectedFood.amount > 0) {
        selectedFood.amount--;
      }
    }
  }

  getTotalPrice(): number {
    return this.selectedFoods.reduce((total, food) => {
      return  total + (food.price * food.amount);
    }, 0);
  }

  getSelectedFoods(): Food[] {
    return this.selectedFoods.filter(food => food.amount > 0);
  }

  continueToPayment() {
    if (this.currentOrder) {
      const updatedOrder: Order = {
        ...this.currentOrder,
        foods: this.getSelectedFoods(),
        price: this.getTotalPrice() +  this.currentOrder.price
      };
      
      this.orderService.saveLocalOrder(updatedOrder).subscribe({
        next: () => {
          this.router.navigate(['/payOrder', this.schedule?.id]);
        },
        error: (error) => {
          console.error('Error updating order:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    }
  }

  isDisabled(food: Food): boolean {
    const selected = this.selectedFoods.find(f => f.id === food.id);
    return !selected || selected.amount === 0;
  }

  getFoodAmount(food: Food): number {
    return this.selectedFoods.find(f => f.id === food.id)?.amount || 0;
  }

  getSubtotal(food: Food): string {
    return (food.price * food.amount).toFixed(2);
  }
}

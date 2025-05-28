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
    this.scheduleService.getScheduleById(scheduleId).subscribe(schedule => {
      if (schedule) {
        this.schedule = schedule;
      }
    });
  }

  private loadFoods() {
    this.foodService.getFoods().subscribe(foods => {
      this.foods = foods;
      this.selectedFoods = foods.map(food => ({...food}));
    });
  }

  private loadCurrentOrder() {
    this.orderService.getCurrentOrder().subscribe(order => {
      if (!order) {
        this.router.navigate(['/']);
        return;
      }
      this.currentOrder = order;
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
      return total + (parseFloat(food.price) * food.amount);
    }, 0);
  }

  getSelectedFoods(): Food[] {
    return this.selectedFoods.filter(food => food.amount > 0);
  }

  continueToPayment() {
    if (this.currentOrder) {
      const updatedOrder = {
        ...this.currentOrder,
        foods: this.getSelectedFoods(),
        totalPrice: this.getTotalPrice()
      };
      
      this.orderService.createOrder(updatedOrder).subscribe(() => {
        this.router.navigate(['/payOrder', this.schedule?.id]);
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
    return (parseFloat(food.price) * food.amount).toFixed(2);
  }
}

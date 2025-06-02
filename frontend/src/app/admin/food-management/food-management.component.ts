import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FoodService } from '../../services/food/food.service';
import { Food } from '../../services/food/food.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-food-management',
  template: `
    <div class="food-management">
      <h2>Gestión de Alimentos</h2>
      
      <button (click)="showAddForm()" class="add-button">Agregar Nuevo Alimento</button>

      <div *ngIf="showForm" class="food-form">
        <h3>{{ editingFood ? 'Editar' : 'Agregar' }} Alimento</h3>
        <form [formGroup]="foodForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nombre:</label>
            <input type="text" formControlName="name" required>
          </div>
          
          <div class="form-group">
            <label>URL de Imagen:</label>
            <input type="text" formControlName="image" required>
          </div>
          
          <div class="form-group">
            <label>Precio:</label>
            <input type="number" formControlName="price" required>
          </div>
          
          <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" formControlName="amount" required>
          </div>
          
          <div class="form-actions">
            <button type="submit" [disabled]="!foodForm.valid">Guardar</button>
            <button type="button" (click)="cancelEdit()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="food-list">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let food of foods">
              <td>{{ food.name }}</td>
              <td><img [src]="food.image" alt="{{ food.name }}" class="food-image"></td>
              <td>{{ food.price }}</td>
              <td>{{ food.amount }}</td>
              <td>
                <button (click)="editFood(food)">Editar</button>
                <button (click)="deleteFood(food.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .food-management {
      padding: 20px;
    }
    .add-button {
      margin-bottom: 20px;
      padding: 10px 20px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .food-form {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-actions {
      display: flex;
      gap: 10px;
    }
    .form-actions button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .form-actions button[type="submit"] {
      background-color: #3498db;
      color: white;
    }
    .form-actions button[type="button"] {
      background-color: #e74c3c;
      color: white;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .food-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
    button {
      margin-right: 5px;
    }
  `],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class FoodManagementComponent implements OnInit {
  foods: Food[] = [];
  foodForm: FormGroup;
  showForm = false;
  editingFood: Food | null = null;

  constructor(
    private foodService: FoodService,
    private fb: FormBuilder
  ) {
    this.foodForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      amount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadFoods();
  }

  loadFoods() {
    this.foodService.getFoods().subscribe(foods => {
      this.foods = foods;
    });
  }

  showAddForm() {
    this.editingFood = null;
    this.foodForm.reset();
    this.showForm = true;
  }

  editFood(food: Food) {
    this.editingFood = food;
    this.foodForm.patchValue(food);
    this.showForm = true;
  }

  cancelEdit() {
    this.showForm = false;
    this.editingFood = null;
    this.foodForm.reset();
  }

  onSubmit() {
    if (this.foodForm.valid) {
      const foodData = this.foodForm.value;
      
      if (this.editingFood) {
        this.foodService.updateFood(this.editingFood.id, foodData).subscribe(() => {
          this.loadFoods();
          this.cancelEdit();
        });
      } else {
        this.foodService.createFood(foodData).subscribe(() => {
          this.loadFoods();
          this.cancelEdit();
        });
      }
    }
  }

  deleteFood(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este alimento?')) {
      this.foodService.deleteFood(id).subscribe(() => {
        this.loadFoods();
      });
    }
  }
} 
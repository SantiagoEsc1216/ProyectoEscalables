import { Food } from "../food/food.interface";
import { Schedule } from "../schedule/schedule.interface";

export interface Order{
    id: string,
    user: string,
    schedule: Schedule,
    foods: Food[],
    seats: string[],
    price: number,
    date: Date
}
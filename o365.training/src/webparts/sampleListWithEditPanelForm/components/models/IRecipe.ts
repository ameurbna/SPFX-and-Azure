import {Ingredient} from './Ingredient';
export interface IRecipe {
    key: string;
    name: string;
    description: string;
    image:string;
    ingredients: Ingredient[];
  }
  
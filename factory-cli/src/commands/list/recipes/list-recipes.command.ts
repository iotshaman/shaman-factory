import { Recipe } from "../../../models/recipe";
import { RecipeService } from "../../../services/recipe.service";
import { IListCommand } from "../../command";

export class ListRecipesCommand implements IListCommand {
  get flag(): string { return '-recipes'; }
  private recipeService: RecipeService = new RecipeService();

  constructor() { }

  run = (): Promise<void> => {
    return this.recipeService.getAllRecipes()
      .then(recipes => this.logRecipesToConsole(recipes));

  }

  private logRecipesToConsole = (recipes: Recipe[]): void => {
    console.log(
      '\nAvailable recipes' +
      '\n-----------------'
    );
    recipes.forEach(r => {
      console.log(`${r.name}`);
    });
    console.log();
  }
}
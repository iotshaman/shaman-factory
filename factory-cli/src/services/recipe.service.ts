import * as _path from 'path';
import { Recipe } from "../models/recipe";
import { FileService, IFileService } from "./file.service";

export interface IRecipeService {
    getRecipe: (recipeName: string) => Promise<Recipe>;
}

export class RecipeService implements IRecipeService {

    fileService: IFileService = new FileService();
    recipeFolder: string[] = [__dirname, '..', '..', 'data', 'recipes'];

    getRecipe = (recipeName: string): Promise<Recipe> => {
        return this.getAllRecipes()
            .then(recipes => recipes.find(r => r.name == recipeName))
            .then(recipe => {
                if (!recipe) return Promise.reject(new Error(`Recipe not found: '${recipeName}'`));
                return recipe;
            });
    };

    getAllRecipes = (): Promise<Recipe[]> => {
        return this.fileService.readJson<{ recipes: Recipe[] }>(_path.join(...this.recipeFolder, 'recipes.json'))
            .then(recipes => recipes.recipes);
    }

}

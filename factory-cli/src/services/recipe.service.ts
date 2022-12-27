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
        let path = _path.join(...this.recipeFolder, `${recipeName}.json`);
        return this.fileService.pathExists(path)
            .then(rslt => { if (!rslt) return Promise.reject(new Error(`Recipe not found: '${recipeName}'`)); })
            .then(_ => this.fileService.readJson<{ recipe: Recipe }>(path))
            .then(recipe => recipe.recipe);
    };

}

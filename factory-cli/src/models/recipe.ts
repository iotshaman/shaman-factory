import { ProjectTransformation, SolutionProject } from "./solution";

export class Recipe {
    name: string;
    projects: SolutionProject[];
    transform?: ProjectTransformation[];
}
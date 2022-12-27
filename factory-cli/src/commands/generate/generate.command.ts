import { CommandLineArguments } from "../../command-line-arguments";
import { ProjectTransformation, Solution, SolutionProject } from "../../models/solution";
import { FileService, IFileService } from "../../services/file.service";
import { IRecipeService, RecipeService } from "../../services/recipe.service";
import { ICommand } from "../command";
import { ScaffoldCommand } from '../scaffold/scaffold.command';
import { GenerateArguments } from "./generate.arguments";
import { GenerateCommandPrompts, IGenerateCommandPrompts } from "./generate.command.prompts";

export class GenerateCommand implements ICommand {
    get name(): string { return "generate"; }
    fileService: IFileService = new FileService();
    recipeService: IRecipeService = new RecipeService();
    scaffoldCommand: ICommand = new ScaffoldCommand();
    prompts: IGenerateCommandPrompts = new GenerateCommandPrompts();

    private args: GenerateArguments;
    private defaultRecipeName: string;

    run = (cla: CommandLineArguments): Promise<void> => {
        this.args = new GenerateArguments(cla);
        this.defaultRecipeName = cla.getDefault('recipe');
        if (this.args.addFlag) return this.addProjectsToShamanFile();
        return this.generateNewShamanFile();
    };

    private addProjectsToShamanFile = (): Promise<void> => {
        let shamanFile: Solution;
        console.log("Adding projects to solution...")
        return this.fileService.getShamanFile(this.args.filePath)
            .then(file => { shamanFile = file })
            .then(_ => {
                if (!!this.args.template) return this.prompts.askForProjectDetails(this.args.template).then(p => [p]);
                return this.constructMultipleProjects();
            })
            .then(projects => { shamanFile.projects.push(...projects) })
            .then(_ => this.fileService.writeJson(this.args.filePath, shamanFile))
            .then(_ => this.scaffoldSolution())
            .then(_ => console.log("Projects successfully added to solution."));
    }

    private generateNewShamanFile = (): Promise<void> => {
        return this.fileService.pathExists(this.args.filePath)
            .then(exists => { if (exists) throw new Error(`shaman.json file already exists at '${this.args.filePath}'`); })
            .then(_ => {
                if (!this.args.solutionName) return this.prompts.askForSolutionName()
                    .then(name => this.args.solutionName = name)
            })
            .then(_ => {
                if (this.args.recipeName == this.defaultRecipeName && !this.args.template)
                    return this.prompts.askForGenerationMethod()
                        .then(rslt => {
                            if (rslt == 'recipe') return this.generateFromRecipe();
                            return this.generateFromTemplates();
                        });
                if (!!this.args.template) return this.generateFromTemplates();
                return this.generateFromRecipe();
            })
            .then(_ => this.scaffoldSolution())
            .then(_ => console.log("Solution generation is complete."));
    }

    private generateFromRecipe = (): Promise<void> => {
        return Promise.resolve()
            .then(_ => {
                if (this.args.recipeName == this.defaultRecipeName)
                    return this.prompts.askForRecipe()
                        .then(recipe => { if (!!recipe) this.args.recipeName = recipe })
            })
            .then(_ => this.recipeService.getRecipe(this.args.recipeName))
            .then(recipe => this.prompts.askToRenameRecipeProjects(recipe))
            .then(updatedRecipe => this.generateShamanFile(updatedRecipe.projects, updatedRecipe.transform))
    }

    private generateFromTemplates = (): Promise<void> => {
        return Promise.resolve()
            .then(_ => {
                if (!!this.args.template)
                    return this.prompts.askForProjectDetails(this.args.template).then(p => [p])
                return this.constructMultipleProjects()
            })
            .then(projects => this.generateShamanFile(projects))
    }

    private constructMultipleProjects = (projects?: SolutionProject[]): Promise<SolutionProject[]> => {
        if (!projects) projects = [];
        return this.prompts.askForTemplateName()
            .then(templateName => this.prompts.askForProjectDetails(templateName))
            .then(newProject => projects.push(newProject))
            .then(_ => this.prompts.askIfAddingAnotherProject())
            .then(addingAnother => { if (addingAnother) return this.constructMultipleProjects(projects); })
            .then(_ => projects);
    }

    private generateShamanFile = (projects: SolutionProject[], transformations?: ProjectTransformation[]): Promise<void> => {
        console.log('Generating shaman.json file...');
        let solution: Solution = {
            name: this.args.solutionName,
            projects: projects,
            transform: !!transformations ? transformations : []
        }
        return this.fileService.writeJson(this.args.filePath, solution)
            .then(_ => console.log('Successfully generated shaman.json file.'));
    }

    private scaffoldSolution = (): Promise<void> => {
        let scaffoldArguments = new CommandLineArguments(
            ['', '', 'scaffold', `--filePath=${this.args.filePath}`]
        );
        return this.scaffoldCommand.run(scaffoldArguments);
    }

}

import 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { createMock } from 'ts-auto-mock';
import { IFileService } from './file.service';
import { RecipeService } from './recipe.service';

describe('Recipe Service', () => {

    var sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(console, 'log');
    })

    afterEach(() => {
        sandbox.restore();
    });

    it('getRecipe should throw if recipe not found', (done) => {
        let subject = new RecipeService();
        subject.recipeFolder = [__dirname];
        subject.getAllRecipes = sandbox.stub().returns(Promise.resolve([]));
        subject.getRecipe('test-recipe')
            .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
            .catch((ex: Error) => {
                expect(ex.message).to.equal("Recipe not found: 'test-recipe'");
                done();
            });
    });

    it('getRecipe should return resolved promise', (done) => {
        let subject = new RecipeService();
        subject.getAllRecipes = sandbox.stub().returns(Promise.resolve([
            {
                name: 'test-recipe',
                projects: []
            }
        ]));
        subject.recipeFolder = [__dirname];
        subject.getRecipe('test-recipe').then(_ => done());
    });

    it('getAllRecipes should return resolved promise', (done) => {
        let subject = new RecipeService();
        let fileServiceMock = createMock<IFileService>();
        fileServiceMock.readJson = sandbox.stub().returns(Promise.resolve({ recipes: [] }));
        subject.fileService = fileServiceMock;
        subject.recipeFolder = [__dirname];
        subject.getAllRecipes().then(_ => done());
    });
});
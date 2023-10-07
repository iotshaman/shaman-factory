import 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { ListRecipesCommand } from './list-recipes.command';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../models/recipe';
import { createMock } from 'ts-auto-mock';

describe('ListRecipesCommand', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('flag', () => {
    it('should return "-recipes"', () => {
      const subject = new ListRecipesCommand();
      expect(subject.flag).to.equal('-recipes');
    });
  });

  describe('run', () => {
    it('should log the names of all recipes returned by the recipe service', (done) => {
      const mockRecipes: Recipe[] = [
        { name: 'recipe1', projects: [] },
        { name: 'recipe2', projects: [] }
      ];
      const mockRecipeService = createMock<RecipeService>();
      const getRecipesArrayMock = mockRecipeService.getAllRecipes = sandbox.stub().resolves(mockRecipes);
      const subject = new ListRecipesCommand();
      const logSpy = console.log as sinon.SinonSpy;
      subject['recipeService'] = mockRecipeService;
      subject.run()
        .then(_ => {
          expect(getRecipesArrayMock.calledOnce).to.be.true;
          expect(logSpy.callCount).to.equal(4);
          expect(logSpy.getCall(0).args[0]).to.equal('\nAvailable recipes\n-----------------');
          expect(logSpy.getCall(1).args[0]).to.equal('recipe1');
          expect(logSpy.getCall(2).args[0]).to.equal('recipe2');
          expect(logSpy.getCall(3).args[0]).to.equal(undefined);
          done();
        });
    });
  });
});
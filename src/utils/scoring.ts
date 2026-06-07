import { Recipe, AddedIngredient, ScoreResult } from '../types';

export function calculateScore(
  recipe: Recipe,
  addedIngredients: AddedIngredient[]
): ScoreResult {
  const requiredIds = recipe.ingredients.map((r) => r.ingredientId);
  const addedIds = addedIngredients.map((a) => a.id);

  let missingCount = 0;
  let extraCount = 0;
  let amountAccuracy = 0;
  let amountCount = 0;

  for (const req of recipe.ingredients) {
    const added = addedIngredients.find((a) => a.id === req.ingredientId);
    if (!added) {
      missingCount++;
    } else {
      const diff = Math.abs(added.amount - req.amount);
      const maxDiff = req.tolerance * 2;
      const ingredientAccuracy = Math.max(0, 1 - diff / maxDiff);
      amountAccuracy += ingredientAccuracy;
      amountCount++;
    }
  }

  for (const added of addedIngredients) {
    if (!requiredIds.includes(added.id)) {
      extraCount++;
    }
  }

  const baseIngredientScore = amountCount > 0 ? (amountAccuracy / amountCount) * 60 : 0;
  const missingPenalty = missingCount * 15;
  const extraPenalty = extraCount * 10;
  const finalIngredientScore = Math.max(0, baseIngredientScore - missingPenalty - extraPenalty);

  const completenessScore = amountCount === recipe.ingredients.length && extraCount === 0 ? 20 : 0;

  const totalRequired = requiredIds.length + extraCount;
  const matchedCount = amountCount;
  const overallAccuracy = totalRequired > 0 ? matchedCount / totalRequired : 0;

  const techniqueScore = 20;
  const score = Math.round(finalIngredientScore + completenessScore + techniqueScore);
  const maxScore = 100;
  const accuracy = Math.round(overallAccuracy * 100);

  return {
    score,
    maxScore,
    accuracy,
  };
}

export function canProceedToMix(recipe: Recipe, addedIngredients: AddedIngredient[]): boolean {
  for (const req of recipe.ingredients) {
    const added = addedIngredients.find((a) => a.id === req.ingredientId);
    if (!added) return false;
    if (Math.abs(added.amount - req.amount) > req.tolerance * 3) return false;
  }
  return true;
}

export function getIngredientStatus(
  ingredientId: string,
  recipe: Recipe,
  addedIngredients: AddedIngredient[]
): 'missing' | 'correct' | 'wrong' | 'extra' | undefined {
  const inRecipe = recipe.ingredients.find((r) => r.ingredientId === ingredientId);
  const added = addedIngredients.find((a) => a.id === ingredientId);

  if (inRecipe && !added) return 'missing';
  if (inRecipe && added) {
    const diff = Math.abs(added.amount - inRecipe.amount);
    return diff <= inRecipe.tolerance ? 'correct' : 'wrong';
  }
  if (!inRecipe && added) return 'extra';
  return undefined;
}

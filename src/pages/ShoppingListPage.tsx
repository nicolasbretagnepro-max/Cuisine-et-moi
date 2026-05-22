import type { Recipe, UserProgress } from '../types';
import { navigate } from '../App';
import { clearShoppingForRecipe, shoppingKey, toggleShoppingItem } from '../utils/storage';
import { formatIngredientQuantity } from '../utils/recipes';

interface Props {
  recipes: Recipe[];
  recipe?: Recipe;
  progress: UserProgress;
  onProgressChange: (progress: UserProgress) => void;
}

export default function ShoppingListPage({ recipes, recipe, progress, onProgressChange }: Props) {
  const selected = recipe ?? recipes[0];
  const checkedCount = selected.ingredients.filter((ingredient) => progress.shoppingChecked[shoppingKey(selected.id, ingredient.name)]).length;

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Liste de courses</h1>
        <p>Liste générée depuis la recette sélectionnée. Les cases cochées sont sauvegardées localement.</p>
      </header>

      <section className="card compact">
        <p className="eyebrow">Recette</p>
        <h2>{selected.title}</h2>
        <p>{selected.ingredients.length} ingrédient{selected.ingredients.length > 1 ? 's' : ''} · {checkedCount} coché{checkedCount > 1 ? 's' : ''}</p>
        <div className="button-row">
          <button className="secondary" type="button" onClick={() => navigate(`/recette/${selected.id}`)}>Voir la fiche</button>
          <button className="secondary" type="button" onClick={() => onProgressChange(clearShoppingForRecipe(progress, selected.id))}>Tout décocher</button>
        </div>
      </section>

      <section className="card">
        <h2>À acheter ou préparer</h2>
        <ul className="shopping-list">
          {selected.ingredients.map((ingredient) => {
            const key = shoppingKey(selected.id, ingredient.name);
            const isChecked = Boolean(progress.shoppingChecked[key]);
            return (
              <li key={key} className={isChecked ? 'checked' : ''}>
                <label>
                  <input type="checkbox" checked={isChecked} onChange={() => onProgressChange(toggleShoppingItem(progress, selected.id, ingredient.name))} />
                  <span>{ingredient.name}</span>
                </label>
                <strong>{formatIngredientQuantity(ingredient.quantity, ingredient.unit) || ingredient.note}</strong>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card compact">
        <h2>Changer de recette</h2>
        <div className="mini-recipe-list">
          {recipes.slice(0, 12).map((item) => (
            <button key={item.id} className={item.id === selected.id ? 'active secondary' : 'secondary'} type="button" onClick={() => navigate(`/courses/${item.id}`)}>
              {item.title}
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

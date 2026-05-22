import { useState } from 'react';
import type { Recipe, UserProgress } from '../types';
import { navigate } from '../App';
import { formatBudget, formatRecipeSeasons, skillLabel } from '../utils/recipes';
import { addRecipeJournalEntry, deleteRecipeJournalEntry, getRecipeAttempts, getRecipeJournal, isFavorite, isRecipeCompleted, toggleFavorite } from '../utils/storage';
import { fileToCompressedDataUrl } from '../utils/images';

interface Props {
  recipe?: Recipe;
  progress: UserProgress;
  onProgressChange: (progress: UserProgress) => void;
}

export default function RecipePage({ recipe, progress, onProgressChange }: Props) {
  const [comment, setComment] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [savingJournal, setSavingJournal] = useState(false);

  if (!recipe) {
    return <div className="card"><h1>Recette introuvable</h1><button onClick={() => navigate('/catalogue')}>Retour au catalogue</button></div>;
  }

  const currentRecipe = recipe;
  const completed = isRecipeCompleted(progress, currentRecipe.id);
  const favorite = isFavorite(progress, recipe.id);
  const attempts = getRecipeAttempts(progress, recipe.id);
  const journal = getRecipeJournal(progress, recipe.id);

  async function handlePhoto(file?: File) {
    if (!file) return;
    setPhotoError(null);
    try {
      const next = await fileToCompressedDataUrl(file);
      setPhotoDataUrl(next);
    } catch {
      setPhotoError('Impossible de lire cette image. Essaie avec une autre photo.');
    }
  }

  function saveJournalEntry() {
    if (!comment.trim() && !photoDataUrl) return;
    setSavingJournal(true);
    onProgressChange(addRecipeJournalEntry(progress, currentRecipe.id, comment.trim(), photoDataUrl));
    setComment('');
    setPhotoDataUrl(undefined);
    setSavingJournal(false);
  }

  return (
    <section className="page-stack">
      <button className="text-button left" type="button" onClick={() => navigate('/catalogue')}>← Catalogue</button>
      <article className="featured-card">
        <div className="card-topline">
          <span className="pill">{recipe.category}</span>
          <span className="muted">{recipe.cuisine}</span>
        </div>
        <h1>{recipe.title}</h1>
        <p>{recipe.description}</p>
        <div className="info-grid">
          <span>{recipe.durationMinutes} min</span>
          <span>Actif {recipe.activeTimeMinutes} min</span>
          <span>Niveau {recipe.level}/5</span>
          <span>{formatBudget(recipe.budget)}</span>
          <span>{formatRecipeSeasons(recipe)}</span>
        </div>
        <p><strong>Objectif :</strong> {skillLabel(recipe.mainSkill)}</p>
        <div className="tag-row">
          {recipe.season?.map((season) => <span key={season}>Saison : {formatRecipeSeasons({ season: [season] })}</span>)}
          {recipe.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="button-row wrap">
          <button type="button" onClick={() => navigate(`/cuisiner/${recipe.id}`)}>Lancer la recette</button>
          <button className="secondary" type="button" onClick={() => navigate(`/courses/${recipe.id}`)}>Courses</button>
          <button className="secondary" type="button" onClick={() => onProgressChange(toggleFavorite(progress, recipe.id))}>{favorite ? 'Retirer favori' : 'Ajouter favori'}</button>
        </div>
        {completed && <p className="success-note">Recette déjà réalisée {attempts.length} fois.</p>}
      </article>

      {recipe.whyBlocks?.length ? (
        <section className="card">
          <h2>Pourquoi cette recette fait progresser</h2>
          <p>Les points clés à comprendre avant de cuisiner.</p>
          <div className="learning-grid">
            {recipe.whyBlocks.map((block) => (
              <article className="learning-card" key={block.title}>
                <h3>{block.title}</h3>
                <p>{block.explanation}</p>
                {block.example && <small>{block.example}</small>}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {recipe.productCulture?.length ? (
        <section className="card">
          <h2>Culture produit</h2>
          <p>Repères pour mieux choisir, conserver et cuisiner les produits clés.</p>
          <div className="product-culture-list">
            {recipe.productCulture.map((item) => (
              <article className="product-culture-card" key={item.product}>
                <h3>{item.product}</h3>
                {item.choosing && <p><strong>Choisir :</strong> {item.choosing}</p>}
                {item.storage && <p><strong>Conserver :</strong> {item.storage}</p>}
                {item.seasonality && <p><strong>Saison :</strong> {item.seasonality}</p>}
                {item.technique && <p><strong>Technique :</strong> {item.technique}</p>}
                {item.pairing && <p><strong>Accords :</strong> {item.pairing}</p>}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="card">
        <h2>Ingrédients</h2>
        <ul className="clean-list">
          {recipe.ingredients.map((ingredient) => (
            <li key={`${ingredient.name}-${ingredient.unit ?? ''}`}>
              <span>{ingredient.name}</span>
              <strong>{ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit ?? ''}` : ingredient.note ?? ''}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Matériel</h2>
        <div className="tag-row">{recipe.equipment.map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <section className="card">
        <h2>Étapes</h2>
        <ol className="step-preview">
          {recipe.steps.map((step) => <li key={step.id}>{step.title}</li>)}
        </ol>
      </section>

      {(recipe.commonErrors?.length || recipe.variants?.length) && (
        <section className="card">
          {recipe.commonErrors?.length ? (
            <>
              <h2>Erreurs à surveiller</h2>
              <div className="tag-row">{recipe.commonErrors.map((item) => <span key={item}>{item}</span>)}</div>
            </>
          ) : null}
          {recipe.variants?.length ? (
            <>
              <h2>Variantes</h2>
              <div className="tag-row">{recipe.variants.map((item) => <span key={item}>{item}</span>)}</div>
            </>
          ) : null}
        </section>
      )}

      <section className="card form-card">
        <h2>Mon carnet sur cette recette</h2>
        <p>Ajoute une photo, un commentaire, une idée de variante ou un point à corriger la prochaine fois. Ces données restent dans ta progression locale.</p>
        <label>
          Commentaire personnel
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Ex. plus de citron, cuisson 3 min de moins, servir avec une salade..." />
        </label>
        <label>
          Ajouter une photo
          <input type="file" accept="image/*" onChange={(event) => handlePhoto(event.target.files?.[0])} />
        </label>
        {photoError && <p className="error-note">{photoError}</p>}
        {photoDataUrl && (
          <div className="photo-preview">
            <img src={photoDataUrl} alt="Aperçu de la photo ajoutée" />
            <button className="secondary" type="button" onClick={() => setPhotoDataUrl(undefined)}>Retirer la photo</button>
          </div>
        )}
        <button type="button" onClick={saveJournalEntry} disabled={savingJournal || (!comment.trim() && !photoDataUrl)}>Ajouter au carnet</button>
      </section>

      {(journal.length > 0 || attempts.length > 0) && (
        <section className="card">
          <h2>Historique personnel</h2>
          {journal.length > 0 && (
            <div className="photo-journal-grid">
              {journal.map((entry) => (
                <article className="journal-card" key={entry.id}>
                  {entry.photoDataUrl && <img src={entry.photoDataUrl} alt="Photo personnelle de la recette" />}
                  <strong>{new Date(entry.createdAt).toLocaleDateString('fr-FR')}</strong>
                  {entry.comment && <p>{entry.comment}</p>}
                  <button className="text-button left" type="button" onClick={() => onProgressChange(deleteRecipeJournalEntry(progress, recipe.id, entry.id))}>Supprimer</button>
                </article>
              ))}
            </div>
          )}
          {attempts.length > 0 && (
            <div className="history-list">
              {attempts.slice(0, 3).map((item) => (
                <div className="history-note" key={`${item.recipeId}-${item.completedAt}`}>
                  <strong>{new Date(item.completedAt).toLocaleDateString('fr-FR')} · note {item.rating ?? '-'} / 5</strong>
                  <span>Difficulté {item.difficultyFelt ?? '-'} / 5 · temps réel {item.realDurationMinutes ?? '-'} min</span>
                  {item.photoDataUrl && <img className="history-photo" src={item.photoDataUrl} alt="Photo du bilan de recette" />}
                  {item.notes && <p>{item.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <button className="secondary full-width" type="button" onClick={() => navigate(`/bilan/${recipe.id}`)}>
        Ajouter un bilan sans refaire la recette
      </button>
    </section>
  );
}

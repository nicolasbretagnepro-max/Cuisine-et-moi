import { useState } from 'react';
import type { Recipe, UserProgress } from '../types';
import { navigate } from '../App';
import { markRecipeCompleted } from '../utils/storage';
import { fileToCompressedDataUrl } from '../utils/images';

interface Props {
  recipe?: Recipe;
  progress: UserProgress;
  onProgressChange: (progress: UserProgress) => void;
}

export default function ReviewPage({ recipe, progress, onProgressChange }: Props) {
  const [rating, setRating] = useState(4);
  const [difficultyFelt, setDifficultyFelt] = useState(2);
  const [realDurationMinutes, setRealDurationMinutes] = useState(recipe?.durationMinutes ?? 30);
  const [wouldCookAgain, setWouldCookAgain] = useState(true);
  const [notes, setNotes] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [photoError, setPhotoError] = useState<string | null>(null);

  if (!recipe) {
    return <div className="card"><h1>Recette introuvable</h1><button onClick={() => navigate('/catalogue')}>Retour</button></div>;
  }

  const currentRecipe = recipe;

  async function handlePhoto(file?: File) {
    if (!file) return;
    setPhotoError(null);
    try {
      setPhotoDataUrl(await fileToCompressedDataUrl(file));
    } catch {
      setPhotoError('Impossible de lire cette image. Essaie avec une autre photo.');
    }
  }

  function saveReview() {
    onProgressChange(markRecipeCompleted(progress, currentRecipe, { rating, difficultyFelt, realDurationMinutes, wouldCookAgain, notes, photoDataUrl }));
    navigate('/progression');
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Bilan de recette</p>
        <h1>{currentRecipe.title}</h1>
        <p>Note ce qui s’est passé, ajoute une photo si tu veux, et conserve les observations utiles pour progresser.</p>
      </header>

      <section className="card form-card">
        <label>
          Note du résultat
          <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
            <option value={5}>5 — très réussi</option>
            <option value={4}>4 — bon résultat</option>
            <option value={3}>3 — correct</option>
            <option value={2}>2 — à retravailler</option>
            <option value={1}>1 — raté</option>
          </select>
        </label>

        <label>
          Difficulté ressentie
          <select value={difficultyFelt} onChange={(event) => setDifficultyFelt(Number(event.target.value))}>
            <option value={1}>1 — très facile</option>
            <option value={2}>2 — facile</option>
            <option value={3}>3 — moyen</option>
            <option value={4}>4 — difficile</option>
            <option value={5}>5 — trop difficile</option>
          </select>
        </label>

        <label>
          Temps réel en minutes
          <input type="number" min="1" value={realDurationMinutes} onChange={(event) => setRealDurationMinutes(Number(event.target.value))} />
        </label>

        <label>
          Notes personnelles
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex. sauce un peu trop acide, cuisson trop longue, très bon avec plus de citron..." />
        </label>

        <label>
          Photo du résultat
          <input type="file" accept="image/*" onChange={(event) => handlePhoto(event.target.files?.[0])} />
        </label>
        {photoError && <p className="error-note">{photoError}</p>}
        {photoDataUrl && (
          <div className="photo-preview">
            <img src={photoDataUrl} alt="Aperçu du résultat" />
            <button className="secondary" type="button" onClick={() => setPhotoDataUrl(undefined)}>Retirer la photo</button>
          </div>
        )}

        <label className="checkbox-line">
          <input type="checkbox" checked={wouldCookAgain} onChange={(event) => setWouldCookAgain(event.target.checked)} />
          J’ai envie de refaire cette recette
        </label>
      </section>

      <div className="button-column">
        <button type="button" onClick={saveReview}>Enregistrer le bilan</button>
        <button className="secondary" type="button" onClick={() => navigate(`/recette/${currentRecipe.id}`)}>Annuler</button>
      </div>
    </section>
  );
}

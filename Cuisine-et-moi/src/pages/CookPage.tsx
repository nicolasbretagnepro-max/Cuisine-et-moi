import { useEffect, useState } from 'react';
import type { Recipe } from '../types';
import { navigate } from '../App';
import ProgressBar from '../components/ProgressBar';

interface Props {
  recipe?: Recipe;
}

export default function CookPage({ recipe }: Props) {
  const [index, setIndex] = useState(0);
  const [showWhy, setShowWhy] = useState(false);
  const [showCue, setShowCue] = useState(false);
  const [showMistake, setShowMistake] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;
    const interval = window.setInterval(() => setRemainingSeconds((value) => value === null ? null : Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [remainingSeconds]);

  if (!recipe) {
    return <div className="card"><h1>Recette introuvable</h1><button onClick={() => navigate('/catalogue')}>Retour</button></div>;
  }

  const currentRecipe = recipe;
  const step = currentRecipe.steps[index];
  const isLast = index === currentRecipe.steps.length - 1;

  function resetStepState() {
    setShowWhy(false);
    setShowCue(false);
    setShowMistake(false);
    setRemainingSeconds(null);
  }

  function next() {
    resetStepState();
    if (isLast) {
      navigate(`/bilan/${currentRecipe.id}`);
      return;
    }
    setIndex(index + 1);
  }

  const remainingLabel = remainingSeconds === null
    ? ''
    : `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, '0')}`;

  return (
    <section className="cook-mode">
      <div className="cook-header">
        <button className="text-button left" type="button" onClick={() => navigate(`/recette/${currentRecipe.id}`)}>Quitter</button>
        <p>{index + 1} / {currentRecipe.steps.length}</p>
      </div>
      <ProgressBar current={index + 1} total={currentRecipe.steps.length} />

      <article className="cook-card">
        <p className="eyebrow">{currentRecipe.title}</p>
        <h1>{step.title}</h1>
        <p className="cook-action">{step.action}</p>
        {step.timerMinutes && (
          <div className="timer-box">
            <p>Repère temps : {step.timerMinutes} min</p>
            {remainingSeconds === null ? (
              <button className="secondary" type="button" onClick={() => setRemainingSeconds(step.timerMinutes ? step.timerMinutes * 60 : null)}>Lancer le minuteur</button>
            ) : (
              <strong>{remainingLabel}</strong>
            )}
          </div>
        )}
      </article>

      <div className="accordion-stack">
        {step.why && (
          <button className="accordion" type="button" onClick={() => setShowWhy(!showWhy)}>
            <strong>Pourquoi ?</strong>
            {showWhy && <span>{step.why}</span>}
          </button>
        )}
        {step.sensoryCue && (
          <button className="accordion" type="button" onClick={() => setShowCue(!showCue)}>
            <strong>Repère sensoriel</strong>
            {showCue && <span>{step.sensoryCue}</span>}
          </button>
        )}
        {step.commonMistake && (
          <button className="accordion" type="button" onClick={() => setShowMistake(!showMistake)}>
            <strong>Erreur fréquente</strong>
            {showMistake && <span>{step.commonMistake}</span>}
          </button>
        )}
      </div>

      <div className="cook-actions">
        <button className="secondary" type="button" onClick={() => { resetStepState(); setIndex(Math.max(0, index - 1)); }} disabled={index === 0}>Précédent</button>
        <button type="button" onClick={next}>{isLast ? 'Faire le bilan' : 'Suivant'}</button>
      </div>
    </section>
  );
}

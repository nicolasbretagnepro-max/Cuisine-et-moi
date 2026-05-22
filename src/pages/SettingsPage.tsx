import { useRef, useState } from 'react';
import type { UserProgress } from '../types';
import { exportProgress, importProgressFile, resetProgress } from '../utils/storage';

interface Props {
  progress: UserProgress;
  onProgressChange: (progress: UserProgress) => void;
}

export default function SettingsPage({ progress, onProgressChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState('');

  async function handleImport(file?: File) {
    if (!file) return;
    try {
      const imported = await importProgressFile(file);
      onProgressChange(imported);
      setMessage('Progression importée.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Import impossible.');
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Réglages</h1>
        <p>Gère les données locales de progression.</p>
      </header>

      <section className="card">
        <h2>Sauvegarde</h2>
        <p>La progression est stockée dans le navigateur. Exporte régulièrement un fichier JSON pour éviter toute perte.</p>
        <div className="button-column">
          <button type="button" onClick={() => exportProgress(progress)}>Exporter ma progression</button>
          <button className="secondary" type="button" onClick={() => inputRef.current?.click()}>Importer une progression</button>
          <input ref={inputRef} type="file" accept="application/json" hidden onChange={(event) => handleImport(event.target.files?.[0])} />
        </div>
      </section>

      <section className="card danger-zone">
        <h2>Réinitialisation</h2>
        <p>Cette action supprime les données locales de progression sur cet appareil.</p>
        <button className="danger" type="button" onClick={() => {
          if (window.confirm('Réinitialiser toute la progression locale ?')) {
            onProgressChange(resetProgress());
            setMessage('Progression réinitialisée.');
          }
        }}>Réinitialiser</button>
      </section>

      {message && <p className="success-note">{message}</p>}
    </section>
  );
}

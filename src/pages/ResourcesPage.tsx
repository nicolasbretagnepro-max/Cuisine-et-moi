import { useEffect, useState } from 'react';
import { navigate } from '../App';
import type { GlossaryEntry, KitchenError, ProductGuide } from '../types';
import { formatRecipeSeasons } from '../utils/recipes';

async function loadJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(path);
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export default function ResourcesPage() {
  const [tab, setTab] = useState<'glossary' | 'errors' | 'products'>('products');
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([]);
  const [errors, setErrors] = useState<KitchenError[]>([]);
  const [products, setProducts] = useState<ProductGuide[]>([]);

  useEffect(() => {
    loadJson<GlossaryEntry[]>('./data/glossary.json', []).then(setGlossary);
    loadJson<KitchenError[]>('./data/errors.json', []).then(setErrors);
    loadJson<ProductGuide[]>('./data/product-guides.json', []).then(setProducts);
  }, []);

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Ressources</h1>
        <p>Culture produit, définitions, erreurs fréquentes et réflexes utiles pendant les recettes.</p>
        <button className="secondary" type="button" onClick={() => navigate('/reglages')}>Réglages et sauvegarde</button>
      </header>

      <div className="filter-row" role="tablist">
        <button className={tab === 'products' ? 'active' : ''} type="button" onClick={() => setTab('products')}>Produits</button>
        <button className={tab === 'glossary' ? 'active' : ''} type="button" onClick={() => setTab('glossary')}>Glossaire</button>
        <button className={tab === 'errors' ? 'active' : ''} type="button" onClick={() => setTab('errors')}>Erreurs fréquentes</button>
      </div>

      {tab === 'products' && (
        <div className="card-list single">
          {products.map((product) => (
            <article className="card compact" key={product.id}>
              <div className="card-topline">
                <h2>{product.name}</h2>
                <span className="pill">{product.family}</span>
              </div>
              {product.seasons?.length ? <p><strong>Saison :</strong> {formatRecipeSeasons({ season: product.seasons })}</p> : null}
              <h3>Bien choisir</h3>
              <ul className="bullet-list">{product.howToChoose.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>Conserver</h3>
              <ul className="bullet-list">{product.howToStore.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>Techniques utiles</h3>
              <ul className="bullet-list">{product.techniques.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>Accords</h3>
              <div className="tag-row">{product.pairings.map((item) => <span key={item}>{item}</span>)}</div>
              <h3>Erreurs fréquentes</h3>
              <ul className="bullet-list">{product.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
          {products.length === 0 && <p>Aucune fiche produit disponible.</p>}
        </div>
      )}

      {tab === 'glossary' && (
        <div className="card-list single">
          {glossary.map((entry) => (
            <article className="card compact" key={entry.id}>
              <h2>{entry.term}</h2>
              <p>{entry.definition}</p>
              {entry.example && <p className="muted"><strong>Exemple :</strong> {entry.example}</p>}
            </article>
          ))}
          {glossary.length === 0 && <p>Aucun terme disponible.</p>}
        </div>
      )}

      {tab === 'errors' && (
        <div className="card-list single">
          {errors.map((item) => (
            <article className="card compact" key={item.id}>
              <h2>{item.title}</h2>
              <h3>Causes probables</h3>
              <ul className="bullet-list">{item.causes.map((cause) => <li key={cause}>{cause}</li>)}</ul>
              <h3>Solutions maintenant</h3>
              <ul className="bullet-list">{item.solutions.map((solution) => <li key={solution}>{solution}</li>)}</ul>
              <h3>Prévention</h3>
              <ul className="bullet-list">{item.prevention.map((tip) => <li key={tip}>{tip}</li>)}</ul>
            </article>
          ))}
          {errors.length === 0 && <p>Aucune fiche d’erreur disponible.</p>}
        </div>
      )}
    </section>
  );
}

import { navigate } from '../App';

interface Props {
  current: string;
}

const items = [
  { id: 'accueil', label: 'Accueil', path: '/accueil' },
  { id: 'plan', label: 'Plan', path: '/plan' },
  { id: 'catalogue', label: 'Catalogue', path: '/catalogue' },
  { id: 'courses', label: 'Courses', path: '/courses' },
  { id: 'progression', label: 'Progrès', path: '/progression' },
  { id: 'ressources', label: 'Plus', path: '/ressources' }
];

export default function BottomNav({ current }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {items.map((item) => (
        <button
          key={item.id}
          className={current === item.id ? 'active' : ''}
          onClick={() => navigate(item.path)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

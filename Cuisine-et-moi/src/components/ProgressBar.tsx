interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="progress-wrap" aria-label={`Progression ${current} sur ${total}`}>
      <div className="progress-bar" style={{ width: `${percent}%` }} />
    </div>
  );
}

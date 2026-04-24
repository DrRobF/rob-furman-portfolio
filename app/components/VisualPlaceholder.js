export default function VisualPlaceholder({
  title,
  subtitle,
  tag = 'Visual Placeholder',
  variant = 'default',
}) {
  return (
    <div className={`visual-placeholder ${variant}`} role="img" aria-label={title}>
      <span className="placeholder-tag">{tag}</span>
      <h3>{title}</h3>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

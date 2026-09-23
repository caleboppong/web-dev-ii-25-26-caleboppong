function QuickActionCard({ title, description, icon, href }) {
  return (
    <a className="quick-action-card" href={href}>
      <span className="quick-action-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <strong>Open →</strong>
    </a>
  );
}
export default QuickActionCard;

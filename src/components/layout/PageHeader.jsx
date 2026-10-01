export function PageHeader({ kicker, title }) {
  return (
    <div className="page-header">
      <span className="kicker section-kicker">{kicker}</span>
      <h1 className="page-title">{title}</h1>
    </div>
  );
}

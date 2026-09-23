function ServiceStatus({ lines, loading, error, onRefresh }) {
  return (
    <section className="status-section" id="status">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LIVE NETWORK STATUS</p>
          <h2>London service status</h2>
        </div>
        <button className="secondary-button" type="button" onClick={onRefresh} disabled={loading}>
          {loading ? "Updating..." : "Refresh status"}
        </button>
      </div>

      {error && <div className="error-card" role="alert">{error}</div>}

      {!error && (
        <div className="status-grid">
          {lines.map((line) => (
            <article className="status-card" key={line.id}>
              <div>
                <strong>{line.name}</strong>
                <span className={line.status === "Good Service" ? "status-good" : "status-alert"}>
                  {line.status}
                </span>
              </div>
              {line.reason && <p>{line.reason}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ServiceStatus;

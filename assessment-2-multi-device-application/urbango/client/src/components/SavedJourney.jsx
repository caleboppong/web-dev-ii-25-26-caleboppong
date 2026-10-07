function formatModes(modes = []) {
  const labels = {
    walking: "Walk",
    bus: "Bus",
    tube: "Tube",
    overground: "Overground",
    dlr: "DLR",
    "elizabeth-line": "Elizabeth line",
    "national-rail": "National Rail"
  };

  return modes
    .map((mode) => labels[mode] || mode)
    .join(" + ");
}

function SavedJourney({
  journey,
  onFavourite,
  onDelete,
  onOpenJourney
}) {
  const isPlannedJourney =
    journey.type === "Planned Journey" ||
    Boolean(journey.from && journey.to);

  const title = isPlannedJourney
    ? journey.nickname || `${journey.from} → ${journey.to}`
    : `Route ${journey.routeNumber}`;

  const modeText = formatModes(journey.modes);

  function handleOpenJourney() {
    if (onOpenJourney) {
      onOpenJourney(journey);
    }
  }

  return (
    <article
      className={`saved-journey ${
        journey.favourite ? "saved-journey-favourite" : ""
      }`}
    >
      <div className="saved-journey-content">
        <div className="saved-journey-heading">
          <span className="saved-journey-type">
            {isPlannedJourney
              ? "Saved journey"
              : "Saved bus route"}
          </span>

          {journey.favourite && (
            <span className="saved-favourite-badge">
              ★ Favourite
            </span>
          )}
        </div>

        <h3>{title}</h3>

        {journey.from &&
          journey.to &&
          title !== `${journey.from} → ${journey.to}` && (
            <p className="saved-journey-route">
              {journey.from} → {journey.to}
            </p>
          )}

        <div className="saved-journey-meta">
          {journey.duration && (
            <span>{journey.duration} min</span>
          )}

          {modeText && (
            <span>{modeText}</span>
          )}

          {!isPlannedJourney && journey.routeNumber && (
            <span>Bus {journey.routeNumber}</span>
          )}
        </div>
      </div>

      <div className="journey-actions saved-journey-actions">
        {isPlannedJourney && onOpenJourney && (
          <button
            type="button"
            className="saved-view-button"
            onClick={handleOpenJourney}
          >
            Plan again
          </button>
        )}

        <button
          type="button"
          className={`saved-favourite-button ${
            journey.favourite ? "is-favourite" : ""
          }`}
          onClick={() => onFavourite(journey)}
          aria-pressed={Boolean(journey.favourite)}
        >
          {journey.favourite
            ? "★ Favourite"
            : "☆ Favourite"}
        </button>

        <button
          type="button"
          className="saved-remove-button"
          onClick={() => onDelete(journey.id)}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default SavedJourney;
function SavedJourney({
  journey,
  onFavourite,
  onDelete
}) {
  return (
    <article className="saved-journey">
      <div>
        <h3>
          Route {journey.routeNumber}
        </h3>

        <p>
          {journey.from} → {journey.to}
        </p>

        {journey.nickname && (
          <span className="route-status">
            {journey.nickname}
          </span>
        )}
      </div>

      <div className="journey-actions">
        <button
          type="button"
          onClick={() =>
            onFavourite(journey)
          }
        >
          {journey.favourite
            ? "★ Favourite"
            : "☆ Favourite"}
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(journey.id)
          }
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default SavedJourney;
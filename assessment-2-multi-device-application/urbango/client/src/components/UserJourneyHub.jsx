function formatModes(modes) {
  if (!modes) {
    return "";
  }

  const modeList = Array.isArray(modes)
    ? modes
    : String(modes).split(",");

  const labels = {
    walking: "Walk",
    bus: "Bus",
    tube: "Tube",
    overground: "Overground",
    dlr: "DLR",
    "elizabeth-line": "Elizabeth line",
    "national-rail": "National Rail"
  };

  return modeList
    .map((mode) => {
      const cleanMode = String(mode).trim();

      return labels[cleanMode] || cleanMode;
    })
    .filter(Boolean)
    .join(" + ");
}

function getJourneyTitle(journey) {
  if (journey.nickname) {
    return journey.nickname;
  }

  if (journey.from && journey.to) {
    return `${journey.from} → ${journey.to}`;
  }

  if (journey.routeNumber) {
    return `Route ${journey.routeNumber}`;
  }

  return "Saved journey";
}

function UserJourneyHub({
  user,
  journeys = [],
  history = [],
  onFavourite,
  onDelete,
  onSignIn
}) {
  const favourites = journeys.filter(
    (journey) => journey.favourite
  );

  const savedJourneys = journeys;

  return (
    <section
      className="journey-hub"
      id="journeys"
    >
      <div className="journey-hub-intro">
        <p className="eyebrow">
          MY URBANGO
        </p>

        <h2>
          {user
            ? `${user.name.split(" ")[0]}'s journeys`
            : "Keep the journeys that matter"}
        </h2>

        <p>
          {user
            ? "Your saved journeys, favourites and recent journey plans are collected here."
            : "Sign in to create a personal travel space for saved, favourite and previous journeys."}
        </p>

        {!user && (
          <button
            className="primary-button light"
            type="button"
            onClick={onSignIn}
          >
            Sign in to UrbanGo
          </button>
        )}
      </div>

      <div className="journey-hub-content">
        <div className="hub-column saved-column">
          <div className="hub-title">
            <span>✓</span>

            <div>
              <small>YOUR JOURNEYS</small>
              <h3>Saved journeys</h3>
            </div>

            <b>
              {user ? savedJourneys.length : 0}
            </b>
          </div>

          {!user ? (
            <p className="hub-empty">
              Your saved journeys will appear after
              you sign in.
            </p>
          ) : savedJourneys.length === 0 ? (
            <p className="hub-empty">
              Save a journey from the Journey Planner
              and it will appear here.
            </p>
          ) : (
            <div className="hub-card-list">
              {savedJourneys.map((journey) => (
                <article
                  className="saved-hub-card"
                  key={journey.id}
                >
                  <div className="hub-card-top">
                    <span className="mode-chip">
                      {journey.type || "Journey"}
                    </span>

                    {journey.favourite && (
                      <span className="favourite-indicator">
                        ★
                      </span>
                    )}
                  </div>

                  <h4>
                    {getJourneyTitle(journey)}
                  </h4>

                  {journey.from && journey.to && (
                    <p className="hub-route">
                      {journey.from}
                      <span> → </span>
                      {journey.to}
                    </p>
                  )}

                  <div className="hub-journey-meta">
                    {journey.duration && (
                      <span>
                        {journey.duration} min
                      </span>
                    )}

                    {formatModes(journey.modes) && (
                      <span>
                        {formatModes(journey.modes)}
                      </span>
                    )}

                    {journey.routeNumber && (
                      <span>
                        Bus {journey.routeNumber}
                      </span>
                    )}
                  </div>

                  <div className="hub-card-actions">
                    <button
                      type="button"
                      className={`hub-favourite-button ${
                        journey.favourite
                          ? "is-favourite"
                          : ""
                      }`}
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
                      className="hub-remove-button"
                      onClick={() =>
                        onDelete(journey.id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="hub-column favourite-column">
          <div className="hub-title">
            <span>★</span>

            <div>
              <small>QUICK ACCESS</small>
              <h3>Favourites</h3>
            </div>

            <b>
              {user ? favourites.length : 0}
            </b>
          </div>

          {!user ? (
            <p className="hub-empty">
              Your favourites will appear after you
              sign in.
            </p>
          ) : favourites.length === 0 ? (
            <p className="hub-empty">
              Tap ☆ Favourite on a saved journey to
              pin it here.
            </p>
          ) : (
            <div className="hub-card-list">
              {favourites.map((journey) => (
                <article
                  className="favourite-card"
                  key={journey.id}
                >
                  <div className="hub-card-top">
                    <span className="mode-chip">
                      {journey.type || "Journey"}
                    </span>

                    <span className="favourite-indicator">
                      ★
                    </span>
                  </div>

                  <h4>
                    {getJourneyTitle(journey)}
                  </h4>

                  {journey.from && journey.to && (
                    <p className="hub-route">
                      {journey.from}
                      <span> → </span>
                      {journey.to}
                    </p>
                  )}

                  <div className="hub-journey-meta">
                    {journey.duration && (
                      <span>
                        {journey.duration} min
                      </span>
                    )}

                    {formatModes(journey.modes) && (
                      <span>
                        {formatModes(journey.modes)}
                      </span>
                    )}
                  </div>

                  <div className="hub-card-actions">
                    <button
                      type="button"
                      className="hub-favourite-button is-favourite"
                      onClick={() =>
                        onFavourite(journey)
                      }
                    >
                      ★ Favourited
                    </button>

                    <button
                      type="button"
                      className="hub-remove-button"
                      onClick={() =>
                        onDelete(journey.id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="hub-column history-column">
          <div className="hub-title">
            <span>↗</span>

            <div>
              <small>RECENT ACTIVITY</small>
              <h3>Previous journeys</h3>
            </div>

            <b>
              {user ? history.length : 0}
            </b>
          </div>

          {!user ? (
            <p className="hub-empty">
              Journey history is shown when you are
              signed in.
            </p>
          ) : history.length === 0 ? (
            <p className="hub-empty">
              Plan a journey and it will appear here
              for quick reference.
            </p>
          ) : (
            <div className="hub-card-list">
              {history
                .slice(0, 5)
                .map((journey) => (
                  <article
                    className="history-card"
                    key={journey.id}
                  >
                    <time>
                      {new Date(
                        journey.viewedAt
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short"
                        }
                      )}
                    </time>

                    <div className="history-card-content">
                      <h4>
                        {journey.from} →{" "}
                        {journey.to}
                      </h4>

                      <p>
                        {journey.duration
                          ? `${journey.duration} min`
                          : "London journey"}

                        {formatModes(
                          journey.modes
                        ) &&
                          ` · ${formatModes(
                            journey.modes
                          )}`}
                      </p>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserJourneyHub;
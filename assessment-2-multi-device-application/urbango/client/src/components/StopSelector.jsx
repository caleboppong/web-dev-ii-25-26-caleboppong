function StopSelector({
  routeNumber,
  stops,
  selectedStopId,
  onSelectStop,
  loading,
  error
}) {
  if (!routeNumber) {
    return null;
  }

  return (
    <section
      className="stop-selector"
      id="stop-selector"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            ROUTE {routeNumber}
          </p>

          <h2>Choose your stop</h2>
        </div>

        {!loading && (
          <span className="result-count">
            {stops.length} stops
          </span>
        )}
      </div>

      {loading && (
        <div className="loading-message">
          Loading route stops...
        </div>
      )}

      {error && (
        <div
          className="error-card"
          role="alert"
        >
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        stops.length > 0 && (
          <div className="stop-select-container">
            <label htmlFor="route-stop">
              Bus stop
            </label>

            <select
              id="route-stop"
              value={selectedStopId}
              onChange={(event) =>
                onSelectStop(event.target.value)
              }
            >
              <option value="">
                Select a stop
              </option>

              {stops.map((stop) => (
                <option
                  key={stop.id}
                  value={stop.id}
                >
                  {stop.name}
                  {stop.stopLetter
                    ? ` - Stop ${stop.stopLetter}`
                    : ""}
                </option>
              ))}
            </select>
          </div>
        )}
    </section>
  );
}

export default StopSelector;
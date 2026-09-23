import ArrivalCard from "./ArrivalCard";

function ArrivalBoard({
  routeNumber,
  stopName,
  arrivals,
  loading,
  error,
  onRefresh,
  onClose
}) {
  const routeArrivals = arrivals
    .filter(
      (arrival) =>
        String(arrival.routeNumber).toLowerCase() ===
        String(routeNumber).toLowerCase()
    )
    .slice(0, 8);

  return (
    <section className="arrival-board">
      <div className="arrival-board-header">
        <div>
          <p className="eyebrow">LIVE ARRIVALS</p>

          <h2>Route {routeNumber}</h2>

          <p>
            {stopName || "Selected bus stop"}
          </p>
        </div>

        <button
          className="close-arrivals"
          type="button"
          onClick={onClose}
          aria-label="Close live arrivals"
        >
          ×
        </button>
      </div>

      <div className="arrival-toolbar">
        <span>
          {routeArrivals.length} live predictions · Auto-refreshes every 30 seconds
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading && (
        <div className="loading-message">
          Getting live arrivals...
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
        routeArrivals.length === 0 && (
          <div className="message-card">
            No live Route {routeNumber} arrivals
            are currently available at this stop.
          </div>
        )}

      {!loading &&
        !error &&
        routeArrivals.length > 0 && (
          <div className="arrival-list">
            {routeArrivals.map(
              (arrival, index) => (
                <ArrivalCard
                  key={`${arrival.id}-${index}`}
                  arrival={arrival}
                />
              )
            )}
          </div>
        )}
    </section>
  );
}

export default ArrivalBoard;
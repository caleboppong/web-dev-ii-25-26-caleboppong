import RouteCard from "./RouteCard";
import StopSelector from "./StopSelector";
import ArrivalBoard from "./ArrivalBoard";

function RouteList({
  routes,
  loading,
  error,
  onSave,
  onViewArrivals,
  selectedRouteNumber,
  routeStops,
  selectedStopId,
  selectedStopName,
  stopsLoading,
  stopsError,
  arrivals,
  arrivalsLoading,
  arrivalsError,
  onSelectStop,
  onRefreshArrivals,
  onCloseArrivals
}) {
  const visibleRoutes = routes.slice(0, 30);

  return (
    <section className="routes-section" id="routes">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LIVE TFL BUS DATA</p>
          <h2>London bus routes</h2>
          <p>
            Search by route number or destination, then choose a route to load
            its real stops.
          </p>
        </div>

        <span className="result-count">
          {routes.length} results
        </span>
      </div>

      {loading && (
        <div className="loading-message">Loading London bus routes...</div>
      )}

      {error && (
        <div className="error-card" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && routes.length === 0 && (
        <div className="message-card">No matching routes were found.</div>
      )}

      {!loading && !error && visibleRoutes.length > 0 && (
        <>
          <div className="route-list">
            {visibleRoutes.map((route) => {
              const routeNumber = String(route.number);
              const isSelected =
                String(selectedRouteNumber) === routeNumber;

              return (
                <div
                  className={`route-result-group${isSelected ? " route-result-selected" : ""
                    }`}
                  key={route.id || routeNumber}
                >
                  <RouteCard
                    route={route}
                    onSave={onSave}
                    onViewArrivals={onViewArrivals}
                  />

                  {isSelected ? (
                    <div className="route-inline-details">
                      <StopSelector
                        routeNumber={routeNumber}
                        stops={routeStops}
                        selectedStopId={selectedStopId}
                        onSelectStop={onSelectStop}
                        loading={stopsLoading}
                        error={stopsError}
                      />

                      {selectedStopId ? (
                        <ArrivalBoard
                          routeNumber={routeNumber}
                          stopName={selectedStopName}
                          arrivals={arrivals}
                          loading={arrivalsLoading}
                          error={arrivalsError}
                          onRefresh={onRefreshArrivals}
                          onClose={onCloseArrivals}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {routes.length > visibleRoutes.length && (
            <p className="results-note">
              Showing the first {visibleRoutes.length} matches. Search to narrow
              the results.
            </p>
          )}
        </>
      )}
    </section>
  );
}

export default RouteList;

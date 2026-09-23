function RouteCard({
  route,
  onSave,
  onViewArrivals
}) {
  function handleLiveArrivals() {
    onViewArrivals(route.number);
  }

  function handleSave() {
    onSave(route);
  }

  return (
    <article className="route-card">
      <div className="route-number">
        {route.number}
      </div>

      <div className="route-information">
        <h3>
          {route.from === "London bus service" &&
          route.to === "London bus service"
            ? `London bus route ${route.number}`
            : `${route.from} → ${route.to}`}
        </h3>

        <p>{route.type}</p>

        <span className="route-status">
          {route.status}
        </span>
      </div>

      <div className="route-actions">
        <button
          type="button"
          onClick={handleLiveArrivals}
        >
          Live arrivals
        </button>

        <button
          type="button"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </article>
  );
}

export default RouteCard;
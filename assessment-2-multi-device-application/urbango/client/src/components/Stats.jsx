import StatCard from "./StatCard";

function Stats({ stats }) {
  const statisticItems = [
    {
      id: "routes",
      label: "Available routes",
      value: stats.availableRoutes
    },
    {
      id: "saved",
      label: "Saved journeys",
      value: stats.savedJourneys
    },
    {
      id: "favourites",
      label: "Favourite journeys",
      value: stats.favouriteJourneys
    }
  ];

  return (
    <section aria-label="Travel statistics">
      <div className="stats-grid">
        {statisticItems.map((item) => (
          <StatCard
            key={item.id}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </section>
  );
}

export default Stats;
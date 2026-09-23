import QuickActionCard from "./QuickActionCard";

function QuickActions() {
  const actions = [
    { id: 1, icon: "🧭", title: "Plan journey", description: "Request real London journey options.", href: "#planner" },
    { id: 2, icon: "🚌", title: "Live buses", description: "Search routes, stops and live arrivals.", href: "#routes" },
    { id: 3, icon: "⚡", title: "Service status", description: "Check current network service information.", href: "#status" },
    { id: 4, icon: "⭐", title: "Saved journeys", description: "Keep useful journeys for later.", href: "#journeys" }
  ];

  return (
    <section className="quick-actions">
      <div className="section-heading">
        <div><p className="eyebrow">TRAVEL TOOLS</p><h2>Travel in one place</h2></div>
      </div>
      <div className="quick-actions-grid">
        {actions.map((action) => <QuickActionCard key={action.id} {...action} />)}
      </div>
    </section>
  );
}

export default QuickActions;

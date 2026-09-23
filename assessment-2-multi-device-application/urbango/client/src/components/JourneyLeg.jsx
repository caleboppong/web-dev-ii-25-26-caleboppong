function formatTime(dateTime) {
  if (!dateTime) {
    return "";
  }

  return new Date(dateTime).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getModeLabel(mode) {
  const labels = {
    bus: "Bus",
    tube: "Tube",
    overground: "Overground",
    dlr: "DLR",
    "elizabeth-line": "Elizabeth line",
    walking: "Walk",
    "national-rail": "National Rail"
  };

  return labels[mode] || mode;
}

function JourneyLeg({ leg }) {
  return (
    <div className="journey-leg">
      <div className={`mode-icon mode-${leg.mode}`}>
        {getModeLabel(leg.mode)}
      </div>

      <div className="journey-leg-details">
        <div className="journey-leg-heading">
          <strong>{leg.line}</strong>

          <span>{leg.duration} min</span>
        </div>

        <div className="journey-leg-route">
          <div>
            <strong>
              {formatTime(leg.departureTime)}
            </strong>

            <span>{leg.departurePoint}</span>
          </div>

          <div className="journey-leg-line" />

          <div>
            <strong>
              {formatTime(leg.arrivalTime)}
            </strong>

            <span>{leg.arrivalPoint}</span>
          </div>
        </div>

        {leg.instruction && (
          <p className="journey-instruction">
            {leg.instruction}
          </p>
        )}
      </div>
    </div>
  );
}

export default JourneyLeg;
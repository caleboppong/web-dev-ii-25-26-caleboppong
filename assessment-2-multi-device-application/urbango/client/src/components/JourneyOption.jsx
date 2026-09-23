import { useState } from "react";
import JourneyLeg from "./JourneyLeg";

function formatTime(dateTime) {
    if (!dateTime) {
        return "";
    }

    return new Date(dateTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function JourneyOption({
    journey,
    index,
    fromName,
    toName,
    onSaveJourney
}) {
    const [expanded, setExpanded] = useState(index === 0);

    function handleSave() {
        onSaveJourney({
            type: "Planned Journey",
            from: fromName,
            to: toName,
            nickname: `${fromName} to ${toName}`,
            duration: journey.duration,
            modes: journey.modes,
            favourite: false
        });
    }

    return (
        <article className="journey-option">
            <div className="journey-option-header">
                <div>
                    <span className="journey-option-label">
                        {`Journey option ${index + 1}`}
                    </span>

                    <div className="journey-time-summary">
                        <strong>
                            {formatTime(journey.startDateTime)}
                        </strong>

                        <span>→</span>

                        <strong>
                            {formatTime(journey.arrivalDateTime)}
                        </strong>
                    </div>

                    <p>
                        {fromName} → {toName}
                    </p>
                </div>

                <div className="journey-duration">
                    <strong>{journey.duration}</strong>
                    <span>minutes</span>
                </div>
            </div>

            <div className="journey-summary-row">
                <span>
                    {journey.changes === 0
                        ? "0 changes"
                        : `${journey.changes} ${
                            journey.changes === 1
                                ? "change"
                                : "changes"
                        }`}
                </span>

                <span className="journey-modes">
                    {journey.modes
                        .map((mode) => {
                            const labels = {
                                walking: "Walk",
                                bus: "Bus",
                                tube: "Tube",
                                overground: "Overground",
                                dlr: "DLR",
                                "elizabeth-line": "Elizabeth line",
                                "national-rail": "National Rail"
                            };

                            return labels[mode] || mode;
                        })
                        .join(" + ")}
                </span>

                <button
                    type="button"
                    className="details-button"
                    onClick={() =>
                        setExpanded(
                            (currentValue) => !currentValue
                        )
                    }
                    aria-expanded={expanded}
                >
                    {expanded ? "Hide details" : "View details"}
                </button>

                <div className="journey-actions">
                    <a
                        className="journey-fare-button"
                        href="https://tfl.gov.uk/fares/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Tickets & fares
                        <span aria-hidden="true"> ↗</span>
                    </a>

                    <button
                        type="button"
                        className="save-journey-button"
                        onClick={handleSave}
                    >
                        Save journey
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="journey-legs">
                    {journey.legs.map((leg) => (
                        <JourneyLeg
                            key={leg.id}
                            leg={leg}
                        />
                    ))}
                </div>
            )}
        </article>
    );
}

export default JourneyOption;
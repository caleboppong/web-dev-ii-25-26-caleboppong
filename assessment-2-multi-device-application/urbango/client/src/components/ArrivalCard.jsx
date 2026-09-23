import { formatArrivalTime } from "../utils/formatArrivalTime";

function ArrivalCard({ arrival }) {
  return (
    <article className="arrival-card">
      <div className="arrival-route">
        {arrival.routeNumber}
      </div>

      <div className="arrival-information">
        <strong>
          {arrival.destination}
        </strong>

        <span>
          {arrival.stationName}
        </span>

        <small>
          Stop {arrival.platformName || "N/A"}
          {arrival.vehicleId
            ? ` • Bus ${arrival.vehicleId}`
            : ""}
        </small>
      </div>

      <div className="arrival-countdown">
        {formatArrivalTime(
          arrival.timeToStation
        )}
      </div>
    </article>
  );
}

export default ArrivalCard;
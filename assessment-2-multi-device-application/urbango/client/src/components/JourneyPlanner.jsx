import { useState } from "react";
import LocationSearch from "./LocationSearch";
import JourneyOption from "./JourneyOption";
import { planJourney } from "../services/urbanGoApi";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function JourneyPlanner({ onSaveJourney }) {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");

  const [fromLocation, setFromLocation] =
    useState(null);

  const [toLocation, setToLocation] =
    useState(null);

  const [timeOption, setTimeOption] =
    useState("now");

  const [journeyDate, setJourneyDate] =
    useState(getTodayDate());

  const [journeyTime, setJourneyTime] =
    useState("");

  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  function handleFromTextChange(value) {
    setFromText(value);
    setFromLocation(null);
  }

  function handleToTextChange(value) {
    setToText(value);
    setToLocation(null);
  }

  function handleFromSelect(location) {
    setFromLocation(location);
    setFromText(location.name);
  }

  function handleToSelect(location) {
    setToLocation(location);
    setToText(location.name);
  }

  function handleSwapLocations() {
    const previousFromText = fromText;
    const previousFromLocation = fromLocation;

    setFromText(toText);
    setFromLocation(toLocation);

    setToText(previousFromText);
    setToLocation(previousFromLocation);

    setJourneys([]);
    setErrorMessage("");
  }

  async function handlePlanJourney(event) {
    event.preventDefault();

    if (!fromLocation || !toLocation) {
      setErrorMessage(
        "Please select both locations from the suggestions."
      );
      setJourneys([]);
      return;
    }

    if (fromLocation.id === toLocation.id) {
      setErrorMessage(
        "Your starting point and destination must be different."
      );
      setJourneys([]);
      return;
    }

    if (
      timeOption !== "now" &&
      (!journeyDate || !journeyTime)
    ) {
      setErrorMessage(
        "Choose a date and time for your journey."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setJourneys([]);

    try {
      const data = await planJourney({
        from: `${fromLocation.latitude},${fromLocation.longitude}`,
        to: `${toLocation.latitude},${toLocation.longitude}`,
        date:
          timeOption === "now"
            ? ""
            : journeyDate,
        time:
          timeOption === "now"
            ? ""
            : journeyTime,
        timeIs:
          timeOption === "arriving"
            ? "arriving"
            : "departing"
      });

      const journeyOptions = data.journeys || [];

      if (journeyOptions.length === 0) {
        setErrorMessage(
          "No journey options were found for these locations."
        );
        return;
      }

      setJourneys(journeyOptions);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="journey-planner"
      id="planner"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            JOURNEY PLANNER
          </p>

          <h2>Plan your London journey</h2>

          <p>
            Search London transport locations and
            compare live journey options.
          </p>
        </div>
      </div>

      <form
        className="advanced-planner"
        onSubmit={handlePlanJourney}
      >
        <div className="planner-locations">
          <LocationSearch
            id="from-location"
            label="From"
            placeholder="Station, stop or location"
            value={fromText}
            onChange={handleFromTextChange}
            onSelect={handleFromSelect}
          />

          <button
            className="swap-button"
            type="button"
            onClick={handleSwapLocations}
            aria-label="Swap starting point and destination"
          >
            ⇅
          </button>

          <LocationSearch
            id="to-location"
            label="To"
            placeholder="Station, stop or location"
            value={toText}
            onChange={handleToTextChange}
            onSelect={handleToSelect}
          />
        </div>

        <div className="journey-time-options">
          <fieldset>
            <legend>When do you want to travel?</legend>

            <label>
              <input
                type="radio"
                name="journey-time-option"
                value="now"
                checked={timeOption === "now"}
                onChange={(event) =>
                  setTimeOption(event.target.value)
                }
              />

              Leave now
            </label>

            <label>
              <input
                type="radio"
                name="journey-time-option"
                value="departing"
                checked={
                  timeOption === "departing"
                }
                onChange={(event) =>
                  setTimeOption(event.target.value)
                }
              />

              Leave at
            </label>

            <label>
              <input
                type="radio"
                name="journey-time-option"
                value="arriving"
                checked={
                  timeOption === "arriving"
                }
                onChange={(event) =>
                  setTimeOption(event.target.value)
                }
              />

              Arrive by
            </label>
          </fieldset>

          {timeOption !== "now" && (
            <div className="date-time-fields">
              <div>
                <label htmlFor="journey-date">
                  Date
                </label>

                <input
                  id="journey-date"
                  type="date"
                  min={getTodayDate()}
                  value={journeyDate}
                  onChange={(event) =>
                    setJourneyDate(
                      event.target.value
                    )
                  }
                />
              </div>

              <div>
                <label htmlFor="journey-time">
                  Time
                </label>

                <input
                  id="journey-time"
                  type="time"
                  value={journeyTime}
                  onChange={(event) =>
                    setJourneyTime(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="planner-submit-row">
          <div>
            {fromLocation && (
              <span className="selected-location">
                From: {fromLocation.name}
              </span>
            )}

            {toLocation && (
              <span className="selected-location">
                To: {toLocation.name}
              </span>
            )}
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Planning journey..."
              : "Plan journey"}
          </button>
        </div>
      </form>

      {errorMessage && (
        <div
          className="message-card error-message"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {loading && (
        <div
          className="journey-loading"
          aria-live="polite"
        >
          <div className="loading-spinner" />

          <div>
            <strong>
              Finding your best journeys
            </strong>

            <p>
              Checking London transport options...
            </p>
          </div>
        </div>
      )}

      {journeys.length > 0 && (
        <div className="journey-results">
          <div className="journey-results-heading">
            <div>
              <p className="eyebrow">
                JOURNEY OPTIONS
              </p>

              <h3>
                {fromLocation?.name} →{" "}
                {toLocation?.name}
              </h3>
            </div>

            <span>
              {journeys.length}{" "}
              {journeys.length === 1
                ? "option"
                : "options"}
            </span>
          </div>

          {journeys.map((journey, index) => (
            <JourneyOption
              key={journey.id}
              journey={journey}
              index={index}
              fromName={fromLocation.name}
              toName={toLocation.name}
              onSaveJourney={onSaveJourney}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default JourneyPlanner;
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuickActions from "./components/QuickActions";
import JourneyPlanner from "./components/JourneyPlanner";
import RouteList from "./components/RouteList";
import ServiceStatus from "./components/ServiceStatus";
import SavedJourney from "./components/SavedJourney";
import Stats from "./components/Stats";
import TravelInformation from "./components/TravelInformation";
import AccommodationFinder from "./components/AccommodationFinder";

import {
  createSavedJourney,
  getRouteStops,
  getRoutes,
  getSavedJourneys,
  getServiceStatus,
  getStatistics,
  getStopArrivals,
  removeSavedJourney,
  updateJourneyFavourite
} from "./services/urbanGoApi";

import "./App.css";

function App() {
  const [routes, setRoutes] = useState([]);
  const [savedJourneys, setSavedJourneys] = useState([]);

  const [statistics, setStatistics] = useState({
    availableRoutes: 0,
    savedJourneys: 0,
    favouriteJourneys: 0
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearchedRoutes, setHasSearchedRoutes] =
    useState(false);

  const [routesLoading, setRoutesLoading] = useState(false);
  const [routesError, setRoutesError] = useState("");

  const [notice, setNotice] = useState("");

  const [selectedRouteNumber, setSelectedRouteNumber] =
    useState("");

  const [routeStops, setRouteStops] = useState([]);
  const [stopsLoading, setStopsLoading] = useState(false);
  const [stopsError, setStopsError] = useState("");

  const [selectedStopId, setSelectedStopId] = useState("");
  const [selectedStopName, setSelectedStopName] =
    useState("");

  const [liveArrivals, setLiveArrivals] = useState([]);
  const [arrivalsLoading, setArrivalsLoading] =
    useState(false);
  const [arrivalsError, setArrivalsError] = useState("");

  const [statusLines, setStatusLines] = useState([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState("");

  async function loadRoutes(search) {
    try {
      setRoutesLoading(true);
      setRoutesError("");

      const data = await getRoutes(search);

      setRoutes(data.routes || []);
    } catch (error) {
      setRoutes([]);
      setRoutesError(error.message);
    } finally {
      setRoutesLoading(false);
    }
  }

  async function loadSavedJourneys() {
    try {
      const data = await getSavedJourneys();

      setSavedJourneys(data.journeys || []);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function loadStatistics() {
    try {
      const data = await getStatistics();

      setStatistics((current) => ({
        ...current,
        ...data.stats
      }));
    } catch (error) {
      console.error(
        "Statistics error:",
        error.message
      );
    }
  }

  async function loadStatus() {
    try {
      setStatusLoading(true);
      setStatusError("");

      const data = await getServiceStatus();

      setStatusLines(data.lines || []);
    } catch (error) {
      setStatusLines([]);
      setStatusError(error.message);
    } finally {
      setStatusLoading(false);
    }
  }

  async function refreshJourneyData() {
    await Promise.all([
      loadSavedJourneys(),
      loadStatistics()
    ]);
  }

  async function loadRouteStops(routeNumber) {
    setSelectedRouteNumber(String(routeNumber));
    setRouteStops([]);
    setSelectedStopId("");
    setSelectedStopName("");
    setLiveArrivals([]);
    setStopsLoading(true);
    setStopsError("");
    setArrivalsError("");

    try {
      const data = await getRouteStops(routeNumber);

      setRouteStops(data.stops || []);
    } catch (error) {
      setRouteStops([]);
      setStopsError(error.message);
    } finally {
      setStopsLoading(false);
    }
  }

  async function loadStopArrivals(
    stopId,
    routeNumber
  ) {
    try {
      setArrivalsLoading(true);
      setArrivalsError("");

      const data = await getStopArrivals(stopId);

      const routeArrivals = (data.arrivals || []).filter(
        (arrival) =>
          String(arrival.routeNumber).toLowerCase() ===
          String(routeNumber).toLowerCase()
      );

      setLiveArrivals(routeArrivals);
    } catch (error) {
      setLiveArrivals([]);
      setArrivalsError(error.message);
    } finally {
      setArrivalsLoading(false);
    }
  }

  useEffect(() => {
    const initialLoad = setTimeout(() => {
      loadSavedJourneys();
      loadStatistics();
      loadStatus();
    }, 0);

    return () => {
      clearTimeout(initialLoad);
    };
  }, []);

  useEffect(() => {
    if (!selectedStopId || !selectedRouteNumber) {
      return undefined;
    }

    const refreshInterval = setInterval(() => {
      loadStopArrivals(
        selectedStopId,
        selectedRouteNumber
      );
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [selectedStopId, selectedRouteNumber]);

  function resetRouteDetails() {
    setSelectedRouteNumber("");
    setRouteStops([]);
    setSelectedStopId("");
    setSelectedStopName("");
    setLiveArrivals([]);
    setStopsError("");
    setArrivalsError("");
  }

  function handleRouteSearch() {
    const cleanSearchTerm = searchTerm.trim();

    resetRouteDetails();

    if (!cleanSearchTerm) {
      setRoutes([]);
      setRoutesError("");
      setHasSearchedRoutes(false);
      return;
    }

    setHasSearchedRoutes(true);
    loadRoutes(cleanSearchTerm);
  }

  async function handleSelectStop(stopId) {
    setSelectedStopId(stopId);

    if (!stopId) {
      setSelectedStopName("");
      setLiveArrivals([]);
      setArrivalsError("");
      return;
    }

    const selectedStop = routeStops.find(
      (stop) => stop.id === stopId
    );

    setSelectedStopName(
      selectedStop?.name || ""
    );

    await loadStopArrivals(
      stopId,
      selectedRouteNumber
    );
  }

  async function handleSaveJourney(journey) {
    try {
      const payload = journey.number
        ? {
            routeNumber: journey.number,
            from: journey.from,
            to: journey.to,
            nickname: `Route ${journey.number}`,
            type: journey.type || "Bus"
          }
        : journey;

      await createSavedJourney(payload);

      setNotice(
        `${
          payload.nickname || "Journey"
        } saved successfully.`
      );

      await refreshJourneyData();
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function handleFavouriteJourney(journey) {
    try {
      await updateJourneyFavourite(
        journey.id,
        !journey.favourite
      );

      await refreshJourneyData();
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function handleDeleteJourney(journeyId) {
    try {
      await removeSavedJourney(journeyId);

      setNotice("Journey removed.");

      await refreshJourneyData();
    } catch (error) {
      setNotice(error.message);
    }
  }

  function handleRefreshArrivals() {
    if (
      !selectedStopId ||
      !selectedRouteNumber
    ) {
      return;
    }

    loadStopArrivals(
      selectedStopId,
      selectedRouteNumber
    );
  }

  function handleCloseArrivals() {
    resetRouteDetails();
  }

  return (
    <>
      <div id="top" />

      <Header />

      <main>
        <Hero
          search={searchTerm}
          setSearch={setSearchTerm}
          onSearch={handleRouteSearch}
          resultCount={routes.length}
        />

        <div className="page-container">
          {hasSearchedRoutes && (
            <RouteList
              routes={routes}
              loading={routesLoading}
              error={routesError}
              onSave={handleSaveJourney}
              onViewArrivals={loadRouteStops}
              selectedRouteNumber={
                selectedRouteNumber
              }
              routeStops={routeStops}
              selectedStopId={selectedStopId}
              selectedStopName={selectedStopName}
              stopsLoading={stopsLoading}
              stopsError={stopsError}
              arrivals={liveArrivals}
              arrivalsLoading={arrivalsLoading}
              arrivalsError={arrivalsError}
              onSelectStop={handleSelectStop}
              onRefreshArrivals={
                handleRefreshArrivals
              }
              onCloseArrivals={
                handleCloseArrivals
              }
            />
          )}

          <Stats stats={statistics} />

          <QuickActions />

          <JourneyPlanner
            onSaveJourney={handleSaveJourney}
          />

          {notice && (
            <div
              className="notice"
              aria-live="polite"
            >
              {notice}
            </div>
          )}

          <ServiceStatus
            lines={statusLines}
            loading={statusLoading}
            error={statusError}
            onRefresh={loadStatus}
          />

          <section
            className="saved-section"
            id="journeys"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  YOUR TRAVEL
                </p>

                <h2>Saved journeys</h2>

                <p>
                  Saved journeys are stored on the
                  UrbanGo server and remain after a
                  restart.
                </p>
              </div>

              <span className="result-count">
                {savedJourneys.length} saved
              </span>
            </div>

            {savedJourneys.length === 0 ? (
              <div className="message-card">
                You haven't saved any journeys yet.
              </div>
            ) : (
              <div className="journey-list">
                {savedJourneys.map((journey) => (
                  <SavedJourney
                    key={journey.id}
                    journey={journey}
                    onFavourite={
                      handleFavouriteJourney
                    }
                    onDelete={
                      handleDeleteJourney
                    }
                  />
                ))}
              </div>
            )}
          </section>

          <TravelInformation />

          <AccommodationFinder />
        </div>
      </main>

      <footer>
        <div className="footer-container">
          <div>
            <strong>UrbanGo</strong>

            <p>
              Live travel. Simple journeys. One place.
            </p>
          </div>

          <span>
            Web Development II · Live TfL-powered
            travel application
          </span>
        </div>
      </footer>
    </>
  );
}

export default App;
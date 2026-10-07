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
import AuthModal from "./components/AuthModal";
import TransportStory from "./components/TransportStory";
import UserJourneyHub from "./components/UserJourneyHub";

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
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("urbango-session") || "null"));
  const [authOpen, setAuthOpen] = useState(false);
  const [journeyHistory, setJourneyHistory] = useState(() => {
    const session = JSON.parse(localStorage.getItem("urbango-session") || "null");
    return session ? JSON.parse(localStorage.getItem(`urbango-history-${session.email}`) || "[]") : [];
  });

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

  async function loadSavedJourneys(activeUser = user) {
    if (!activeUser) {
      setSavedJourneys([]);
      return;
    }
    try {
      const data = await getSavedJourneys(activeUser.email);

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

      if (!user) {
        setAuthOpen(true);
        setNotice("Sign in to save this journey to your UrbanGo account.");
        return;
      }
      await createSavedJourney({ ...payload, ownerEmail: user.email });

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

      <Header
        user={user}
        onSignIn={() => setAuthOpen(true)}
        onSignOut={() => {
          localStorage.removeItem("urbango-session");
          setUser(null);
          setSavedJourneys([]);
          setJourneyHistory([]);
          setNotice("You have signed out of UrbanGo.");
        }}
      />

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

          <Stats stats={{ ...statistics, savedJourneys: savedJourneys.length, favouriteJourneys: savedJourneys.filter((journey) => journey.favourite).length }} />

          <TransportStory />

          <QuickActions />

          <JourneyPlanner
            onSaveJourney={handleSaveJourney}
            onJourneyPlanned={(journey) => {
              if (!user) return;
              const nextHistory = [{ ...journey, id: Date.now(), viewedAt: new Date().toISOString() }, ...journeyHistory].slice(0, 12);
              setJourneyHistory(nextHistory);
              localStorage.setItem(`urbango-history-${user.email}`, JSON.stringify(nextHistory));
            }}
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

          <UserJourneyHub
            user={user}
            journeys={savedJourneys}
            history={journeyHistory}
            onFavourite={handleFavouriteJourney}
            onDelete={handleDeleteJourney}
            onSignIn={() => setAuthOpen(true)}
          />

          <TravelInformation />

          <AccommodationFinder />
        </div>
      </main>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={(account) => {
          localStorage.setItem("urbango-session", JSON.stringify(account));
          setUser(account);
          setAuthOpen(false);
          const history = JSON.parse(localStorage.getItem(`urbango-history-${account.email}`) || "[]");
          setJourneyHistory(history);
          loadSavedJourneys(account);
          setNotice(`Welcome ${account.name}. Your UrbanGo account is ready.`);
        }}
      />

      <footer>
        <div className="footer-container">
          <div>
            <strong>UrbanGo</strong>

            <p>
              Live travel. Simple journeys. One place.
            </p>
          </div>

          <span>
            C. Oppong Web Development II · Live TfL-powered
            travel application
          </span>
        </div>
      </footer>
    </>
  );
}

export default App;
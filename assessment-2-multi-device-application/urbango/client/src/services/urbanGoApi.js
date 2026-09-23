const API_BASE_URL = "http://localhost:5000/api";

async function requestUrbanGo(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
}

export function getRoutes(search = "") {
  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : "";

  return requestUrbanGo(
    `/transport/routes${query}`
  );
}

export function getRouteStops(routeNumber) {
  return requestUrbanGo(
    `/transport/line/${encodeURIComponent(
      routeNumber
    )}/stops`
  );
}

export function getStopArrivals(stopId) {
  return requestUrbanGo(
    `/transport/stop/${encodeURIComponent(
      stopId
    )}/arrivals`
  );
}

export function searchLocations(searchTerm) {
  return requestUrbanGo(
    `/transport/search?query=${encodeURIComponent(
      searchTerm
    )}`
  );
}

export function planJourney({
  from,
  to,
  date = "",
  time = "",
  timeIs = "departing"
}) {
  const queryParameters =
    new URLSearchParams({
      from,
      to,
      timeIs
    });

  if (date) {
    queryParameters.set("date", date);
  }

  if (time) {
    queryParameters.set("time", time);
  }

  return requestUrbanGo(
    `/transport/journey?${queryParameters.toString()}`
  );
}

export function getServiceStatus() {
  return requestUrbanGo(
    "/transport/status"
  );
}

export function getSavedJourneys() {
  return requestUrbanGo("/journeys");
}

export function getStatistics() {
  return requestUrbanGo("/stats");
}

export function createSavedJourney(journey) {
  return requestUrbanGo("/journeys", {
    method: "POST",
    body: JSON.stringify(journey)
  });
}

export function updateJourneyFavourite(
  journeyId,
  favourite
) {
  return requestUrbanGo(
    `/journeys/${journeyId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        favourite
      })
    }
  );
}

export function removeSavedJourney(
  journeyId
) {
  return requestUrbanGo(
    `/journeys/${journeyId}`,
    {
      method: "DELETE"
    }
  );
}
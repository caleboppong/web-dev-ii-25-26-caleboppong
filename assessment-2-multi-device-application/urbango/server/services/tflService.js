const TFL_BASE_URL = "https://api.tfl.gov.uk";

let busRoutesCache = {
  routes: [],
  expiresAt: 0
};

function buildTflUrl(endpoint, queryParameters = {}) {
  const url = new URL(`${TFL_BASE_URL}${endpoint}`);

  Object.entries(queryParameters).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        url.searchParams.set(key, value);
      }
    }
  );

  const apiKey = process.env.TFL_API_KEY;

  if (apiKey) {
    url.searchParams.set("app_key", apiKey);
  }

  return url;
}

async function requestTflData(
  endpoint,
  queryParameters = {}
) {
  const url = buildTflUrl(
    endpoint,
    queryParameters
  );

  const response = await fetch(url);

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `TfL request failed (${response.status}) at ${url.pathname}: ${responseText}`
    );
  }

  return response.json();
}

function formatArrivalPrediction(arrival) {
  return {
    id: arrival.id,
    routeNumber: arrival.lineName,
    destination: arrival.destinationName,
    stationName: arrival.stationName,
    platformName: arrival.platformName,
    vehicleId: arrival.vehicleId,
    timeToStation: arrival.timeToStation,
    expectedArrival: arrival.expectedArrival
  };
}

function formatStop(stop) {
  return {
    id: stop.id,
    name: stop.name,
    stopLetter:
      stop.stopLetter || stop.indicator || "",
    latitude: stop.lat,
    longitude: stop.lon
  };
}

function formatLocation(location) {
  return {
    id: location.id,
    name: location.name,
    latitude: location.lat,
    longitude: location.lon,
    modes: location.modes || [],
    zone: location.zone || ""
  };
}

function formatBusRoute(line) {
  const routeSection =
    line.routeSections?.[0];

  return {
    id: line.id,
    number: line.name || line.id,
    name: line.name || line.id,
    type: "Bus",
    modeName: line.modeName || "bus",
    from:
      routeSection?.originationName ||
      "London bus service",
    to:
      routeSection?.destinationName ||
      "London bus service"
  };
}

function formatJourneyLeg(leg, index) {
  const routeOption =
    leg.routeOptions?.[0];

  return {
    id: `${index}-${leg.departureTime || ""}`,
    mode:
      leg.mode?.id ||
      leg.mode?.name ||
      "travel",
    line:
      routeOption?.name ||
      leg.instruction?.summary ||
      leg.mode?.name ||
      "Travel",
    instruction:
      leg.instruction?.detailed ||
      leg.instruction?.summary ||
      "",
    departurePoint:
      leg.departurePoint?.commonName || "",
    arrivalPoint:
      leg.arrivalPoint?.commonName || "",
    departureTime: leg.departureTime,
    arrivalTime: leg.arrivalTime,
    duration: leg.duration || 0
  };
}

function formatJourney(journey, index) {
  const legs = (journey.legs || []).map(
    formatJourneyLeg
  );

  const publicTransportLegs = legs.filter(
    (leg) => leg.mode !== "walking"
  );

  return {
    id: `journey-${index}`,
    startDateTime: journey.startDateTime,
    arrivalDateTime: journey.arrivalDateTime,
    duration: journey.duration || 0,
    legs,
    changes: Math.max(
      publicTransportLegs.length - 1,
      0
    ),
    modes: [
      ...new Set(
        legs
          .map((leg) => leg.mode)
          .filter(Boolean)
      )
    ]
  };
}

function formatServiceStatus(line) {
  const lineStatus =
    line.lineStatuses?.[0];

  return {
    id: line.id,
    name: line.name,
    modeName: line.modeName,
    status:
      lineStatus?.statusSeverityDescription ||
      "Status unavailable",
    severity:
      lineStatus?.statusSeverity ?? null,
    reason: lineStatus?.reason || ""
  };
}

async function getBusRoutes(searchTerm = "") {
  const now = Date.now();

  if (
    busRoutesCache.routes.length === 0 ||
    now >= busRoutesCache.expiresAt
  ) {
    const lines = await requestTflData(
      "/Line/Mode/bus"
    );

    busRoutesCache = {
      routes: lines.map(formatBusRoute),
      expiresAt: now + 5 * 60 * 1000
    };
  }

  const cleanSearchTerm = searchTerm
    .toLowerCase()
    .trim();

  if (!cleanSearchTerm) {
    return [];
  }

  const exactRouteMatches =
    busRoutesCache.routes.filter(
      (route) =>
        route.number.toLowerCase() ===
        cleanSearchTerm
    );

  if (exactRouteMatches.length > 0) {
    return exactRouteMatches;
  }

  const matchingRoutes =
    busRoutesCache.routes.filter((route) => {
      const routeNumber =
        route.number.toLowerCase();

      const routeFrom =
        route.from.toLowerCase();

      const routeTo =
        route.to.toLowerCase();

      return (
        routeNumber.includes(
          cleanSearchTerm
        ) ||
        routeFrom.includes(
          cleanSearchTerm
        ) ||
        routeTo.includes(
          cleanSearchTerm
        )
      );
    });

  return matchingRoutes
    .sort((firstRoute, secondRoute) =>
      firstRoute.number.localeCompare(
        secondRoute.number,
        undefined,
        {
          numeric: true
        }
      )
    )
    .slice(0, 30);
}

async function getLineArrivals(routeNumber) {
  const arrivals = await requestTflData(
    `/Line/${encodeURIComponent(
      routeNumber
    )}/Arrivals`
  );

  return arrivals
    .map(formatArrivalPrediction)
    .sort(
      (firstArrival, secondArrival) =>
        firstArrival.timeToStation -
        secondArrival.timeToStation
    );
}

async function getLineStops(routeNumber) {
  const routeSequence =
    await requestTflData(
      `/Line/${encodeURIComponent(
        routeNumber
      )}/Route/Sequence/all`
    );

  const stopPoints =
    routeSequence.stopPointSequences?.flatMap(
      (sequence) =>
        sequence.stopPoint || []
    ) || [];

  const uniqueStops = new Map();

  stopPoints.forEach((stop) => {
    if (!uniqueStops.has(stop.id)) {
      uniqueStops.set(
        stop.id,
        formatStop(stop)
      );
    }
  });

  return Array.from(
    uniqueStops.values()
  );
}

async function getStopArrivals(stopId) {
  const arrivals = await requestTflData(
    `/StopPoint/${encodeURIComponent(
      stopId
    )}/Arrivals`
  );

  return arrivals
    .map(formatArrivalPrediction)
    .sort(
      (firstArrival, secondArrival) =>
        firstArrival.timeToStation -
        secondArrival.timeToStation
    );
}

async function searchLocations(searchTerm) {
  const cleanSearchTerm =
    searchTerm.trim();

  if (cleanSearchTerm.length < 2) {
    return [];
  }

  const searchResults =
    await requestTflData(
      `/StopPoint/Search/${encodeURIComponent(
        cleanSearchTerm
      )}`,
      {
        modes:
          "bus,tube,overground,dlr,elizabeth-line,national-rail",
        includeHubs: true
      }
    );

  return (searchResults.matches || [])
    .filter(
      (location) =>
        location.id &&
        location.name &&
        Number.isFinite(location.lat) &&
        Number.isFinite(location.lon)
    )
    .slice(0, 8)
    .map(formatLocation);
}

async function planJourney({
  from,
  to,
  date,
  time,
  timeIs = "departing"
}) {
  const queryParameters = {
    journeyPreference: "leasttime",
    timeIs
  };

  if (date) {
    queryParameters.date =
      date.replaceAll("-", "");
  }

  if (time) {
    queryParameters.time =
      time.replace(":", "");
  }

  const journeyData =
    await requestTflData(
      `/Journey/JourneyResults/${encodeURIComponent(
        from
      )}/to/${encodeURIComponent(to)}`,
      queryParameters
    );

  return (
    journeyData.journeys || []
  ).map(formatJourney);
}

async function getServiceStatus() {
  const modes = [
    "tube",
    "overground",
    "dlr",
    "elizabeth-line"
  ];

  const statusResponses =
    await Promise.all(
      modes.map((mode) =>
        requestTflData(
          `/Line/Mode/${encodeURIComponent(
            mode
          )}/Status`
        )
      )
    );

  const lines = statusResponses
    .flat()
    .map(formatServiceStatus);

  const uniqueLines = new Map();

  lines.forEach((line) => {
    if (!uniqueLines.has(line.id)) {
      uniqueLines.set(
        line.id,
        line
      );
    }
  });

  return Array.from(
    uniqueLines.values()
  ).sort((firstLine, secondLine) =>
    firstLine.name.localeCompare(
      secondLine.name
    )
  );
}

module.exports = {
  getBusRoutes,
  getLineArrivals,
  getLineStops,
  getStopArrivals,
  searchLocations,
  planJourney,
  getServiceStatus
};
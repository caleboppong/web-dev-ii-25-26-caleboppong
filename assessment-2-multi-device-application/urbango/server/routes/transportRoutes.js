const express = require("express");

const {
  getBusRoutes,
  getLineArrivals,
  getLineStops,
  getStopArrivals,
  searchLocations,
  planJourney,
  getServiceStatus
} = require("../services/tflService");

const router = express.Router();

router.get("/routes", async (req, res) => {
  try {
    const searchTerm =
      req.query.search || "";

    const routes = await getBusRoutes(
      searchTerm
    );

    return res.status(200).json({
      success: true,
      count: routes.length,
      routes
    });
  } catch (error) {
    console.error(
      "TfL bus route error:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message:
        "London bus routes are temporarily unavailable."
    });
  }
});

router.get("/search", async (req, res) => {
  const searchTerm =
    req.query.query?.trim();

  if (
    !searchTerm ||
    searchTerm.length < 2
  ) {
    return res.status(200).json({
      success: true,
      locations: []
    });
  }

  try {
    const locations =
      await searchLocations(searchTerm);

    return res.status(200).json({
      success: true,
      count: locations.length,
      locations
    });
  } catch (error) {
    console.error(
      "TfL location search error:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message:
        "Location search is temporarily unavailable."
    });
  }
});

router.get("/journey", async (req, res) => {
  const {
    from,
    to,
    date,
    time,
    timeIs = "departing"
  } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message:
        "Choose both a starting point and destination."
    });
  }

  try {
    const journeys = await planJourney({
      from,
      to,
      date,
      time,
      timeIs
    });

    return res.status(200).json({
      success: true,
      count: journeys.length,
      journeys
    });
  } catch (error) {
    console.error(
      "TfL journey planning error:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message:
        "Journey planning is temporarily unavailable. Please try again."
    });
  }
});

router.get("/status", async (req, res) => {
  try {
    const lines =
      await getServiceStatus();

    return res.status(200).json({
      success: true,
      count: lines.length,
      lines
    });
  } catch (error) {
    console.error(
      "TfL service status error:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message:
        "London service status is temporarily unavailable."
    });
  }
});

router.get(
  "/line/:routeNumber/arrivals",
  async (req, res) => {
    const { routeNumber } = req.params;

    try {
      const arrivals =
        await getLineArrivals(
          routeNumber
        );

      return res.status(200).json({
        success: true,
        routeNumber,
        count: arrivals.length,
        arrivals
      });
    } catch (error) {
      console.error(
        "TfL arrival error:",
        error.message
      );

      return res.status(502).json({
        success: false,
        message:
          "Live transport information is temporarily unavailable."
      });
    }
  }
);

router.get(
  "/line/:routeNumber/stops",
  async (req, res) => {
    const { routeNumber } = req.params;

    try {
      const stops =
        await getLineStops(routeNumber);

      return res.status(200).json({
        success: true,
        routeNumber,
        count: stops.length,
        stops
      });
    } catch (error) {
      console.error(
        "TfL stop error:",
        error.message
      );

      return res.status(502).json({
        success: false,
        message:
          "Route stops are temporarily unavailable."
      });
    }
  }
);

router.get(
  "/stop/:stopId/arrivals",
  async (req, res) => {
    const { stopId } = req.params;

    try {
      const arrivals =
        await getStopArrivals(stopId);

      return res.status(200).json({
        success: true,
        stopId,
        count: arrivals.length,
        arrivals
      });
    } catch (error) {
      console.error(
        "TfL stop arrival error:",
        error.message
      );

      return res.status(502).json({
        success: false,
        message:
          "Live arrivals for this stop are temporarily unavailable."
      });
    }
  }
);

module.exports = router;
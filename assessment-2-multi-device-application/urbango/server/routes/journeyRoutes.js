const express = require("express");
const { readJourneys, writeJourneys } = require("../services/journeyStore");

const router = express.Router();

router.get("/", (req, res) => {
  const journeys = readJourneys();
  res.status(200).json({ success: true, count: journeys.length, journeys });
});

router.post("/", (req, res) => {
  const { routeNumber, from, to, nickname, type = "Bus" } = req.body;

  if (!from?.trim() || !to?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Starting point and destination are required."
    });
  }

  const journeys = readJourneys();
  const newJourney = {
    id: Date.now(),
    routeNumber: routeNumber?.trim() || "Journey",
    from: from.trim(),
    to: to.trim(),
    nickname: nickname?.trim() || `${from.trim()} to ${to.trim()}`,
    type,
    favourite: false,
    savedAt: new Date().toISOString()
  };

  journeys.push(newJourney);
  writeJourneys(journeys);

  res.status(201).json({
    success: true,
    message: "Journey saved successfully.",
    journey: newJourney
  });
});

router.patch("/:id", (req, res) => {
  const journeys = readJourneys();
  const journey = journeys.find((item) => item.id === Number(req.params.id));

  if (!journey) {
    return res.status(404).json({ success: false, message: "Saved journey not found." });
  }

  if (typeof req.body.favourite === "boolean") {
    journey.favourite = req.body.favourite;
  }

  if (typeof req.body.nickname === "string" && req.body.nickname.trim()) {
    journey.nickname = req.body.nickname.trim();
  }

  writeJourneys(journeys);
  res.status(200).json({ success: true, message: "Journey updated successfully.", journey });
});

router.delete("/:id", (req, res) => {
  const journeys = readJourneys();
  const journeyIndex = journeys.findIndex((item) => item.id === Number(req.params.id));

  if (journeyIndex === -1) {
    return res.status(404).json({ success: false, message: "Saved journey not found." });
  }

  const [journey] = journeys.splice(journeyIndex, 1);
  writeJourneys(journeys);
  res.status(200).json({ success: true, message: "Journey deleted successfully.", journey });
});

module.exports = router;

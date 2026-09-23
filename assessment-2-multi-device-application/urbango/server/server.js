require("dotenv").config();

const express = require("express");
const cors = require("cors");
const journeyRoutes = require("./routes/journeyRoutes");
const transportRoutes = require("./routes/transportRoutes");
const { readJourneys } = require("./services/journeyStore");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({ success: true, name: "UrbanGo API", version: "3.0" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, status: "online", service: "UrbanGo API" });
});

app.use("/api/transport", transportRoutes);
app.use("/api/journeys", journeyRoutes);

app.get("/api/stats", (req, res) => {
  const journeys = readJourneys();
  res.status(200).json({
    success: true,
    stats: {
      savedJourneys: journeys.length,
      favouriteJourneys: journeys.filter((journey) => journey.favourite).length
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "UrbanGo API route not found." });
});

app.listen(PORT, () => {
  console.log(`UrbanGo server running on http://localhost:${PORT}`);
});

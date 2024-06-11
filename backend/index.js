// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const favouritesModel = require("./models/favouritesModel");

const app = express();
app.use(express.json()); // to parse JSON bodies
app.use(
  cors({
    origin: ["https://weather-app-delta-lac-75.vercel.app/"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(
    "mongodb+srv://IsaacNjenga:cations!@cluster0.xf14h71.mongodb.net/weatherApp"
  )
  .then(() => console.log("database connected"))
  .catch((err) => console.log("Error", err));

const API_KEY = "b882f0719ba7e08e90a827d174b54f6a";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Endpoint to fetch weather data
app.get("/weather", async (req, res) => {
  const { lat, lon, units } = req.query;
  const apiUrl = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await axios.get(apiUrl, {
      withCredentials: true,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather:", error);
    res
      .status(error.response.status || 500)
      .json({ error: "Failed to fetch weather data" });
  }
});

// Endpoint to fetch forecast data
app.get("/forecast", async (req, res) => {
  const { lat, lon, units } = req.query;
  const apiUrl = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await axios.get(apiUrl, {
      withCredentials: true,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching forecast:", error);
    res
      .status(error.response.status || 500)
      .json({ error: "Failed to fetch forecast data" });
  }
});

// Endpoint to fetch weather data by city name
app.get("/cityweather", async (req, res) => {
  const { name, units } = req.query;
  const apiUrl = `${API_BASE_URL}/weather?q=${name}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await axios.get(apiUrl, {
      withCredentials: true,
    });
    res.json(response.data);
    console.log(name, units);
  } catch (error) {
    console.error("Error fetching weather:", error);
    res
      .status(error.response.status || 500)
      .json({ error: "Failed to fetch weather data" });
  }
});

// Endpoint to fetch forecast data by city name
app.get("/cityforecast", async (req, res) => {
  const { name, units } = req.query;
  const apiUrl = `${API_BASE_URL}/forecast?q=${name}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await axios.get(apiUrl, {
      withCredentials: true,
    });
    res.json(response.data);
    console.log(name, units);
  } catch (error) {
    console.error("Error fetching forecast:", error);
    res
      .status(error.response.status || 500)
      .json({ error: "Failed to fetch forecast data" });
  }
});

app.get("/favourites/:userId", (req, res) => {
  const { userId } = req.params;
  favouritesModel
    .find({ userId })
    .then((favourites) => {
      res.json(favourites);
    })
    .catch((error) => {
      res.json({ message: "Error", error });
    });
});

app.post("/addFavourite", (req, res) => {
  const { userId, name } = req.body;
  const newFavourite = new favouritesModel({ userId, name });
  newFavourite
    .save()
    .then((favourite) => {
      res.json(favourite);
    })
    .catch((error) => {
      res.json({ message: "Error", error });
    });
});

app.delete("/removeFavourite/:id", (req, res) => {
  const id = req.params.id;
  favouritesModel
    .findByIdAndDelete({ _id: id })
    .then((favourites) => {
      res.json(favourites);
    })
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log("Connected");
});

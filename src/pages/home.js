import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import WeatherIcon from "../weatherIcon.js";
import { useNavigate } from "react-router-dom";

function Home({ weatherMain }) {
  const [loading, setLoading] = useState(false);
  let [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [data, setData] = useState({
    celcius: "",
    name: "",
    humidity: "",
    speed: "",
    image: null,
    description: "",
    country: "",
    tempMax: "",
    tempMin: "",
    feelsLike: "",
    sunrise: "",
    sunset: "",
  });
  const [data2, setData2] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [favourites, setFavourites] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [todaysData, setTodaysData] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  /*const formattedDate = currentDateTime.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });*/

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const getWeatherDisplay = (weatherMain) => {
    switch (weatherMain) {
      case "Clear":
        return "clear";
      case "Clouds":
        return "clouds";
      case "Rain":
        return "rain";
      case "Drizzle":
      case "Mist":
        return (
          <i className="material-icons" style={{ fontSize: "90px" }}>
            cloud
          </i>
        );
      default:
        return "default";
    }
  };

  const getForecastDisplay = (forecastMain) => {
    return <WeatherIcon weatherMain={forecastMain} />;
  };

  //data
  const fetchWeatherData = async (lat, long) => {
    try {
      setLoading(true);
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;
      const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;

      const [response, response2] = await Promise.all([
        axios.get(apiUrl),
        axios.get(apiUrl2),
      ]);

      const weatherMain = response.data.weather[0].main;
      const forecastWeather = response2.data.list.slice(0, 40);
      const weatherDisplay = getWeatherDisplay(weatherMain);

      const todayDate = new Date().toISOString().split("T")[0];

      const processedForecastData = forecastWeather
        .map((forecast) => {
          const dateString = forecast.dt_txt;
          const forecastDate = new Date(dateString).toISOString().split("T")[0];
          const formattedDateString = new Date(dateString).toLocaleDateString(
            "en-GB",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            }
          );

          const formattedTimeString = new Date(dateString).toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          );

          const forecastWeatherMain = forecast.weather[0].main;
          const forecastWeatherDisplay =
            getForecastDisplay(forecastWeatherMain);

          const description =
            forecast.weather[0].description.charAt(0).toUpperCase() +
            forecast.weather[0].description.slice(1).toLowerCase();

          if (forecastDate === todayDate) {
            return {
              celcius: forecast.main.temp,
              name: response2.data.city.name,
              humidity: forecast.main.humidity,
              speed: forecast.wind.speed,
              image: forecastWeatherDisplay,
              description: description,
              country: response2.data.city.country,
              date: formattedDateString,
              time: formattedTimeString,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);

      const processedForecastData2 = forecastWeather
        .map((forecast) => {
          const dateString = forecast.dt_txt;
          const forecastDate = new Date(dateString).toISOString().split("T")[0];
          const formattedDateString = new Date(dateString).toLocaleDateString(
            "en-GB",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            }
          );

          const formattedTimeString = new Date(dateString).toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          );

          const forecastWeatherMain = forecast.weather[0].main;
          const forecastWeatherDisplay =
            getForecastDisplay(forecastWeatherMain);

          const description =
            forecast.weather[0].description.charAt(0).toUpperCase() +
            forecast.weather[0].description.slice(1).toLowerCase();

          if (forecastDate !== todayDate) {
            return {
              celcius: forecast.main.temp,
              name: response2.data.city.name,
              humidity: forecast.main.humidity,
              speed: forecast.wind.speed,
              image: forecastWeatherDisplay,
              description: description,
              country: response2.data.city.country,
              date: formattedDateString,
              time: formattedTimeString,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);

      setTodaysData(processedForecastData);
      setData2(processedForecastData2);

      const sunrise = new Date(
        response.data.sys.sunrise * 1000
      ).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const sunset = new Date(
        response.data.sys.sunset * 1000
      ).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      const description =
        response.data.weather[0].description.charAt(0).toUpperCase() +
        response.data.weather[0].description.slice(1).toLowerCase();

      setData({
        celcius: response.data.main.temp,
        name: response.data.name,
        humidity: response.data.main.humidity,
        speed: response.data.wind.speed,
        image: weatherDisplay,
        description: description,
        country: response.data.sys.country,
        tempMax: response.data.main.temp_max,
        tempMin: response.data.main.temp_min,
        feelsLike: response.data.main.feels_like,
        sunrise: sunrise,
        sunset: sunset,
      });
      setLoading(false);
      setError("");
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        setError("City not found. Please try again.");
      } else {
        setError("Failed to fetch weather data.");
      }
      console.error("Error fetching weather data:", error);
    }
  };

  const handleClick = () => {
    if (name !== "") {
      setLoading(true);
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;
      const apiForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;

      Promise.all([axios.get(apiUrl), axios.get(apiForecast)])
        .then(([currentWeatherResponse, forecastWeatherResponse]) => {
          const currentResponse = currentWeatherResponse.data;
          const weatherMain = currentResponse.weather[0].main;
          const weatherDisplay = getWeatherDisplay(weatherMain);

          const sunrise = new Date(
            currentResponse.sys.sunrise * 1000
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const sunset = new Date(
            currentResponse.sys.sunset * 1000
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const description =
            currentResponse.weather[0].description.charAt(0).toUpperCase() +
            currentResponse.weather[0].description.slice(1).toLowerCase();

          setData({
            celcius: currentResponse.main.temp,
            name: currentResponse.name,
            humidity: currentResponse.main.humidity,
            speed: currentResponse.wind.speed,
            image: weatherDisplay,
            description: description,
            country: currentResponse.sys.country,
            tempMax: currentResponse.main.temp_max,
            tempMin: currentResponse.main.temp_min,
            feelsLike: currentResponse.main.feels_like,
            sunrise: sunrise,
            sunset: sunset,
          });

          const word =
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
          if (!loading) {
            toast.success(word);
          }

          const todayDate = new Date().toISOString().split("T")[0];

          const forecastData = forecastWeatherResponse.data.list.slice(0, 40);

          const processedForecastData = forecastData
            .map((forecast) => {
              const dateString = forecast.dt_txt;
              const forecastDate = new Date(dateString)
                .toISOString()
                .split("T")[0];
              const convertToDate = new Date(dateString);
              const options = {
                year: "numeric",
                month: "short",
                day: "numeric",
                weekday: "short",
              };

              const optionsTime = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              };
              let formattedDateString = new Intl.DateTimeFormat(
                "en-GB",
                options
              ).format(convertToDate);
              const formattedTimeString = new Intl.DateTimeFormat(
                "en-GB",
                optionsTime
              ).format(convertToDate);

              const forecastWeatherMain = forecast.weather[0].main;
              const forecastWeatherDisplay =
                getForecastDisplay(forecastWeatherMain);

              const description =
                forecast.weather[0].description.charAt(0).toUpperCase() +
                forecast.weather[0].description.slice(1).toLowerCase();

              if (forecastDate === todayDate) {
                return {
                  celcius: forecast.main.temp,
                  name: forecastWeatherResponse.data.city.name,
                  humidity: forecast.main.humidity,
                  speed: forecast.wind.speed,
                  image: forecastWeatherDisplay,
                  description: description,
                  country: forecastWeatherResponse.data.city.country,
                  date: formattedDateString,
                  time: formattedTimeString,
                };
              } else {
                return null;
              }
            })
            .filter(Boolean);

          const processedForecastData2 = forecastData
            .map((forecast) => {
              const dateString = forecast.dt_txt;
              const forecastDate = new Date(dateString)
                .toISOString()
                .split("T")[0];
              const convertToDate = new Date(dateString);
              const options = {
                year: "numeric",
                month: "short",
                day: "numeric",
                weekday: "short",
              };

              const optionsTime = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              };
              let formattedDateString = new Intl.DateTimeFormat(
                "en-GB",
                options
              ).format(convertToDate);
              const formattedTimeString = new Intl.DateTimeFormat(
                "en-GB",
                optionsTime
              ).format(convertToDate);

              const forecastWeatherMain = forecast.weather[0].main;
              const forecastWeatherDisplay =
                getForecastDisplay(forecastWeatherMain);

              const description =
                forecast.weather[0].description.charAt(0).toUpperCase() +
                forecast.weather[0].description.slice(1).toLowerCase();

              if (forecastDate !== todayDate) {
                return {
                  celcius: forecast.main.temp,
                  name: forecastWeatherResponse.data.city.name,
                  humidity: forecast.main.humidity,
                  speed: forecast.wind.speed,
                  image: forecastWeatherDisplay,
                  description: description,
                  country: forecastWeatherResponse.data.city.country,
                  date: formattedDateString,
                  time: formattedTimeString,
                };
              } else {
                return null;
              }
            })
            .filter(Boolean);

          setTodaysData(processedForecastData);
          setData2(processedForecastData2);
          setLoading(false);
          setError("");
        })
        .catch((error) => {
          setLoading(false);
          if (error.response && error.response.status === 404) {
            setError("City not found. Please try again.");
          } else {
            setError("Failed to fetch weather data.");
          }
          console.error("Error fetching weather data:", error);
        });
    }
  };

  const addToFavourites = (name) => {
    setFavourites((prevFavourites) => {
      const updatedFavourites = [...prevFavourites, name];
      return updatedFavourites;
    });
    setIsFavourite(true);
    toast.success(`Added '${name}' to favourites`);
  };

  const removeFromFavourites = (name) => {
    setFavourites((prevFavourites) => {
      const updatedFavourites = prevFavourites.filter((fav) => fav !== name);
      return updatedFavourites;
    });
    setIsFavourite(false);
    console.log(isFavourite)
    toast.error(`Removed '${name}' from favourites`);
  };

  const toggleFavourite = (name) => {
    if (favourites.includes(name)) {
      removeFromFavourites(name);
    } else {
      addToFavourites(name);
    }
  };

  const navigate = useNavigate();
  const viewFavourites = () => {
    navigate("/favourites", { state: { favourites: favourites } });
  };
  return (
    <div className="container2">
      <div className="weather">
        <div
          className={getWeatherDisplay(weatherMain)}
          style={{ borderRadius: "35px", padding: "20px" }}
        >
          <p>{formattedTime}</p>
          <div className="search">
            <input
              type="text"
              placeholder="Enter City name"
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleClick}>
              <i className="material-icons">search</i>
            </button>
          </div>
          <div className="error">
            <p>{error}</p>
          </div>
          {!error && (
            <div className="winfo">
              <div className="weather-info">
                <div className="description">
                  <h3>{data.description}</h3>
                </div>
                <h1>
                  <span className="current">{Math.round(data.celcius)}°C</span>
                </h1>
                <div className="temperature">
                  <p>
                    <span className="high">
                      High: {Math.round(data.tempMax)}°C/
                    </span>
                    {""}
                    <span className="low">
                      Low: {Math.round(data.tempMin)}°C
                    </span>
                  </p>
                </div>
              </div>
              <h4>
                <span style={{ display: "inline-block" }}>
                  {data.name}, {data.country}
                </span>
                <button
                  className="favourites"
                  onClick={() => toggleFavourite(data.name)}
                >
                  {favourites.includes(data.name) ? (
                    <i
                      className="fa-solid fa-heart"
                      style={{ color: "red", fontSize: "25px" }}
                    ></i>
                  ) : (
                    <i
                      className="fa-regular fa-heart"
                      style={{ color: "white", fontSize: "25px" }}
                    ></i>
                  )}
                </button>
              </h4>
              <button onClick={viewFavourites}>View Favourites</button>

              <div className="forecast-container">
                {todaysData.map((forecast, index) => {
                  return (
                    <div className="mini-weather">
                      <div className="forecasted">
                        <div key={index}>
                          <p>{forecast.time}</p>
                          <p>{forecast.image}</p>
                          <p>{forecast.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <hr />
              {/* Forecast */}
              <div className="forecast-container2">
                {data2.map((forecast, index) => (
                  <div className="mini-weather2">
                    <div className="forecasted2">
                      <div key={index}>
                        <p>{forecast.time}</p>
                        <p>{forecast.image}</p>
                        <p>{forecast.description}</p>
                        <p>{forecast.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              <div className="details">
                <div className="col-humidity">
                  <h3>Comfort Level</h3>
                  <i className="material-icons comfort-icon">water_drop</i>
                  <div className="humidity">
                    <p className="humidity-value">{data.humidity}%</p>
                    <p>Humidity</p>
                    <p>Feels like: {Math.round(data.feelsLike)}°C</p>
                  </div>
                </div>
                <div className="col-wind">
                  <h3>Wind</h3>
                  <i className="material-icons wind-icon">air</i>
                  <div className="wind">
                    <p className="wind-speed">{Math.round(data.speed)} Km/h</p>
                    <p>Wind Speed</p>
                  </div>
                </div>
                <div className="col-sunrise-sunset">
                  <h3>Sunrise & Sunset</h3>
                  <i className="fas fa-sun sun-icon"></i>
                  <div className="sunrise-sunset">
                    <p>Sunrise: {data.sunrise}</p>
                    <p>Sunset: {data.sunset}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="loader">
            <div className="loader__circle"></div>
            <div className="loader__circle"></div>
            <div className="loader__circle"></div>
            <div className="loader__circle"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

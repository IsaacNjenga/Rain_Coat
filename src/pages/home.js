import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import WeatherIcon from "../weatherIcon.js";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";

function Home({ weatherMain }) {
  const [loading, setLoading] = useState(false);
  let [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [todaysData, setTodaysData] = useState([]);
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [dataKey, setDataKey] = useState("Temperature");
  const navigate = useNavigate();
  const [bgClass, setBgClass] = useState("");

  //Getting the user's Location with permision ofc
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

  //Proceeding to fetch the data from the API if granted permission
  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location]);

  //Making sure that the time and date is being refreshed
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const currentDayTime = () => {
    let dayTime = new Date();
    const currentDate = dayTime.toISOString().slice(0, 10);
    const currentTime = dayTime.toTimeString().slice(0, 8);
    return `${currentDate} ${currentTime}`;
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 18) {
      setBgClass("morning-bg");
    } else {
      setBgClass("night-bg");
    }
  }, []);

  //Data from the API being processed
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
      const weatherDescription = response.data.weather[0].main.description;
      const forecastWeather = response2.data.list.slice(0, 40);

      const timeDay = currentDayTime();
      const getDayOrNight = (timeDay) => {
        const time = new Date(timeDay);
        const hours = time.getHours();
        return hours >= 6 && hours < 18 ? "day" : "night";
      };
      const timeOfDay = getDayOrNight(timeDay);

      const today = new Date();
      const todayDate = new Date().toISOString().split("T")[0];

      const tomorrowDate = (() => {
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
      })();

      //forecasted data for the day
      const processedForecastData = forecastWeather
        .map((forecast) => {
          const getDayOrNight = (dateString) => {
            const time = new Date(dateString);
            const hours = time.getHours();
            return hours >= 6 && hours < 18 ? "day" : "night";
          };

          const dateString = forecast.dt_txt;
          const forecastDate = new Date(dateString).toISOString().split("T")[0];
          const timeOfDay = getDayOrNight(dateString);

          let formattedDateString = new Date(dateString).toLocaleDateString(
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

          const description =
            forecast.weather[0].description.charAt(0).toUpperCase() +
            forecast.weather[0].description.slice(1).toLowerCase();

          const weatherMain = forecast.weather[0].main;
          const weatherDescription = forecast.weather[0].main.description;

          if (forecastDate === todayDate) {
            return {
              celcius: forecast.main.temp,
              name: response2.data.city.name,
              humidity: forecast.main.humidity,
              speed: forecast.wind.speed,
              image: (
                <WeatherIcon
                  weatherMain={weatherMain}
                  weatherDescription={weatherDescription}
                  timeOfDay={timeOfDay}
                />
              ),
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

      const groupedData = forecastWeather.reduce((acc, forecast) => {
        if (forecast.dt_txt) {
          // Ensure dt_txt exists
          const dateString = forecast.dt_txt.split(" ")[0];
          if (!acc[dateString]) {
            acc[dateString] = [];
          }
          acc[dateString].push(forecast);
        }
        return acc;
      }, {});

      const processedForecastData2 = Object.keys(groupedData).map((date) => {
        const dateString = "2024-06-04 12:00:00";
        const getDayOrNight = (dateString) => {
          const time = new Date(dateString);
          const hours = time.getHours();
          return hours >= 6 && hours < 18 ? "day" : "night";
        };
        const timeOfDay = getDayOrNight(dateString);
        const dayForecasts = groupedData[date];
        console.log(dayForecasts);
        const total = dayForecasts.reduce(
          (acc, forecast) => {
            acc.temp += forecast.main.temp;
            acc.wind += forecast.wind.speed;
            acc.humidity += forecast.main.humidity;
            return acc;
          },
          { temp: 0, wind: 0, humidity: 0 }
        );

        const averageTemp = total.temp / dayForecasts.length;
        const averageHumidity = total.humidity / dayForecasts.length;
        const averageWind = total.wind / dayForecasts.length;

        let formattedDateString = "";
        if (date === todayDate) {
          formattedDateString = "Today";
        } else if (date === tomorrowDate) {
          formattedDateString = "Tomorrow";
        } else {
          formattedDateString = new Date(date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          });
        }

        const description =
          dayForecasts[0].weather[0].description.charAt(0).toUpperCase() +
          dayForecasts[0].weather[0].description.slice(1).toLowerCase();

        const weatherMain = dayForecasts[0].weather[0].main;
        const weatherDescription = dayForecasts[0].weather[0].description;

        return {
          day: formattedDateString,
          image: (
            <WeatherIcon
              weatherMain={weatherMain}
              weatherDescription={weatherDescription}
              timeOfDay={timeOfDay}
            />
          ),
          averageTemp: averageTemp.toFixed(1),
          averageWind: averageWind.toFixed(1),
          averageHumidity: averageHumidity.toFixed(1),
          description: description,
        };
      });

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
        image: (
          <WeatherIcon
            weatherMain={weatherMain}
            weatherDescription={weatherDescription}
            timeOfDay={timeOfDay}
          />
        ),
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

  //Adjusting the UI according to the user's search input
  const handleClick = () => {
    if (name !== "") {
      setLoading(true);
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;
      const apiForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;

      Promise.all([axios.get(apiUrl), axios.get(apiForecast)])
        .then(([currentWeatherResponse, forecastWeatherResponse]) => {
          const currentResponse = currentWeatherResponse.data;
          const weatherMain = currentResponse.weather[0].main;
          const weatherDescription =
            currentResponse.weather[0].main.description;

          const timeDay = currentDayTime();
          const getDayOrNight = (timeDay) => {
            const time = new Date(timeDay);
            const hours = time.getHours();
            return hours >= 6 && hours < 18 ? "day" : "night";
          };
          const timeOfDay = getDayOrNight(timeDay);

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
            image: (
              <WeatherIcon
                weatherMain={weatherMain}
                weatherDescription={weatherDescription}
                timeOfDay={timeOfDay}
              />
            ),
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

          const today = new Date();
          const todayDate = new Date().toISOString().split("T")[0];

          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);
          const tomorrowDate = tomorrow.toISOString().split("T")[0];

          const forecastData = forecastWeatherResponse.data.list.slice(0, 40);

          //forecasted data for the day
          const processedForecastData = forecastData
            .map((forecast) => {
              const getDayOrNight = (dateString) => {
                const time = new Date(dateString);
                const hours = time.getHours();
                return hours >= 6 && hours < 18 ? "day" : "night";
              };
              const dateString = forecast.dt_txt;
              const timeOfDay = getDayOrNight(dateString);
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

              const description =
                forecast.weather[0].description.charAt(0).toUpperCase() +
                forecast.weather[0].description.slice(1).toLowerCase();

              const weatherMain = forecast.weather[0].main;
              const weatherDescription = forecast.weather[0].main.description;

              if (forecastDate === todayDate) {
                return {
                  celcius: forecast.main.temp,
                  name: forecastWeatherResponse.data.city.name,
                  humidity: forecast.main.humidity,
                  speed: forecast.wind.speed,
                  image: (
                    <WeatherIcon
                      weatherMain={weatherMain}
                      weatherDescription={weatherDescription}
                      timeOfDay={timeOfDay}
                    />
                  ),
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

          //forecasted data for the week
          const groupedData = forecastData.reduce((acc, forecast) => {
            if (forecast.dt_txt) {
              // Ensure dt_txt exists
              const dateString = forecast.dt_txt.split(" ")[0];
              if (!acc[dateString]) {
                acc[dateString] = [];
              }
              acc[dateString].push(forecast);
            }
            return acc;
          }, {});

          const processedForecastData2 = Object.keys(groupedData).map(
            (date) => {
              const dateString = "2024-06-04 12:00:00";
              const getDayOrNight = (dateString) => {
                const time = new Date(dateString);
                const hours = time.getHours();
                return hours >= 6 && hours < 18 ? "day" : "night";
              };
              const timeOfDay = getDayOrNight(dateString);
              const dayForecasts = groupedData[date];
              const total = dayForecasts.reduce(
                (acc, forecast) => {
                  acc.temp += forecast.main.temp;
                  acc.wind += forecast.wind.speed;
                  acc.humidity += forecast.main.humidity;
                  return acc;
                },
                { temp: 0, wind: 0, humidity: 0 }
              );

              // Compute average temperature
              const averageTemp = total.temp / dayForecasts.length;
              const averageHumidity = total.humidity / dayForecasts.length;
              const averageWind = total.wind / dayForecasts.length;

              // Format the date
              let formattedDateString = "";
              if (date === todayDate) {
                formattedDateString = "Today";
              } else if (date === tomorrowDate) {
                formattedDateString = "Tomorrow";
              } else {
                formattedDateString = new Date(date).toLocaleDateString(
                  "en-US",
                  {
                    month: "2-digit",
                    day: "2-digit",
                  }
                );
              }

              // Get the short description
              const description =
                dayForecasts[0].weather[0].description.charAt(0).toUpperCase() +
                dayForecasts[0].weather[0].description.slice(1).toLowerCase();

              const weatherMain = dayForecasts[0].weather[0].main;
              const weatherDescription = dayForecasts[0].weather[0].description;

              return {
                day: formattedDateString,
                image: (
                  <WeatherIcon
                    weatherMain={weatherMain}
                    weatherDescription={weatherDescription}
                    timeOfDay={timeOfDay}
                  />
                ),
                averageTemp: averageTemp.toFixed(1),
                averageWind: averageWind.toFixed(1),
                averageHumidity: averageHumidity.toFixed(1),
                description: description,
              };
            }
          );

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

  //the Line Graph for visualization
  const weeklyGraph = (action) => {
    let key;
    if (action === "temp") {
      key = "Temperature";
    } else if (action === "humidity") {
      key = "Humidity";
    } else if (action === "wind") {
      key = "Wind";
    }

    if (!Array.isArray(data2) || data2.length === 0) {
      console.error("Data is not an array or is empty");
      return;
    }

    const weekWeather = data2.map((dayData) => ({
      day: dayData.day,
      temp: dayData.averageTemp,
      wind: dayData.averageWind,
      humidity: dayData.averageHumidity,
    }));

    const updatedWeeklyWeatherData = weekWeather.map((dayData) => ({
      name: dayData.day,
      Temperature: dayData.temp,
      Humidity: dayData.humidity,
      Wind: dayData.wind,
    }));

    setWeeklyData(updatedWeeklyWeatherData);
    setDataKey(key);
  };

  useEffect(() => {
    if (data2.length > 0) {
      weeklyGraph("temp");
    }
  }, [data2]);

  //function to display the condition names
  const dataKeyName = (dataKey) => {
    let conditionName = "";
    if (dataKey === "Temperature") {
      conditionName = "Temperature (°C)";
    } else if (dataKey === "Humidity") {
      conditionName = "Humidity (%)";
    } else {
      conditionName = "Wind (Km/h)";
    }
    return conditionName;
  };

  const getColor = (key) => {
    switch (key) {
      case "Temperature":
        return "red";
      case "Humidity":
        return "blue";
      case "Wind":
        return "green";
      default:
        return "black"; // Default color
    }
  };

  //Adding a favourite city to the db
  const addToFavourites = (name) => {
    setFavourites((prevFavourites) => {
      const updatedFavourites = [...prevFavourites, name];
      return updatedFavourites;
    });
    setIsFavourite(true);
    toast.success(`Added '${name}' to favourites`);
  };

  //Removing a favourite city from the db
  const removeFromFavourites = (name) => {
    setFavourites((prevFavourites) => {
      const updatedFavourites = prevFavourites.filter((fav) => fav !== name);
      return updatedFavourites;
    });
    setIsFavourite(false);
    console.log(isFavourite);
    toast.error(`Removed '${name}' from favourites`);
  };

  //Toggling the icon for favourites
  const toggleFavourite = (name) => {
    if (favourites.includes(name)) {
      removeFromFavourites(name);
    } else {
      addToFavourites(name);
    }
  };

  const viewFavourites = () => {
    navigate("/favourites", { state: { favourites: favourites } });
  };

  return (
    <div className="container2">
      <div id="left"></div>
      <div id="middle">
        <div className="weather">
          <div
            className={`container ${bgClass}`}
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
                    <br />
                    <p className="current-forecast">{data.image}</p>
                  </div>
                  <span>
                    <h1>
                      <span className="current">
                        {Math.round(data.celcius)}°C
                      </span>
                    </h1>
                    <h4>Feels like {Math.round(data.feelsLike)}°C</h4>
                  </span>
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
                <hr />
                <p>
                  <u>All day, today</u>
                </p>
                {/* Forecast for the day */}
                <div className="forecast-container">
                  {todaysData.map((forecast, index) => {
                    return (
                      <div className="mini-weather">
                        <div className="forecasted">
                          <div key={index}>
                            <p>{forecast.time}</p>
                            <p className="day-forecast">{forecast.image}</p>
                            <p>{Math.round(forecast.celcius)}°C</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <hr />
                {/* Forecast for the week */}
                <div className="forecast-container2">
                  {data2.map((forecast, index) => (
                    <div className="mini-weather2">
                      <div className="forecasted2">
                        <div key={index}>
                          <p>{forecast.day}</p>
                          <p className="week-forecast">{forecast.image}</p>
                          <p>{Math.round(forecast.averageTemp)}°C</p>
                          <p>{forecast.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
                {/* Graph goes here */}
                <button onClick={() => weeklyGraph("temp")}>Temp</button>{" "}
                <button onClick={() => weeklyGraph("humidity")}>
                  Humidity
                </button>{" "}
                <button onClick={() => weeklyGraph("wind")}>Wind</button>
                <h2>{dataKeyName(dataKey)}</h2>
                <div>
                  <LineChart
                    width={600}
                    height={300}
                    data={weeklyData}
                    margin={{ top: 20, right: 120, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      label={{
                        value: "",
                        position: "insideBottomRight",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      label={{
                        value: dataKeyName(dataKey),
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={dataKey}
                      stroke={getColor(dataKey)}
                      strokeWidth={2.5}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
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
                      <p className="wind-speed">
                        {Math.round(data.speed)} Km/h
                      </p>
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
      <div id="right"></div>
    </div>
  );
}

export default Home;

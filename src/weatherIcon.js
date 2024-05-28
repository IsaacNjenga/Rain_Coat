import React from "react";

function WeatherIcon({ weatherMain }) {
  switch (weatherMain) {
    case "Clear":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="55px"
          height="55px"
        >
          <circle cx="32" cy="32" r="12" fill="yellow" stroke="none" />
          <line
            x1="32"
            y1="5"
            x2="32"
            y2="15"
            stroke="yellow"
            strokeWidth="2"
          />
          <line
            x1="32"
            y1="49"
            x2="32"
            y2="59"
            stroke="yellow"
            strokeWidth="2"
          />
          <line
            x1="5"
            y1="32"
            x2="15"
            y2="32"
            stroke="yellow"
            strokeWidth="2"
          />
          <line
            x1="49"
            y1="32"
            x2="59"
            y2="32"
            stroke="yellow"
            strokeWidth="2"
          />
          <line
            x1="13.5"
            y1="13.5"
            x2="19.5"
            y2="19.5"
            stroke="yellow"
            strokeWidth="2"
          />
          <line
            x1="44.5"
            y1="44.5"
            x2="50.5"
            y2="50.5"
            stroke="yellow"
            strokeWidth="2"
          />
          <line
            x1="13.5"
            y1="50.5"
            x2="19.5"
            y2="44.5"
            stroke="yellow"
            strokeWidth="2"
          />
          <line
            x1="44.5"
            y1="19.5"
            x2="50.5"
            y2="13.5"
            stroke="yellow"
            strokeWidth="2"
          />
        </svg>
      );
    case "Clouds":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="55px"
          height="55px"
        >
          <g fill="none" stroke="none">
            <circle cx="20" cy="20" r="10" fill="yellow" />
            <path
              d="M50.487,33.486C54.223,30.82,57,26.24,57,21c0-9.389-7.611-17-17-17c-6.259,0-11.696,3.232-14.654,8.043
                C24.404,10.018,23.711,10,23,10C14.716,10,8,16.716,8,25c0,6.67,4.336,12.335,10.401,14.285"
              fill="grey"
            />
          </g>
        </svg>
      );
    case "Rain":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="55px"
          height="55px"
        >
          <g fill="none" strokeWidth="2">
            <path
              d="M50.487,33.486C54.223,30.82,57,26.24,57,21c0-9.389-7.611-17-17-17c-6.259,0-11.696,3.232-14.654,8.043
                C24.404,10.018,23.711,10,23,10C14.716,10,8,16.716,8,25c0,6.67,4.336,12.335,10.401,14.285"
              fill="none"
              stroke="grey"
            />
            <line x1="23" y1="44" x2="23" y2="54" stroke="blue" />
            <line x1="31" y1="44" x2="31" y2="54" stroke="blue" />
            <line x1="39" y1="44" x2="39" y2="54" stroke="blue" />
          </g>
        </svg>
      );
    case "Drizzle":
      return (
        <i
          className="fas fa-cloud-rain"
          style={{ fontSize: "55px", color: "grey" }}
        ></i>
      );
    case "Mist":
      return (
        <i
          className="fas fa-smog"
          style={{ fontSize: "55px", color: "grey" }}
        ></i>
      );
    case "Snow":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="55px"
          height="55px"
        >
          <g fill="none" stroke="white" strokeWidth="2">
            <circle cx="32" cy="32" r="12" fill="white" />
            <line x1="32" y1="20" x2="32" y2="44" />
            <line x1="20" y1="32" x2="44" y2="32" />
            <line x1="24" y1="24" x2="40" y2="40" />
            <line x1="24" y1="40" x2="40" y2="24" />
          </g>
        </svg>
      );
    case "Thunderstorm":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="55px"
          height="55px"
        >
          <g fill="none" stroke="none">
            <path
              d="M50.487,33.486C54.223,30.82,57,26.24,57,21c0-9.389-7.611-17-17-17c-6.259,0-11.696,3.232-14.654,8.043
                C24.404,10.018,23.711,10,23,10C14.716,10,8,16.716,8,25c0,6.67,4.336,12.335,10.401,14.285"
              fill="grey"
            />
            <polygon
              points="24,42 32,52 28,52 36,62 30,52 36,42"
              fill="yellow"
            />
          </g>
        </svg>
      );
    default:
      return <div>No Specific display</div>;
  }
}

export default WeatherIcon;

# Bookmaker Application

## Overview

The Bookmaker Application is a web application developed using .NET 8 and React. It serves as a platform for users to bet on football games, manage their bets, track points, and view their betting history. Additionally, the application integrates with the [API-Football](https://rapidapi.com/api-sports/api/api-football) API to fetch football-related data, providing users with up-to-date information on matches, teams, and players.

## Features

- **User Authentication**: Users can create accounts and log in securely to access the betting features.
- **Betting**: Users can place bets on upcoming football matches.
- **Point System**: The application calculates points based on the accuracy of the user's bets.
- **Betting History**: Users can view their past bets and performance.
- **API Integration**: Integration with the API-Football API allows users to access real-time football data.
- **Future Plans**: The application will enable users to create and join groups, allowing them to bet together with friends and compete against each other.

## Technologies Used

- **Frontend**: React
- **Backend**: .NET 8
- **ORM**: Entity Framework
- **API Integration**: RestSharp


## Configuration

1. Set up API-Football API key: Obtain an API key from [RapidAPI](https://rapidapi.com/api-sports/api/api-football) and replace `YOUR_API_KEY` in the backend configuration `appsettings.json`.
2. Configure the database connection string in the backend `appsettings.json` file.

## Acknowledgements

- API-Football for providing the football-related data API.
- React and .NET communities for their invaluable resources and support.

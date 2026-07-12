# The movie database search

Welcome to the Beatgrid fullstack assignment.

## CHANGELOG

> A consolidated list of all changes and improvements made by **Hamzeen** can be found in the [CHANGELOG](CHANGELOG.md).

## 🎯 Objective

You are building a Google for movies. Your app allows users to search through a movies dataset using an autocomplete search input.

### ✅ Requirements

- As the user types in the search input, display a dropdown with autocomplete suggestions.
- When the user selects a movie from the dropdown, update the search input and display a card with detailed information about the selected title.
- The details card should display the movie's name along with any other relevant fields.
- When the search input is focused and empty, the dropdown should show the 10 most recently selected movies, ordered by the most recent to the least recent.
- Ensure the app can efficiently handle larger datasets.

### ⏱️ Time

- This assignment is designed to be completed in about 3 hours.
- You are not expected to build a polished product. Focus on correctness, clarity, and functionality.

## 🧩 Components

### Database

A movie database is provided for you.

To run the database:

- make sure you have [Docker](https://docs.docker.com/) installed
- navigate to the `database` folder
- run `docker compose up -d`
- import data by running `cat init.sql | mysql -h localhost -u root --port 53306 --protocol TCP`

The database is now accessible on port `53306`.

The backend application is already set up to connect to the database.

### Backend

The backend exists in two flavors: Java and Kotlin. Choose your preferred language.

To run the app:

- make sure you have Java 17+ installed
- navigate to the `backend-java` or `backend-kotlin` folder
- run `./gradlew bootRun`

You now have access on `localhost:8080`.

### Frontend

The frontend is bootstrapped with [Vite](https://vitejs.dev/) (using the React + Typescript variant) for your convenience.

To run the app, run `npm install` and then `npm run dev`. The app will be available at `http://localhost:5173/`

## 🧪 Notes

- You can use any libraries you want.
- The design is up to you.
- Feel free to reach out if you have any questions.

## 📦 What to Submit

Please provide:

- The GitHub repository link

## 🙌 Good luck!

We’re looking forward to reviewing your solution.

# UrbanGo

UrbanGo is a responsive London travel companion built using React, Node.js and Express.

The application allows users to search London bus routes, view route stops and live bus arrivals, plan journeys between London locations, check current transport service status and save useful journeys.

The React frontend communicates with an Express backend, which handles requests to Transport for London (TfL) services and returns the required travel data to the client.

## Main Features

- Search London bus routes by route number
- Exact route matching for bus number searches
- View real stops for a selected bus route
- Select an individual bus stop
- View stop-specific live bus arrival predictions
- Manually refresh live arrival information
- Automatically refresh live arrivals every 30 seconds
- Search London stations, stops and transport locations
- Plan journeys between London locations
- Compare alternative journey options
- View journey duration, transport modes and changes
- Expand journey options to view individual journey legs
- Choose Leave now, Leave at or Arrive by
- View current London transport service status
- Save journeys
- Mark saved journeys as favourites
- Delete saved journeys
- Persist saved journeys using a local JSON file on the server
- Access official TfL tickets and fares information
- Access an external London accommodation provider
- Responsive interface for mobile, tablet and desktop devices

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS
- Fetch API

### Backend

- Node.js
- Express
- CORS
- dotenv
- REST-style API endpoints
- JSON data storage

### External Data

UrbanGo uses Transport for London (TfL) services to provide travel information including:

- London bus routes
- Route stops
- Live bus arrivals
- Location search
- Journey planning
- Transport network service status

## Project Structure

The application is separated into a React client and an Express server.

```text
urbango/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── ...
│
├── server/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
```

## Running the Server

Open a terminal and navigate to the server folder:

```bash
cd server
```

Install the dependencies if they have not already been installed:

```bash
npm install
```

UrbanGo requires a TfL API key.

Keep the API key inside the server `.env` file:

```text
TFL_API_KEY=your_api_key_here
```

Do not commit the real `.env` file or API key to GitHub.

Start the Express server:

```bash
node server.js
```

The API runs at:

```text
http://localhost:5000
```

## Running the Client

Open a second terminal and navigate to the client folder:

```bash
cd client
```

Install the dependencies if required:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local address displayed by Vite in the browser.

## API Communication

The React frontend communicates with the UrbanGo Express backend rather than placing the TfL API key directly in the browser.

The backend provides endpoints for functionality including:

```text
GET /api/transport/routes
GET /api/transport/search
GET /api/transport/journey
GET /api/transport/status
GET /api/transport/line/:routeNumber/stops
GET /api/transport/line/:routeNumber/arrivals
GET /api/transport/stop/:stopId/arrivals
GET /api/journeys
GET /api/stats
```

Saved journeys also use server endpoints for creating, updating and deleting journey information.

## Responsive Design

UrbanGo has been designed and tested for multiple screen sizes.

The main responsive testing widths are:

- Mobile: 360px
- Tablet: 720px
- Desktop: 1024px and above

The layout adapts the navigation, cards, forms, journey planner, service status information and travel information according to the available screen width.

## Live Bus Information

Users can search for a London bus route, open its live-arrival section and select a stop.

UrbanGo then requests current arrival predictions for the selected stop and filters the results for the chosen route.

Live arrival information can be refreshed manually and is also automatically refreshed every 30 seconds while a route and stop remain selected.

## Journey Planner

The journey planner allows users to search for London transport locations and select a starting point and destination.

Journey results can include:

- Departure and arrival times
- Total journey duration
- Transport modes
- Number of changes
- Walking sections
- Bus, Underground, Overground and other supported transport legs
- Departure and arrival locations
- Detailed journey instructions

Users can expand a journey option to view its individual legs and save useful journeys.

## Saved Journeys

Saved journeys are sent to the Express server and stored in a local JSON file.

Users can:

- Save a journey
- Mark a journey as a favourite
- Remove a saved journey

This allows saved journey information to remain available after refreshing or restarting the frontend.

## Code Quality

The React application uses reusable components and separates API communication from presentation components.

Repeated interface elements are rendered using reusable components and array mapping where appropriate.

The frontend can be checked with ESLint using:

```bash
npm run lint
```

## Security

The TfL API key is stored on the server using an environment variable.

The `.env` file should be excluded from Git and must not be uploaded to the public repository.

The browser communicates with the UrbanGo Express API so the TfL API key does not need to be included directly in the React frontend.

## Author

Caleb Oppong

Web Development II  
Bath Spa University
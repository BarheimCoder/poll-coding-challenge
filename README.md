# Polling App

This project is a simple poll application built with Node.js, Express, and PostgreSQL for the backend, and Vite, React and Tailwind for the frontend.

## Features

### Polls

- Vote for an option
- View the results of a poll
- See the percentage of votes for each option
- See the total number of votes for each option
- See the breakdown of votes by option

### Admin

This is handled via API calls to the backend.

- Create a poll with a question and 2 to 7 options
- Toggle the active status of a poll
- View all polls
- Delete a poll

### App

- Fully responsive
- 100/100 score for accessibility, SEO and best practices
- Fully acessible with keyboard, respecting tabbing order and high contrast focus

## Local development setup

Locally, the backend is running on port 5000 and the frontend is running on port 5173.

### Backend

1. Install dependencies

```bash
cd server
npm install
```

2. Start the server

```bash
nodemon index.js
```

### Frontend

1. Install dependencies

```bash
cd client
npm install
```

2. Start the frontend

```bash
npm run dev
```

## Docker Setup

1. Install Docker and Docker Compose on your machine

2. Clone the repository
   ```bash
   git clone https://github.com/yourusername/polling-app.git
   cd polling-app
   ```

3. Start the application
   ```bash
   docker-compose up -d
   ```

4. Access the application
   - Frontend: http://localhost
   - Backend API: http://localhost/api

5. Stop the application
   ```bash
   docker-compose down
   ```
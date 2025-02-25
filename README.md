# Polling App

This project is a simple poll application built the following tech stack, and Docker for deployment.

Backend
- Node.js
- Express
- Postgres
- JS

Frontend
- React
- Vite
- Typescript
- Tailwind
- Jest

![image](https://github.com/user-attachments/assets/7924894e-a5a1-4b51-9b2f-8d3c65c7b0ce)

## Features

### Polls

- Allows users to vote for an option getting the results right

### Admin

This is handled via API calls to the backend.

- Create a poll with a question and 2 to 7 options
- View the results of active poll with timestamps
- See the percentage of votes for each option after voting
- Toggle a different poll as active (toggling all others inactive)

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

## Potential improvements

- Add authentication using something like JWT
- Add further checks to votes like IP / session checks to avoid duplicates
- Add more API calls
- - View all polls in a list
  - View vote results in the admin
- 

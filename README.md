# AI Tools Hub

## Overview
Full-stack web application with React frontend and Spring Boot backend.

## Backend (Spring Boot)
- Port: 8080
- H2 in-memory database
- Endpoints:
  - GET /tools
  - GET /tools/{id}
  - GET /tools/search?q=
  - GET /tools/categories
  - GET /tools/featured
  - GET /tools/recommend?q=
  - POST /tools
  - PUT /tools/{id}
  - DELETE /tools/{id}

## Frontend (React + Vite + Tailwind)
- Port: 3000
- Routes:
  - / (home)
  - /tools
  - /tools/:id
  - /recommendation?q=

## Run Backend
1. Install Maven (e.g. https://maven.apache.org/download.cgi)
2. cd backend
3. mvn clean install
4. mvn spring-boot:run

## Run Frontend
1. cd frontend
2. npm install
3. npm run dev

## Vercel Deployment
- The frontend is configured to deploy from the `frontend` folder.
- A `vercel.json` file at the repository root points Vercel to `frontend/package.json` and serves the built `dist` output.
- In Vercel, set the environment variable `VITE_API_URL` to your backend API URL (for example, `https://api.example.com`).
- The app defaults to `http://localhost:8080` only for local development.

## Alternative (no global Maven)
- Add Maven wrapper in backend with `mvn -N io.takari:maven:wrapper` if Maven is already available, then use `./mvnw clean install`.
- On Windows use `./mvnw.cmd clean install`.

## Main features
- Smart search with tag/use case matches
- category filters
- sorting by popularity/latest
- responsive card layout
- recommended tools based on query
- 120 sample AI tools seeded in DB

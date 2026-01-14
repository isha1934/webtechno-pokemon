# WebTechno – Pokémon App

[![Pipeline Status](https://gitlab.bht-berlin.de/isha1934/webtechno/badges/main/pipeline.svg)](https://gitlab.bht-berlin.de/isha1934/webtechno/-/pipelines)

A React + TypeScript web application that uses the public **PokéAPI** to search for Pokémon, built with a complete **DevOps workflow** including CI/CD, Docker, and monitoring.



---

## 💻 Local Development

To run the project locally without Docker:

```bash
cd app/frontend
npm install
npm run dev  

To run both frontend and backend locally (dev):

```powershell
# in one terminal - backend
cd app/backend
npm install
npm run dev

# in a second terminal - frontend
cd app/frontend
npm install
npm run dev
```
```

---
## 🚀 Features

- Search Pokémon by name  
- Display Pokémon details (image, height, weight, types)  
- Add / remove Pokémon from favorites  
- Persist favorites using **localStorage**  
- Loading state & improved user experience  
- Error handling with **Sentry**  
- Breadcrumbs for user actions (search, clicks, API calls)  

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite  
- **Testing:** Vitest, Testing Library  
- **Monitoring:** Sentry  
- **CI/CD:** GitLab CI/CD  
- **Containerization:** Docker, Docker Compose  
- **Web Server:** Nginx  

---

## 📁 Project Structure

```text
webtechno/
├── app/
│   └── frontend/
│       ├── src/
│       ├── Dockerfile
│       └── tests/
├── docker-compose.yml
├── .gitlab-ci.yml
└── README.md
```

---


##  CI/CD Job Overview

The project uses a GitLab CI/CD pipeline with the following jobs:

Install
    •    Installs all project dependencies using npm ci
    •    Ensures a clean and reproducible environment

Build
    •    Builds the frontend application using Vite
    •    Generates production-ready files in the dist/ directory
    •    Build artifacts are stored for later use

Test
    •    Runs automated tests using Vitest
    •    The pipeline fails if any test does not pass

---


##  Tests

Run tests locally:

cd app/frontend
npm test

---

## Docker Support

Run the app easily with one command from the project root:

docker compose up -d --build

The application will be available at: http://localhost:8080

Notes on Docker
- The Compose configuration now runs both `frontend` and `backend` services.
- The frontend is built with a build-arg `VITE_BACKEND_URL` so the static build points to the backend container at `http://backend:4000`.
- Backend example envs are in `app/backend/.env.example` and frontend example envs are in `app/frontend/.env.example`.

## Troubleshooting native build errors on Windows

If you see native build errors when running `npm install` in `app/backend` on Windows (errors mentioning `node-gyp`, `Visual Studio`, or `msvs`), that's because `better-sqlite3` is a native module that must be compiled. You have two easy options:

- Use Docker (recommended): the project Dockerfile now installs the native build tools inside the container and compiles native modules during image build. From the repo root run:

```powershell
docker compose up -d --build
```

- Or install the native build toolchain on Windows and then run `npm install` locally:
    1. Install the Visual Studio Build Tools (2022) with the "Desktop development with C++" workload. Get it from: https://visualstudio.microsoft.com/downloads/ (choose "Build Tools for Visual Studio").
    2. Install Python 3 and ensure `python` (or `python3`) is on your PATH.
    3. Restart your terminal and rerun `npm install` inside `app/backend`.

After that, `better-sqlite3` should compile successfully. If you'd rather avoid native modules on Windows, I can switch the project to a JS-based SQLite driver or keep using Docker so you don't need to install build tools locally.

---

## Monitoring

    •    Integrated Sentry for error tracking
    •    Captures runtime exceptions
    •    Uses breadcrumbs to track user interactions and API calls

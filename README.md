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

---

## Monitoring

    •    Integrated Sentry for error tracking
    •    Captures runtime exceptions
    •    Uses breadcrumbs to track user interactions and API calls

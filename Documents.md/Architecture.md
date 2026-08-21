# System Architecture

## Overview
The Task Management System is built using a clean, decoupled architecture separating the frontend client application from the backend API services.

## Technology Stack
- **Frontend**: React, Vite, HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Architecture Pattern**: Client-Server (RESTful API architecture)

## Repository Structure
```
Task Management/
├── Documents.md/          # Architecture and design specifications
├── frontend/              # Frontend React application area
│   ├── src/
│   │   ├── App.jsx        # Root Application component
│   │   └── main.jsx       # Frontend entry point
│   ├── index.html         # Main HTML document template
│   ├── vite.config.js     # Vite bundler configuration
│   ├── .env.example       # Frontend environment variables template
│   └── package.json       # Frontend dependencies and scripts
└── backend/               # Backend Express API service area
    ├── src/
    │   └── server.js      # Backend application entry point
    ├── .env.example       # Backend environment variables template
    └── package.json       # Backend dependencies and scripts
```

## Architectural Guidelines
1. **Separation of Concerns**: Frontend handles presentation and state; Backend handles business logic and API endpoints.
2. **Minimal & Realistic**: Only essential initial setup files are included without premature abstractions or placeholder features.

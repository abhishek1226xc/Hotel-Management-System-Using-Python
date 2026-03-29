# Hotel Management Sytem

## Description

Hotel Management Sytem is a full-stack hotel operations platform for managing room listings, guest bookings, and pricing with a Node.js backend and PostgreSQL data storage.

A full-stack hotel management application for room search, booking flow, and operational management.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Algorithms: Binary Search Tree (BST) for room indexing and search optimization

## Project Structure

```
.
|-- backend/
|   |-- server.js
|   |-- bst.js
|   |-- pricing.js
|   |-- schema.sql
|   `-- prj.env
|-- frontend/
|   |-- index.html
|   |-- app.js
|   |-- dashboard.js
|   `-- styles.css
|-- package.json
`-- setup_project.sh
```

## Features

- Room listing and search
- Booking management flow
- Pricing utilities
- Backend API endpoints for hotel operations
- SQL schema for hotel system data model

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Update values in `backend/prj.env` to match your local database and server settings.

### 3. Set up database

Run the SQL file in your PostgreSQL instance:

```sql
backend/schema.sql
```

### 4. Start the backend

```bash
node backend/server.js
```

### 5. Open the frontend

Open `frontend/index.html` in your browser.

## Notes

- The previously merged zip artifact has been removed from this repository.
- If you want, this repository can be split into separate frontend/backend run commands in `package.json` scripts.

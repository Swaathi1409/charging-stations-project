# Charging Stations Management System

A full-stack application for managing electric vehicle charging stations, built with Node.js, Express, MongoDB, and Vue.js.

## Features

- User Authentication (Register/Login)
- CRUD operations for charging stations
- Geospatial queries for finding nearby stations
- Protected routes with JWT authentication
- Interactive map view of charging stations
- Filtering and search capabilities

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/charging-stations
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VUE_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run serve
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Charging Stations
- GET `/api/stations` - Get all charging stations
- POST `/api/stations` - Create a new charging station
- PUT `/api/stations/:id` - Update a charging station
- DELETE `/api/stations/:id` - Delete a charging station
- GET `/api/stations/nearby` - Get nearby charging stations

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - Express Validator

- Frontend:
  - Vue.js
  - Vuex for state management
  - Vue Router
  - Axios for API calls
  - Google Maps API

## Screenshots:

![image](https://github.com/user-attachments/assets/2455e3c7-6d2c-46ab-b9b5-cad57b3f9c72)

![image](https://github.com/user-attachments/assets/482482b4-91d9-458a-a329-afbbce53ba32)

![image](https://github.com/user-attachments/assets/b2d1792f-ef9a-4b1d-b49c-b3990a82efc2)

![image](https://github.com/user-attachments/assets/8249c545-b071-457f-b559-3247ac20a0ee)

![image](https://github.com/user-attachments/assets/d1ed4aae-b434-46dc-8a67-513cc83e05ea)





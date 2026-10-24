# 🏡 Homestay Booking Application

A comprehensive, full-stack web application designed for browsing, managing, and booking homestays. The project pairs a modern **React & Vite** frontend with a robust **Spring Boot & MongoDB** backend.

---

## ✨ Core Features & Application Flow

### 1. User Roles & Authentication
The application relies on **Google OAuth 2.0** for a frictionless login experience. The user roles heavily dictate functionality:
- **GUEST Route (`/bookings`)**: Guests can browse all available homestays, view detailed room configurations, leave reviews, and book rooms for specific dates.
- **ADMIN Route (`/admin`)**: Administrators manage their respective homestays, upload homestay imagery, define room availability/pricing, and monitor all bookings related to their properties.

### 2. Homestay & Room Management
- Administrators can dynamically create **Homestay** entries, providing addresses, Google Map URLs, and uploading cover photos (managed by the backend's FileUploadController).
- Each Homestay can have multiple **Rooms** uniquely defined by types, pricing, and guest capacities.

### 3. Comprehensive Booking System
- The booking system captures exact check-in and check-out dates, directly mapping a `Guest` to a specific `Room` within a `Homestay`.
- The `BookingsPage` component provides users a dashboard view of their active and historical bookings.

### 4. Search & Discovery
- The **HomePage** serves as the discovery engine, presenting available homestays and offering search functionality across names, locations, and aggregate ratings.

---

## 🏗️ Architecture Deep Dive

### 🎨 Frontend (React + Vite)
The UI is modular, fast, and driven by state management via React Context.

**Folder Structure & Routing (`App.jsx`):**
- **Pages**:
  - `HomePage.jsx` (`/`): Public discovery page for all homestays.
  - `HomestayDetail.jsx` (`/homestay/:id`): Public details page, showcasing rooms, map links, and user reviews.
  - `AdminPage.jsx` (`/admin`): Protected dashboard route for `ADMIN` users to manage their listings.
  - `BookingsPage.jsx` (`/bookings`): Protected dashboard route for `GUEST` users to view their bookings.
- **Components**:
  - `Navbar.jsx`: Global navigation and login trigger.
  - `AuthModal.jsx`: Encapsulates the Google Authentication flow.
- **Context**: 
  - `AuthContext.jsx`: Provides application-wide user state, role authorization, and loading states.
- **Dependencies**: React Router v6, Axios for API binding, Lucide React for iconography.

### ⚙️ Backend (Spring Boot + MongoDB)
A modular, strictly-typed REST API built on Java 17.

**Key Endpoints by Controller:**
- **HomestayController**:
  - `GET /api/homestays` - Fetch all listings (HomePage)
  - `GET /api/homestays/{id}` - Fetch single listing (HomestayDetail)
  - `GET /api/homestays/admin/{email}` - Fetch listings owned by a specific admin
  - `POST /api/homestays` - Create a new homestay
  - `DELETE /api/homestays/{id}` - Remove a homestay
  - `POST /api/homestays/{homestayId}/rooms` - Append a room to a homestay
  - `DELETE /api/homestays/{homestayId}/rooms/{roomId}` - Remove a room
- **BookingController**:
  - `POST /api/bookings` - Create a booking
  - `GET /api/bookings/guest/{email}` - Fetch bookings for a specific guest
  - `GET /api/bookings/homestay/{homestayId}` - Fetch bookings for an admin's homestay
- **ReviewController**:
  - `POST /api/reviews` - Submit a new review
  - `GET /api/reviews/homestay/{homestayId}` - Fetch reviews for a specific property
- **FileUploadController**:
  - `POST /api/upload` - Upload images (multipart/form-data)
  - `GET /api/upload/{fileName}` - Serve the uploaded statics
- **AuthController**:
  - `POST /api/auth/login` - Validate OAuth token and instantiate User

**Core Data Models:**
- **`Homestay`**: `id`, `name`, `address`, `locationMapUrl`, `photoUrl`, `adminEmail`, `rooms` (List of Room objects), `averageRating`.
- **`Room`**: Nested inside Homestay or referenced, details pricing and capacity.
- **`Booking`**: Tracks reservation state referencing the homestay, room, check-in/out, and guest email.
- **`Review`**: Tracks textual feedback and numerical ratings for a homestay from guests.
- **`User`**: Core identity mapping email, name, and `ADMIN`/`GUEST` roles.

---

## 🛠️ Setup Instructions

### Environment Prerequisites
- Node.js (for Vite and React)
- Java SE 17
- MongoDB Community Server (running on `localhost:27017`)

### 1. Backend Server Setup
The Spring Boot backend will start on port `8080` and auto-generate the `homestay_booking` database. File uploads are saved to the `backend/uploads/` directory.

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Start the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows, you can just run `mvnw spring-boot:run`)*

### 2. Frontend Client Setup
The React application defaults to port `5173`. Make sure to configure your Google OAuth Client ID in a `.env` file within the `frontend` folder (e.g., `VITE_GOOGLE_CLIENT_ID=your_id_here`).

1. Open a separate terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

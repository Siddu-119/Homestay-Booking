# 🏡 Homestay Booking Application

A comprehensive, full-stack web application designed to simplify homestay discovery, room management, and online bookings. Built collaboratively as an internship project by a team of three, the application combines a React and Vite frontend with a Spring Boot and MongoDB backend.

---

## ✨ Core Features

### 🔐 1. User Authentication & Roles

- Google OAuth 2.0 authentication.
- Role-based access for **GUEST** and **ADMIN** users.
- Protected routes for guest bookings and administrator dashboards.
- Centralized authentication and user-state management.

### 🏠 2. Homestay Management

- Create and manage homestay listings.
- Add property addresses, Google Maps links, and cover images.
- Manage multiple rooms within each homestay.
- Configure room types, pricing, and guest capacities.
- Delete homestays and individual rooms.

### 📅 3. Booking Management

- Book rooms for specific check-in and check-out dates.
- View active and previous bookings.
- Associate bookings with guests, rooms, and homestays.
- Allow administrators to monitor bookings for their properties.

### ⭐ 4. Search, Discovery & Reviews

- Browse available homestay listings.
- Search homestays by name and location.
- View property details, room configurations, and map links.
- Submit guest reviews and numerical ratings.
- Display aggregate homestay ratings.

### 🖼️ 5. Image Uploads

- Upload homestay images through the backend API.
- Store uploaded files in the backend's uploads directory.
- Retrieve uploaded images for display in the application.

---

## 🏗️ Application Architecture

### 🎨 Frontend — React + Vite

The frontend provides a modular, responsive user interface with client-side routing and shared authentication state.

**Pages and routes**

| Page | Route | Purpose |
|---|---|---|
| HomePage | `/` | Browse and search homestays |
| HomestayDetail | `/homestay/:id` | View property details, rooms, maps, and reviews |
| AdminPage | `/admin` | Manage homestays and rooms |
| BookingsPage | `/bookings` | View guest bookings |

**Core components**

- `Navbar.jsx` — Global navigation and login controls.
- `AuthModal.jsx` — Google authentication interface.
- `AuthContext.jsx` — Shared authentication state, user roles, and loading states.

**Frontend technologies**

- React.js
- Vite
- React Router v6
- Axios
- Lucide React
- CSS

### ⚙️ Backend — Spring Boot + MongoDB

The backend provides REST APIs for authentication, homestay management, bookings, reviews, and image uploads.

**Technology stack**

- Java 17
- Spring Boot
- MongoDB
- Maven

### 🔌 API Endpoints

#### Homestay Controller

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/homestays` | Fetch all homestays |
| GET | `/api/homestays/{id}` | Fetch a homestay by ID |
| GET | `/api/homestays/admin/{email}` | Fetch homestays owned by an administrator |
| POST | `/api/homestays` | Create a homestay |
| DELETE | `/api/homestays/{id}` | Delete a homestay |
| POST | `/api/homestays/{homestayId}/rooms` | Add a room |
| DELETE | `/api/homestays/{homestayId}/rooms/{roomId}` | Delete a room |

#### Booking Controller

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/guest/{email}` | Fetch bookings for a guest |
| GET | `/api/bookings/homestay/{homestayId}` | Fetch bookings for a homestay |

#### Review Controller

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/reviews` | Submit a review |
| GET | `/api/reviews/homestay/{homestayId}` | Fetch reviews for a homestay |

#### File Upload Controller

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/upload` | Upload images |
| GET | `/api/upload/{fileName}` | Retrieve uploaded images |

#### Authentication Controller

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Validate an OAuth token and initialize a user session |

---

## 🗃️ Core Data Models

- **Homestay:** Property name, address, map URL, photo URL, administrator email, rooms, and average rating.
- **Room:** Room type, pricing, and guest capacity.
- **Booking:** Guest, homestay, room, check-in date, and check-out date.
- **Review:** Guest feedback and numerical ratings.
- **User:** User identity and assigned `ADMIN` or `GUEST` role.

---

## 🛠️ Getting Started

### Prerequisites

Install the following before running the application:

- Node.js and npm
- Java Development Kit (JDK) 17
- MongoDB Community Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Siddu-119/Homestay-Booking.git
cd Homestay-Booking
```

### 2. Start the Backend

Ensure MongoDB is running locally on port `27017`.

Open a terminal in the project root:

```bash
cd backend
```

Run the Spring Boot application using the Maven wrapper.

**Windows:**

```bash
mvnw.cmd spring-boot:run
```

**Linux/macOS:**

```bash
./mvnw spring-boot:run
```

The backend is configured to run on port `8080`.

### 3. Configure the Frontend

Open a separate terminal in the project root:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory and configure your Google OAuth client ID:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Replace the placeholder with your own configured client ID. Do not commit private credentials or secrets.

### 4. Run the Frontend

From the `frontend` directory, run:

```bash
npm run dev
```

Open the local URL displayed in the terminal. Vite typically uses port `5173`.

---

## 🎯 Project Objective

To develop a user-friendly homestay booking platform that connects guests with accommodation options while enabling administrators to manage properties, rooms, pricing, and reservations.

## 📚 Learning Outcomes

- Full-stack web application development.
- React component-based architecture and routing.
- REST API development using Spring Boot.
- MongoDB data modeling and integration.
- OAuth-based authentication and role-based application flows.
- Collaborative development and project management.

---

## 👥 Project Team

Developed collaboratively by three team members as part of an internship project.

- **Siddu B R**
- **Shreyas B Bhat**
- **Shreyas D R**

## 🔗 Repository

[View Homestay Booking on GitHub](https://github.com/Siddu-119/Homestay-Booking)

---

⭐ If you find this project interesting, consider starring the repository.

*Developed collaboratively as part of an internship project.*

UniGo - Student Ride Sharing App 🚗🎓
UniGo is a MERN-stack web application designed to facilitate ride-sharing among university students. It provides a secure platform for students to post rides, book seats, and build trust through a reputation-based rating system.

🚀 Getting Started
Follow these instructions to set up the project locally on your machine.

Prerequisites
Node.js (v14 or higher)

MongoDB (Local or Atlas URI)

1. Clone the Repository
git clone https://github.com/alivmran/UniGo.git

cd UniGo

2. Backend Setup
Navigate to the backend directory, install dependencies, and start the server.

cd BackEnd

# Install server dependencies
npm install

# Create a .env file (or modify config.js) with your secrets:

# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret

# Run the server
node server.js
The server will run on http://localhost:5000

3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and launch the React application.

cd FrontEnd

# Install client dependencies
npm install

# Run the development server (Vite)
npm run dev
The app will generally run on http://localhost:5173

📦 Dependencies
Here are the key packages required to run UniGo. These will be installed automatically when you run npm install in the respective directories.

Backend (/BackEnd)

express: Web framework for Node.js.
mongoose: ODM for MongoDB.
bcryptjs: Password hashing for secure authentication.
jsonwebtoken: Handling JWTs for protected routes.
cors: Enabling Cross-Origin Resource Sharing.
dotenv: Loading environment variables.

Frontend (/FrontEnd)

react: The UI library.
react-router-dom: Handling client-side routing.
axios: Making HTTP requests to the backend.
vite: Next Generation Frontend Tooling (fast build tool).

✨ Features
🔒 Authentication & Profile
. Secure Sign Up/Login: JWT-based authentication ensures user data security.

. User Profiles: View personal stats including "Rides Given," "Rides Taken," and your calculated "Driver Rating."

🚗 Ride Management (Driver)
. Post a Ride: Easily create a ride offering by setting origin, destination, date, time, and price.

. Request Management: Accept or Reject incoming booking requests from passengers.

. Ride Completion: Mark rides as "Completed" to unlock the rating system.

. Self-Booking Protection: Logic prevents drivers from booking seats on their own rides.

🎫 Booking System (Passenger)
. Search & Filter: Find rides quickly by searching for locations (e.g., "Clifton", "Campus").

. Smart Booking: Request seats on available rides.

. Status Tracking: Track booking status (Requested → Confirmed → Completed).

. Cancellation: Passengers can cancel bookings before the ride starts.

⭐ Trust & Safety
. Rating System: A percentage-based rating system (e.g., 80% score) derived from past completed rides.

. Driver Transparency: Drivers' names and ratings are visible on ride cards before booking.

🛠️ Tech Stack
MongoDB: Database

Express.js: Backend Framework

React.js: Frontend Library

Node.js: Runtime Environment

Author:
Syed Ali Imran

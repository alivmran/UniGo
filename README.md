# UniGo - Student Ride Sharing App 🚗🎓

UniGo is a MERN-stack web application designed to facilitate ride-sharing among university students. It provides a secure platform for students to post rides, book seats, and build trust through a reputation-based rating system.

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/alivmran/UniGo.git
cd UniGo
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and start the server.
```bash
cd BackEnd
npm install
# Create a .env file with PORT, MONGO_URI, JWT_SECRET
node server.js
```
The server will run on http://localhost:5000.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and launch the React application.
```bash
cd FrontEnd
npm install
npm run dev
```
The app will run on http://localhost:5173.

## 🧪 Playwright E2E Framework

The project includes an end-to-end testing framework built with Playwright to ensure the reliability of critical user flows.

### Framework Setup

1. Navigate to the testing directory:
```bash
cd unigo-playwright-framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

### Running Tests

Run all E2E tests:
```bash
npx playwright test
```

Run tests in UI mode for debugging:
```bash
npx playwright test --ui
```

### Reports
The framework is integrated with Playwright's built-in HTML reporter and Allure. After running the tests, you can view the report using:
```bash
npx playwright show-report
```

## 🛠️ Tech Stack
- **Database:** MongoDB
- **Backend:** Express.js, Node.js
- **Frontend:** React.js, Vite
- **Testing:** Playwright E2E

**Author:**
Syed Ali Imran

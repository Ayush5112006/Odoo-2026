# 🚚 TransitOps
> **Smart Transport Operations Platform**
> 
> *A robust, end-to-end transport operations platform that digitizes vehicle management, driver tracking, dispatching, maintenance scheduling, and fuel expense logging while enforcing strict business rules and providing real-time analytics.*

---

## 📋 Table of Contents
1. [Overview](#-overview)
2. [Target Users & Role-Based Access Control](#-target-users--role-based-access-control)
3. [Key Features](#-key-features)
4. [Mandatory Business Rules Enforced](#-mandatory-business-rules-enforced)
5. [Tech Stack](#-tech-stack)
6. [Project Structure](#-project-structure)
7. [Getting Started & Installation](#-getting-started--installation)
8. [Database Entities](#-database-entities)
9. [Example Operational Workflow](#-example-operational-workflow)
10. [Bonus Features Implemented](#-bonus-features-implemented)

---

## 🌟 Overview
TransitOps is designed to help logistics companies transition away from disorganized spreadsheets and manual paper logbooks. By centralizing core logistical workflows, TransitOps prevents scheduling conflicts, optimizes vehicle utilization, tracks maintenance cycles, guarantees driver license compliance, monitors fuel efficiency, and displays live operational KPIs.

---

## 👥 Target Users & Role-Based Access Control
TransitOps implements secure authentication using email & password, enforcing role-based permissions:

| Role | Primary Responsibilities | Permissions & Views |
| :--- | :--- | :--- |
| **Fleet Manager** | Oversees fleet assets, vehicle lifecycle, maintenance logs. | Full access to Vehicle Registry, Maintenance Logs, and Fleet Stats. |
| **Driver / Dispatcher** | Creates/dispatches trips, assigns vehicles and drivers. | Trip planning, real-time dispatch, active trip completion. |
| **Safety Officer** | Monitors compliance, license expiry, safety scores. | Driver profiles, license warning alerts, safety tracking. |
| **Financial Analyst** | Audits fuel logs, tolls, maintenance, and vehicle ROI. | Expense dashboards, fuel logs, financial analytics, CSV/PDF export. |

---

## 🚀 Key Features

### 1. Unified Dashboard & Operational KPIs
*   **Live Metrics:** Fleet Utilization (%), Active/Available/In Shop Vehicles, Pending/Active Trips, and Drivers On-Duty.
*   **Filters:** Filter vehicles and operations dynamically by vehicle type, status, and operating region.

### 2. Vehicle Registry
*   **Details Tracked:** Registration Number (unique), Name/Model, Type, Max Load Capacity (kg), Odometer, Acquisition Cost, and Status.
*   **Status Management:** Available, On Trip, In Shop (Maintenance), and Retired.

### 3. Driver Management
*   **Profiles:** Name, License Number, License Category, Expiry Date, Contact Info, Safety Score, and Availability Status.
*   **Status Management:** Available, On Trip, Off Duty, Suspended.

### 4. Smart Trip Management
*   **Validation Engine:** Enforces load capacity, status verification, and license expiry rules.
*   **Trip Lifecycle:** `Draft` ➔ `Dispatched` ➔ `Completed` or `Cancelled`.

### 5. Maintenance Operations
*   **Status Syncing:** Registering a vehicle for maintenance automatically updates its status to `In Shop`, making it unavailable for dispatch.
*   **Resolution:** Closing the maintenance log restores the vehicle's status to `Available`.

### 6. Fuel & Expense Auditing
*   **Cost Calculation:** Logs fuel inputs (liters, cost, date) and operational expenses (tolls, repairs).
*   **ROI Metrics:** Automatically aggregates total costs to evaluate individual vehicle ROI.

### 7. Interactive Reports & Analytics
*   **Visual Charts:** Charts illustrating fuel efficiency trends, cost distribution, and ROI.
*   **Export:** Fast CSV export (with optional PDF export) for financial reporting.

---

## 🛡️ Mandatory Business Rules Enforced

*   **Uniqueness:** Vehicle registration numbers must be globally unique.
*   **Dispatch Guardrails:** Vehicles marked as `Retired` or `In Shop` (`In Maintenance`) cannot be dispatched.
*   **Safety Compliance:** Drivers with expired licenses or `Suspended` status are blocked from trip assignment.
*   **Double-Booking Prevention:** A driver or vehicle already active on a trip (`On Trip`) cannot be assigned to another trip.
*   **Capacity Limit:** Cargo weight must not exceed the selected vehicle's Maximum Load Capacity.
*   **Automatic Status Transitions:**
    *   *Dispatching:* Updates both Vehicle and Driver status to `On Trip`.
    *   *Completing:* Restores both Vehicle and Driver status to `Available`. Updates vehicle odometer.
    *   *Cancelling:* Restores both Vehicle and Driver status to `Available`.
    *   *Maintenance Log Open:* Shifts vehicle status to `In Shop`.
    *   *Maintenance Log Closed:* Shifts vehicle status to `Available`.

---

## 💻 Tech Stack

*   **Frontend:** [React](https://react.dev/) + [Vite](https://vite.dev/) (Fast development & HMR)
*   **Styling:** Premium Custom Vanilla CSS (Rich aesthetics, dark mode support, and micro-interactions)
*   **Backend:** Node.js, [Express](https://expressjs.com/) (RESTful APIs)
*   **Database:** MongoDB via [Mongoose](https://mongoosejs.com/) (Document storage)
*   **Linter:** [Oxlint](https://github.com/oxc-project/oxlint) (Fast static code analysis)

---

## 📂 Project Structure

```
TransitOps/
├── server/                     # Backend Express App
│   ├── config/                 # Database configuration
│   ├── middleware/             # Auth & Role-based guards
│   ├── models/                 # Mongoose schemas (User, Vehicle, Driver, Trip, etc.)
│   ├── routes/                 # API controllers/routes
│   ├── seed.js                 # Database seeder utility
│   ├── server.js               # Server entry point
│   └── package.json
├── src/                        # Frontend React Application
│   ├── components/             # Reusable UI views (Dashboard, Vehicles, Drivers, Trips, etc.)
│   ├── App.jsx                 # Core routing & app container
│   ├── index.css               # Styling system & dark mode styles
│   └── main.jsx
├── index.html                  # App entry HTML template
├── package.json                # Project dependencies & scripts
└── vite.config.js              # Vite bundler configuration
```

---

## ⚙️ Getting Started & Installation

### 1. Prerequisites
*   Node.js (v18 or higher)
*   MongoDB running locally or a MongoDB Atlas URI

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Ayush5112006/depstar.git
cd odoo

# Install Frontend dependencies
npm install

# Install Backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in both the root directory and the `server` directory.

**Server environment configuration (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/transitops
JWT_SECRET=your_jwt_secret_key_here
```

**Frontend environment configuration (`.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Seeding
To populate the database with default roles, users, test vehicles, and drivers, run:
```bash
npm run seed
```

### 5. Running the Application
Open two terminal windows to run both servers concurrently:

**Start Backend Server:**
```bash
npm run backend
```

**Start Frontend Development Server:**
```bash
npm run dev
```
Navigate to `http://localhost:5173` to interact with the platform.

---

## 🗄️ Database Entities
*   **User:** Email, Password, Role (`admin`, `manager`, `driver`, `safety`, `analyst`).
*   **Vehicle:** Registration Number, Name, Type, Load Capacity, Odometer, Acquisition Cost, Status.
*   **Driver:** Name, License No, Category, Expiry Date, Contact No, Safety Score, Status.
*   **Trip:** Source, Destination, Driver ID, Vehicle ID, Cargo Weight, Planned Distance, Odometer Start/End, Fuel Consumed, Status.
*   **Maintenance Log:** Vehicle ID, Description, Cost, Start Date, End Date, Status.
*   **Fuel & Expense Logs:** Vehicle ID, Date, Fuel Liters, Fuel Cost, Tolls, Additional Costs, Notes.

---

## 🔄 Example Operational Workflow
Test the core business rules using the following sequence:

1.  **Register a Vehicle:** Add `Van-05` (Max Capacity: 500 kg, Status: `Available`).
2.  **Register a Driver:** Add `Alex` (Valid driving license, Status: `Available`).
3.  **Draft a Trip:** Set cargo weight to `450 kg` (System validates that $450 \text{ kg} \le 500 \text{ kg}$).
4.  **Dispatch Trip:** Dispatching locks both `Van-05` and `Alex` status to `On Trip`.
5.  **Complete Trip:** Enter final odometer and fuel consumed. Both vehicle and driver reset to `Available`.
6.  **Create Maintenance:** Book `Van-05` for an oil change. Status becomes `In Shop` (hidden from trip dispatching).
7.  **Analytics Update:** Navigate to Reports to see updated operational cost, fuel efficiency, and ROI metrics.

---

## ✨ Bonus Features Included
*   🌓 **Theme Toggle:** Native Dark Mode support.
*   📄 **PDF & CSV Export:** Export logs and report analyses on demand.
*   ⚠️ **Smart License Notifications:** Safety Officers receive highlighted alerts for licenses expiring within 30 days.
*   🔍 **Advanced Searching:** Search and sort filters implemented across all grids.

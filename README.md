# TransitOps — Smart Transport Operations Platform

TransitOps is a modern, real-time fleet management and dispatch operations dashboard. It integrates role-based permissions, automated expense calculation, and lifecycle logs with a premium, tactile 3D visual theme and smooth shimmer loading indicators.

---

## 🚀 Key Features

### 1. Dynamic Role-Based Access Control (RBAC)
- **4 Custom Roles**:
  - `Fleet Manager`: Core fleet registry, vehicle maintenance scheduling, and analytics.
  - `Dispatcher`: Live trip planning, route allocation, and dispatch board management.
  - `Safety Officer`: Driver profile compliance, contact directories, and license expiration guards.
  - `Financial Analyst`: Fuel efficiency monitoring, expense logs, and ROI evaluations.
- **Dynamic Policy Manager**: An interactive matrix editor on the Settings page allows administrators to toggle full access, view-only (read-only), or restricted access for each role. Changes are written to the database and immediately enforced on both backend routes and frontend views.

### 2. Operations & Fleet Lifecycle Management
- **Fleet Registry**: Track vehicle capacity, registration, types, and current status (e.g. `Available`, `In Shop`, `Retired`).
- **Driver Registry**: Monitor safety scores, contact info, and automated license validation warnings.
- **Live Dispatch Board**: Plan cargo runs, track trip progress, complete dispatches, and cancel logs.
- **Maintenance Records**: Schedule shop logs. In-shop vehicles are automatically removed from the active dispatcher pool.
- **Fuel & Cost Tracking**: Log refueling runs. Automatically calculates and displays real-time fuel efficiency (km/l) and total operational costs.

### 3. Premium 3D UI/UX Design System
- **Isometric Perspective Cards**: Cards slide and float slightly upward on hover.
- **Tactile 3D Buttons**: Action buttons have structural depth and depress downward into the screen when clicked.
- **Shimmering Skeleton Loader**: Custom animated skeleton loaders render during initial database synchronization for smooth view transitions.
- **Glow Accents**: Vibrant indicator dots and status pills glow to represent active operations.

---

## 🛠️ Technology Stack

- **Frontend**: React (with Vite HMR), Vanilla CSS Custom Design
- **Backend**: Node.js, Express REST API, Custom Role Guards Middleware
- **Database**: MongoDB (Mongoose Schema Models)

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string

### Setup Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd odoo
   ```

2. **Backend Configuration**:
   Create a `.env` file in the `server` directory (or configure `server/index.js` port and database settings):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/transitops
   ```

3. **Install Dependencies**:
   ```bash
   # Install root and backend dependencies
   npm install
   
   # Install client frontend dependencies
   npm install --prefix client
   ```

4. **Start Development Services**:
   You can run both client and server concurrently using the root scripts:
   ```bash
   # Run backend server
   npm run backend
   
   # Run frontend dev server
   npm run dev
   ```

5. **Access Application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

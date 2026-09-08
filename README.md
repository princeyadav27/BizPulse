# BizPulse

BizPulse is a modern multi-business management platform designed for petrol pumps, restaurants, retail operations, and service centers. The application provides a unified dashboard for tracking sales, managing inventory, monitoring staff, and generating business insights through a responsive, user-friendly interface.

## Overview

BizPulse is built to support multiple business models from a single platform. Each business type has a tailored operational workflow while sharing common features like authentication, dashboards, analytics, and business reporting.

The system is designed with a modular structure to support rapid feature expansion, role-based business management, and real-time operational visibility.

## Business Domains Supported

### Petrol Pump
- Fuel sales tracking
- Inventory and tank capacity monitoring
- Staff and transaction management
- Performance and operational reporting

### Restaurant
- Order handling and billing
- Menu and stock management
- Table and customer management
- Staff attendance and payroll tracking

### Retail Store
- Product and inventory tracking
- Sales reporting and analytics
- Customer and transaction monitoring
- Reorder and stock threshold management

### Service Center
- Service bookings and workflow tracking
- Parts inventory management
- Customer and staff records
- Service revenue monitoring

## Key Features

- Multi-business dashboard experience
- Secure authentication using Firebase
- Role-aware user profiles and business data separation
- Sales data upload and management
- Inventory and stock tracking with thresholds
- Business analytics and reporting views
- Responsive design for desktop and tablet usage
- Structured data model for scalable backend growth

## Technology Stack

- Frontend: React 19
- Build Tool: Vite
- Routing: React Router
- Styling: Bootstrap and CSS Modules
- UI Icons: React Icons
- Backend: Firebase Authentication + Firestore
- Storage Model: Per-user collections for data isolation

## Project Architecture

The application follows a simple but scalable client-first architecture:

- Client-side React application for the business interface
- Firebase Authentication for secure sign-in and account creation
- Firestore for structured business data persistence
- Local UI state support for smoother experiences during active sessions
- Modular service layer for data access and business operations

## Firebase Backend Model

The backend is structured around per-user Firestore collections to keep business data isolated and secure. Each collection stores records associated with a `userId`, and includes audit timestamps for operational tracking.

### Core Collections
- `users`
- `sales`
- `stock`
- `inventory`
- `orders`
- `customers`
- `staff`
- `expenses`
- `settings`
- `products`
- `bookings`
- `menu`
- `tables`

### Security Model
Firestore rules are configured to enforce user-owned data access, ensuring that authenticated users can only operate on their own records.

## Repository Structure

```text
BizPulse/
├── src/
│   ├── component/
│   ├── styles/
│   ├── utils/
│   ├── services/
│   ├── App.jsx
│   ├── firebase.js
│   └── main.jsx
├── public/
├── .env.example
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── package.json
├── vite.config.js
├── index.html
├── README.md
└── eslint.config.js
```

## Prerequisites

Before running the project locally, ensure you have:

- Node.js 18+ installed
- npm or another compatible package manager
- A Firebase project with Authentication and Firestore enabled

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Move into the project directory
cd BizPulse

# Install project dependencies
npm install

# Copy environment example file
cp .env.example .env
```

## Environment Configuration

Create a `.env` file and populate it with your Firebase values.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Running the Application

```bash
# Start the development server
npm run dev
```

Then open the local Vite server URL shown in the terminal.

## Production Build

```bash
npm run build
```

## 🎯 Business Types

### Petrol Pump
- ⛽ Fuel sales tracking
- 🛢️ Stock management
- 📊 Transaction reports
- 👥 Staff management

### Restaurant
- 🍽️ Order management
- 💳 Billing system
- 📋 Menu management
- 📦 Kitchen stock tracking

### Retail
- 💰 Sales tracking
- 📦 Inventory management
- 🛍️ Product catalog
- 📊 Business analytics

### Service
- 🔧 Service management
- 📅 Booking system
- 👥 Staff scheduling
- 📈 Performance tracking

## 🔧 Configuration

The system automatically detects your business type and loads the appropriate features and interface.

## Development Notes

This project currently uses Firebase as the best backend fit for a React-driven business management application. It provides a rapid, secure path for authentication and persistent data storage without the overhead of a separate backend service during early-stage product development.

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes with clear commit messages.
4. Run the project build to validate your changes.
5. Submit a pull request with a concise summary of the update.

## License

This project is licensed under the MIT License.

## Support

For support, feature requests, or implementation questions, please contact the project maintainer or open an issue in the repository.

---

BizPulse is designed to provide operational clarity, data visibility, and business control across diverse commercial environments.

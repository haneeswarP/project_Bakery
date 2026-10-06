# Home Bakery Order Management System

A college project for managing bakery orders with a React frontend and Spring Boot backend.

## Technology Stack

- **Backend:** Java 17, Spring Boot, JPA/Hibernate
- **Frontend:** React, JavaScript
- **Database:** MySQL/PostgreSQL
- **API:** REST APIs
- **Version Control:** Git

## Features

### Customer Features
- Place bakery orders with product selection
- Customize orders with special requests
- Schedule delivery dates
- View order confirmation and status
- Calculate order totals automatically

### Baker Features
- View all customer orders
- Update order status (Pending → Confirmed → Preparing → Out for Delivery → Delivered)
- Manage order workflow

## Project Structure

```
├── backend/                    # Spring Boot Backend
│   ├── .mvn/wrapper/          # Maven Wrapper
│   ├── src/main/java/com/bakery/
│   │   ├── controller/        # REST Controllers
│   │   │   └── OrderController.java
│   │   ├── service/           # Business Logic
│   │   │   └── OrderService.java
│   │   ├── repository/        # Data Access Layer
│   │   │   └── OrderRepository.java
│   │   ├── entity/            # JPA Entities
│   │   │   ├── Order.java
│   │   │   └── OrderStatus.java
│   │   ├── dto/               # Data Transfer Objects
│   │   │   ├── OrderRequestDTO.java
│   │   │   ├── OrderResponseDTO.java
│   │   │   └── OrderStatusUpdateDTO.java
│   │   ├── exception/         # Exception Handling
│   │   │   ├── OrderNotFoundException.java
│   │   │   └── GlobalExceptionHandler.java
│   │   └── HomeBakeryApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql          # Sample data
│   ├── pom.xml
│   └── mvnw.cmd              # Maven wrapper (Windows)
├── frontend/                  # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/        # React Components
│   │   │   ├── Navbar.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── StatusBadge.js
│   │   ├── pages/            # Page Components
│   │   │   ├── CustomerOrder.js
│   │   │   ├── OrderConfirmation.js
│   │   │   └── BakerDashboard.js
│   │   ├── services/         # API Services
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── start-backend.cmd         # Windows batch script to start backend
├── start-frontend.cmd        # Windows batch script to start frontend
├── .gitignore
└── README.md
```

## How to Start the Complete Application with One Command

### Quick Start (Recommended)

**1. Open PowerShell in the project root directory**
**2. Run the startup script:**
```powershell
.\start.ps1
```

The script will:
- Prompt you securely for your MySQL root password
- Start the backend in a separate terminal window (port 8080)
- Start the frontend in a separate terminal window (port 3000)
- Show clear startup information and access URLs

**3. To stop all applications:**
```powershell
.\stop.ps1
```
Or simply close the terminal windows that opened.

### Manual Setup (Alternative)

### Manual Setup (Alternative)

**Prerequisites:**
- MySQL server running on localhost:3306
- Database `bakery_db` created
- Java 17+ installed  
- Node.js & npm installed

**Option 1: PowerShell**

**Option 1: PowerShell**

**Backend Terminal:**
```powershell
cd backend
$env:MYSQL_PASSWORD="your_mysql_password"
.\mvnw.cmd spring-boot:run
```

**Frontend Terminal:**
```powershell
cd frontend
npm start
```

**Option 2: Command Prompt**

**Backend Terminal:**
```cmd
cd backend
set MYSQL_PASSWORD=your_mysql_password
mvnw.cmd spring-boot:run
```

**Frontend Terminal:**
```cmd
cd frontend
npm start
```

### Access URLs

- **Customer Order Form:** http://localhost:3000
- **Baker Dashboard:** http://localhost:3000/baker-dashboard  
- **Backend API:** http://localhost:8080/api/orders

### Database Setup

**Default (H2 - for development):**
- The app uses H2 in-memory database by default
- No setup required - works out of the box
- Access H2 console at `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:bakery_db`
  - Username: `sa`
  - Password: `password`

**Production (MySQL/PostgreSQL):**
1. Create a database named `bakery_db`
2. Update database credentials in `backend/src/main/resources/application.properties`
3. Uncomment the MySQL or PostgreSQL configuration
4. The application will automatically create tables on startup

## API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}/status` - Update order status

## Order Status Flow

1. **PENDING** - Order placed by customer
2. **CONFIRMED** - Order accepted by baker
3. **PREPARING** - Order being prepared
4. **OUT_FOR_DELIVERY** - Order out for delivery
5. **DELIVERED** - Order completed

## Usage

1. **Customer Flow:**
   - Access the customer order form
   - Fill in product details, quantity, customization
   - Select delivery date and provide address
   - Submit order and receive confirmation

2. **Baker Flow:**
   - Access the baker dashboard
   - View all orders with details
   - Update order status as work progresses

## Validation

- All required fields are validated
- Delivery date must be future date
- Contact details must be valid format
- Quantities must be positive numbers

## Error Handling

- Proper HTTP status codes
- Meaningful error messages
- Frontend error state handling
- Loading states during API calls
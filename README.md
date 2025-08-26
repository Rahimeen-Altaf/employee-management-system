# Employee Management System

A comprehensive full-stack employee management application built with React and Node.js. This system provides a complete solution for managing employee data with role-based access control, featuring a clean separation between user authentication and employee work profiles.

## Features

### User Management

- Secure Registration & Login with JWT-based authentication
- Role-Based Access Control for Admin and Employee roles
- Personal information management

### Employee Management (Admin Only)

- Employee Profile Creation - Link work profiles to existing users
- Advanced Search & Filtering - Search by name, email, ID, department, position
- Department & Status Management - Organize employees by department and status
- Comprehensive Employee Data - Salary, hire date, emergency contacts, and more

### Modern UI/UX

- Responsive Design - Works seamlessly on all devices
- Material-UI Components - Professional, accessible interface
- Real-time Search - Instant filtering and search results
- Loading States & Error Handling - Smooth user experience

## Architecture

### Two-Table Design

- **Users Table**: Authentication and personal information
- **Employees Table**: Work-related data (created by admin)
- **Clean Separation**: Users can exist without employee profiles

### Tech Stack

**Frontend:**

- React 18 with Hooks
- Redux Toolkit for state management
- Material-UI (MUI) for components
- React Router for navigation
- Axios for API communication

**Backend:**

- Node.js with Express.js
- PostgreSQL database
- Sequelize ORM with associations
- JWT authentication
- bcrypt for password hashing

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/employee-management-system.git
   cd employee-management-system
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd Backend
   npm install

   # Install frontend dependencies
   cd ../Frontend
   npm install
   ```

3. **Database Setup**

   Create a PostgreSQL database and configure your environment:

   ```bash
   # In Backend folder, create .env file
   cd ../Backend
   cp .env.example .env
   ```

   Update `.env` with your database credentials:

   ```env
   DB_NAME=employee_management
   DB_USER=postgres
   DB_PASSWORD=mySecurePassword123
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=myVerySecureJWTSecretKey2024!@#
   NODE_ENV=development
   PORT=5000
   ```

4. **Setup Database Tables**

   ```bash
   # Run database setup script
   npm run setup
   ```

5. **Start the Application**

   **Backend (Terminal 1):**

   ```bash
   cd Backend
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd Frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## Default Admin Account

After setup, login with:

- **Email**: `admin@company.com`
- **Password**: `admin123`

**Important**: Change the admin password after first login!

## User Flow

### 1. User Registration

- New users register with basic information (name, email, password, phone)
- Creates record in Users table only
- User can login but has limited access until admin creates employee profile

### 2. Admin Creates Employee Profile

- Admin logs in and navigates to "Add Employee"
- Admin selects existing user and adds work-related information
- Creates comprehensive employee record linked to user account

### 3. Complete Employee Profile

- Employee now has full access to system features
- Profile displays both personal info (from Users) and work info (from Employees)

## Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm run setup       # Setup database tables and admin user
```

### Frontend Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm run eject     # Eject from Create React App
```

## Database Schema

### Users Table

```sql
- id (Primary Key)
- firstName (Required)
- lastName (Required)
- email (Required, Unique)
- password (Required, Hashed)
- phone (Required)
- role (employee/admin, Default: employee)
- isActive (Boolean, Default: true)
- createdAt, updatedAt
```

### Employees Table

```sql
- id (Primary Key)
- employeeId (Unique)
- department
- position
- salary (Decimal)
- hireDate (Date)
- address (Text)
- dateOfBirth (Date)
- emergencyContact
- emergencyPhone
- status (active/inactive/terminated)
- userId (Foreign Key → users.id)
- createdAt, updatedAt
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | User registration        |
| POST   | `/api/auth/login`    | User login               |
| GET    | `/api/auth/profile`  | Get current user profile |

### Employee Management (Admin Only)

| Method | Endpoint                                | Description                               |
| ------ | --------------------------------------- | ----------------------------------------- |
| GET    | `/api/employees`                        | Get all employees with pagination/search  |
| POST   | `/api/employees`                        | Create employee profile for existing user |
| GET    | `/api/employees/:id`                    | Get specific employee                     |
| PUT    | `/api/employees/:id`                    | Update employee                           |
| DELETE | `/api/employees/:id`                    | Delete employee                           |
| GET    | `/api/employees/users-without-profiles` | Get users without employee profiles       |

### Employee Self-Service

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/api/employees/my-profile` | Get own employee profile |

## Key Components

- **Dashboard** - Role-based dashboard with navigation
- **EmployeeList** - Advanced table with search, filter, pagination
- **EmployeeForm** - Create/edit employee profiles
- **EmployeeDetails** - View complete employee information
- **Login/Register** - Authentication forms
- **AdminRoute** - Protected routes for admin-only features

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Role-Based Access** - Admin and employee role separation
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - Sequelize ORM prevents SQL injection
- **CORS Configuration** - Proper cross-origin resource sharing

## Deployment

### Backend Deployment

1. Set production environment variables
2. Run database migrations
3. Build and deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Update API endpoints for production
2. Build the application: `npm run build`
3. Deploy to static hosting (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/feature`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature/feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

Built for efficient employee management

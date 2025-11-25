# DevPass - QR-Based Device Registration System

## 📋 Prerequisites

Before you begin, make sure you have these installed:

### Backend Requirements:
- **PHP 8.2+** - [Download](https://www.php.net/downloads)
- **Composer** - [Download](https://getcomposer.org/download/)
- **MySQL** - [Download](https://www.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/downloads)

### Frontend Requirements:
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

---

## 🚀 Setup Instructions

### 1. Navigate to Backend Folder
```bash
cd server
```

### 2. Install PHP Dependencies
```bash
composer install
```
This will download all Laravel packages listed in `composer.json` into the `/vendor` folder.

### 3. Create Environment File
```bash
cp .env.example .env
```

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Configure Database
Open `.env` file and update these lines:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=devpass # Change this
DB_USERNAME=root # Change this
DB_PASSWORD=your_password # Change this
```

### 6. Create Database
Open MySQL and create the database:
```sql
CREATE DATABASE devpass;
```
Or use phpMyAdmin/MySQL Workbench to create it.

### 7. Run Migrations
```bash
php artisan migrate
```
This creates all the tables in your database.

### 8. (Optional) Seed Database with Dummy Data
```bash
php artisan db:seed
```

### 9. Install Laravel Sanctum
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 10. Start Backend Server
```bash
php artisan serve
```
Backend will run at: **http://localhost:8000**

---

## 💻 Frontend Setup (React + Vite)

### 11. Open New Terminal & Navigate to Frontend
```bash
cd client
```

### 12. Install Node Dependencies
```bash
npm install
```
This will download all packages listed in `package.json` into the `/node_modules` folder.

### 13. (Optional) Create Environment File
```bash
cp .env.example .env
```
Edit `.env` if needed:
```env
VITE_API_URL=http://localhost:8000/api
```

### 14. Start Frontend Server
```bash
npm run dev
```
Frontend will run at: **http://localhost:5173**

---

## 📁 Project Structure

### Backend (Laravel)
- `app/Models/` → Models (OOP classes + database entities)
- `app/Services/` → Service classes (business logic)
- `app/Http/Controllers/` → Controllers (API endpoints)
- `database/migrations/` → Defines database tables
- `routes/api.php` → Defines API routes
- `.env` → Database credentials

### Frontend (React + Vite)
- `src/components/` → Reusable React components
- `src/pages/` → Page components
- `src/services/` → API service functions
- `src/hooks/` → Custom React hooks
- `src/api/` → API configuration (axios)

---

## 🔧 Development

### Running Both Servers

**Backend:**
```bash
cd server
php artisan serve
```

**Frontend:**
```bash
cd client
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

---

## 📝 Notes

- Make sure both backend and frontend servers are running for full functionality
- Backend API endpoints are prefixed with `/api`
- Frontend makes requests to `http://localhost:8000/api` by default
- Update `.env` files in both `server/` and `client/` directories as needed


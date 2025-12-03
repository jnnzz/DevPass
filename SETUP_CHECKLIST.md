# 🚀 Quick Setup Checklist

Use this checklist when setting up the project for the first time or after pulling from GitHub.

## ✅ Prerequisites Check

- [ ] PHP 8.2+ installed (`php -v`)
- [ ] Composer installed (`composer --version`)
- [ ] MySQL/MariaDB installed and running
- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] Git installed (`git --version`)

## 📥 Initial Setup Steps

### Backend (Laravel)

- [ ] Navigate to `DevPass/server`
- [ ] Run `composer install`
- [ ] Create `.env` file (copy from `.env.example` or create manually)
- [ ] Run `php artisan key:generate`
- [ ] Configure database in `.env`:
  - [ ] `DB_CONNECTION=mysql`
  - [ ] `DB_HOST=127.0.0.1`
  - [ ] `DB_PORT=3306`
  - [ ] `DB_DATABASE=devpass`
  - [ ] `DB_USERNAME=root` (or your MySQL username)
  - [ ] `DB_PASSWORD=your_password` (your MySQL password)
- [ ] Create database `devpass` in MySQL
- [ ] Run `php artisan migrate`
- [ ] (Optional) Run `php artisan db:seed`
- [ ] Start server: `php artisan serve`
- [ ] Verify backend at `http://localhost:8000`

### Frontend (React)

- [ ] Open new terminal
- [ ] Navigate to `DevPass/client`
- [ ] Run `npm install`
- [ ] (Optional) Create `.env` with `VITE_API_URL=http://localhost:8000/api`
- [ ] Start dev server: `npm run dev`
- [ ] Verify frontend at `http://localhost:5173`

## 🔄 After Pulling from GitHub

If you already set up the project and are pulling new changes:

- [ ] Pull latest changes: `git pull origin main`
- [ ] Backend: `cd DevPass/server`
  - [ ] Run `composer install` (if `composer.json` changed)
  - [ ] Run `php artisan migrate` (if new migrations exist)
  - [ ] Run `php artisan config:clear` (if config files changed)
- [ ] Frontend: `cd DevPass/client`
  - [ ] Run `npm install` (if `package.json` changed)
- [ ] Restart both servers

## ⚠️ Common Issues to Check

- [ ] MySQL service is running
- [ ] Database `devpass` exists
- [ ] `.env` file exists and is configured correctly
- [ ] `APP_KEY` is set in `.env` (run `php artisan key:generate` if missing)
- [ ] Ports 8000 and 5173 are not in use
- [ ] All dependencies installed (`vendor/` and `node_modules/` exist)

## 🎯 Verification

- [ ] Backend accessible at `http://localhost:8000`
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] Can see landing page
- [ ] Can register a new account
- [ ] Can login with credentials

---

**Need help?** Check the main [README.md](./README.md) for detailed instructions and troubleshooting.


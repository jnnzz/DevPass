# Admin Dashboard Backend Features

## Overview
This document outlines the admin dashboard, user management, and report generation features implemented for the DevPass system.

## API Endpoints

### Dashboard Statistics
- **GET** `/api/admin/dashboard/stats`
  - Returns dashboard statistics including:
    - Total students
    - Total devices
    - Pending devices
    - Active devices
    - Scans today
    - Recent registrations (last 7 days)
    - Pending approvals list

### User Management

#### Get All Students
- **GET** `/api/admin/students`
  - Query Parameters:
    - `per_page` (default: 15) - Number of results per page
    - `search` - Search by name, ID, email, department, or course
  - Returns paginated list of students

#### Get Student by ID
- **GET** `/api/admin/students/{id}`
  - Returns student details with associated devices

#### Update Student
- **PUT** `/api/admin/students/{id}`
  - Request Body:
    ```json
    {
      "name": "string (optional)",
      "email": "string (optional, must be unique)",
      "phone": "string (optional)",
      "department": "string (optional)",
      "course": "string (optional)",
      "year_of_study": "integer (optional, 1-10)",
      "password": "string (optional, min 6 characters)"
    }
    ```

#### Delete Student
- **DELETE** `/api/admin/students/{id}`
  - Deletes student and all associated devices

### Device Management

#### Get All Devices
- **GET** `/api/admin/devices`
  - Query Parameters:
    - `status` - Filter by status: `all`, `pending`, `active`, `rejected`, `expired`
    - `search` - Search by brand, model, serial number, or student name/ID
    - `per_page` (default: 15) - Number of results per page
  - Returns paginated list of devices with student information

#### Approve Device
- **POST** `/api/admin/devices/{id}/approve`
  - Approves a pending device
  - Sets status to `active`
  - Sets `approved_at` timestamp
  - Sets `qr_expires_at` to 30 days from approval

#### Reject Device
- **POST** `/api/admin/devices/{id}/reject`
  - Request Body:
    ```json
    {
      "reason": "string (optional, max 500 characters)"
    }
    ```
  - Rejects a pending device
  - Sets status to `rejected`
  - Sets `rejected_at` timestamp
  - Stores rejection reason

### Activity Monitoring

#### Get Recent Scans
- **GET** `/api/admin/scans/recent`
  - Query Parameters:
    - `limit` (default: 20) - Number of recent scans to return
  - Returns recent scan activity with student and device information

### Report Generation

All report endpoints support query parameters:
- `format` - `csv` or `json` (default: `csv`)
- `start_date` - Start date for filtering (format: Y-m-d)
- `end_date` - End date for filtering (format: Y-m-d)

#### Students Report
- **GET** `/api/admin/reports/students`
  - Generates CSV or JSON report of all students
  - Includes: ID, Name, Email, Phone, Department, Course, Year of Study, Registration Date

#### Devices Report
- **GET** `/api/admin/reports/devices`
  - Query Parameters:
    - `status` - Filter by device status
  - Generates CSV or JSON report of all devices
  - Includes: Device ID, Student Info, Device Details, Status, Approval Info, Registration Date

#### Scan Activity Report
- **GET** `/api/admin/reports/scan-activity`
  - Generates CSV or JSON report of scan activity
  - Default period: Last 30 days
  - Includes: Scan ID, Student Info, Device Info, Gate, Status, Scan Time

#### Summary Report
- **GET** `/api/admin/reports/summary`
  - Returns JSON summary statistics
  - Includes:
    - Period information
    - Student statistics (total, new registrations)
    - Device statistics (total, by status, new registrations)
    - Scan statistics (total, in period, today)

## Database Schema

### Devices Table
- `id` - Primary key
- `student_id` - Foreign key to students table
- `device_type` - Laptop, Desktop, Tablet, Mobile
- `brand` - Device brand
- `model` - Device model
- `serial_number` - Optional serial number
- `notes` - Optional additional notes
- `status` - pending, active, rejected, expired
- `approved_at` - Timestamp when approved
- `rejected_at` - Timestamp when rejected
- `rejection_reason` - Reason for rejection
- `qr_expires_at` - QR code expiration date
- `last_scanned_at` - Last scan timestamp
- `created_at`, `updated_at` - Timestamps

### Device Scans Table
- `id` - Primary key
- `device_id` - Foreign key to devices table
- `gate_name` - Name of the gate where scan occurred
- `status` - success, failed, expired
- `ip_address` - IP address of scanner
- `notes` - Optional notes
- `created_at`, `updated_at` - Timestamps

## Authentication

All admin endpoints require authentication via Laravel Sanctum:
- Include `Authorization: Bearer {token}` header in requests
- Token obtained from `/api/auth/login` endpoint

## Usage Examples

### Get Dashboard Stats
```bash
curl -X GET http://localhost:8000/api/admin/dashboard/stats \
  -H "Authorization: Bearer {token}"
```

### Get Students with Search
```bash
curl -X GET "http://localhost:8000/api/admin/students?search=john&per_page=20" \
  -H "Authorization: Bearer {token}"
```

### Approve Device
```bash
curl -X POST http://localhost:8000/api/admin/devices/1/approve \
  -H "Authorization: Bearer {token}"
```

### Generate Students CSV Report
```bash
curl -X GET "http://localhost:8000/api/admin/reports/students?format=csv&start_date=2025-01-01&end_date=2025-12-31" \
  -H "Authorization: Bearer {token}" \
  -o students_report.csv
```

## Files Created/Modified

### Controllers
- `app/Http/Controllers/AdminController.php` - Admin dashboard and management endpoints
- `app/Http/Controllers/ReportController.php` - Report generation endpoints

### Services
- `app/Services/AdminService.php` - Business logic for admin operations

### Models
- `app/Models/Device.php` - Device model with relationships
- `app/Models/Student.php` - Updated with devices relationship

### Migrations
- `database/migrations/2025_11_21_222311_create_devices_table.php` - Devices table
- `database/migrations/2025_11_21_222542_create_device_scans_table.php` - Device scans table

### Routes
- `routes/api.php` - Updated with admin routes

## Next Steps

1. **Role-Based Access Control**: Implement middleware to restrict admin endpoints to admin users only
2. **Admin User Model**: Create admin users table and authentication
3. **Email Notifications**: Send emails when devices are approved/rejected
4. **Advanced Filtering**: Add more filter options for reports
5. **PDF Reports**: Add PDF generation capability for reports
6. **Bulk Operations**: Add bulk approve/reject functionality

## Notes

- All endpoints return JSON responses (except CSV reports)
- Error responses follow standard format: `{ "message": "...", "error": "..." }`
- Pagination follows Laravel's standard pagination format
- All timestamps are in UTC and formatted as ISO 8601 strings


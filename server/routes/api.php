<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DeviceController;

// Public routes (no authentication required)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    
    // Student routes
    Route::apiResource('students', StudentController::class);
    
    // Device routes (for students to register devices)
    Route::prefix('devices')->group(function () {
        Route::post('/', [DeviceController::class, 'store']);
        Route::get('/', [DeviceController::class, 'index']);
        Route::get('/activity/scans', [DeviceController::class, 'getScanActivity']);
        Route::get('/{id}', [DeviceController::class, 'show']);
    });
    
    // Admin routes
    Route::prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard/stats', [AdminController::class, 'dashboardStats']);
        
        // User Management
        Route::get('/students', [AdminController::class, 'getStudents']);
        Route::get('/students/{id}', [AdminController::class, 'getStudent']);
        Route::put('/students/{id}', [AdminController::class, 'updateStudent']);
        Route::delete('/students/{id}', [AdminController::class, 'deleteStudent']);
        
        // Device Management
        Route::get('/devices', [AdminController::class, 'getDevices']);
        Route::post('/devices/{id}/approve', [AdminController::class, 'approveDevice']);
        Route::post('/devices/{id}/reject', [AdminController::class, 'rejectDevice']);
        
        // Activity
        Route::get('/scans/recent', [AdminController::class, 'getRecentScans']);
        
        // Reports
        Route::prefix('reports')->group(function () {
            Route::get('/students', [ReportController::class, 'studentsReport']);
            Route::get('/devices', [ReportController::class, 'devicesReport']);
            Route::get('/scan-activity', [ReportController::class, 'scanActivityReport']);
            Route::get('/summary', [ReportController::class, 'summaryReport']);
        });
    });
});
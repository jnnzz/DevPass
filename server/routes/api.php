<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QRController;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\AdminDeviceController;

// Public routes (no authentication required)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public QR code reader (no authentication required)
Route::post('/qr/read', [QRController::class, 'readPublic']);

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    
    // Student routes
    Route::apiResource('students', StudentController::class);
    
    // Device routes (for students)
    Route::prefix('devices')->group(function () {
        Route::get('/', [DeviceController::class, 'index']);
        Route::post('/', [DeviceController::class, 'store']);
        Route::get('/{id}', [DeviceController::class, 'show']);
        Route::put('/{id}', [DeviceController::class, 'update']);
        Route::delete('/{id}', [DeviceController::class, 'destroy']);
        Route::post('/{id}/generate-qr', [DeviceController::class, 'generateQR']);
        Route::post('/{id}/renew', [DeviceController::class, 'renew']);
        Route::get('/activity/scans', [DeviceController::class, 'getScanActivity']);
    });
    
    // Admin device routes
    Route::prefix('admin/devices')->group(function () {
        Route::get('/', [AdminDeviceController::class, 'index']);
        Route::get('/{id}', [AdminDeviceController::class, 'show']);
        Route::post('/{id}/approve', [AdminDeviceController::class, 'approve']);
        Route::post('/{id}/reject', [AdminDeviceController::class, 'reject']);
        Route::get('/statistics', [AdminDeviceController::class, 'statistics']);
        Route::get('/activities/list', [AdminDeviceController::class, 'activities']);
    });
    
    // QR validation routes (for security personnel)
    Route::prefix('qr')->group(function () {
        Route::post('/validate', [QRController::class, 'validate']);
        Route::post('/deny', [QRController::class, 'deny']);
        Route::get('/{qrHash}', [QRController::class, 'getByHash']);
    });
    
    // Security personnel routes
    Route::prefix('security')->group(function () {
        Route::get('/statistics', [SecurityController::class, 'statistics']);
        Route::get('/activities', [SecurityController::class, 'activities']);
    });
});
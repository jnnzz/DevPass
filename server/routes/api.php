<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QRController;
use App\Http\Controllers\SecurityController;

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
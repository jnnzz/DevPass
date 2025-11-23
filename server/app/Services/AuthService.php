<?php

namespace App\Services;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Register a new student
     */
    public function register(array $data)
    {
        $student = Student::create([
            'id' => $data['id'],
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'department' => $data['department'] ?? null,
            'course' => $data['course'] ?? null,
            'year_of_study' => $data['year_of_study'] ?? null,
            'password' => $data['password'], // Will be auto-hashed by model
        ]);

        // Create authentication token
        $token = $student->createToken('auth-token')->plainTextToken;

        return [
            'user' => $student,
            'role' => 'student',
            'token' => $token
        ];
    }

    /**
     * Login - supports both Users (admin/security) and Students
     */
    public function login(array $credentials)
    {
        // Try to find a User (admin/security) by email first
        if (isset($credentials['email'])) {
            $user = User::where('email', $credentials['email'])->first();
            
            if ($user && Hash::check($credentials['password'], $user->password)) {
                $token = $user->createToken('auth-token')->plainTextToken;
                
                return [
                    'user' => $user,
                    'role' => $user->role,
                    'token' => $token
                ];
            }
        }
        
        // Try to find a Student by ID (students use ID, not email for login)
        if (isset($credentials['id'])) {
            $student = Student::where('id', $credentials['id'])->first();
            
            if ($student && Hash::check($credentials['password'], $student->password)) {
                $token = $student->createToken('auth-token')->plainTextToken;
                
                return [
                    'user' => $student,
                    'role' => 'student',
                    'token' => $token
                ];
            }
        }
        
        // If email was provided but user not found, also check students by email
        if (isset($credentials['email'])) {
            $student = Student::where('email', $credentials['email'])->first();
            
            if ($student && Hash::check($credentials['password'], $student->password)) {
                $token = $student->createToken('auth-token')->plainTextToken;
                
                return [
                    'user' => $student,
                    'role' => 'student',
                    'token' => $token
                ];
            }
        }

        // No matching credentials found
        throw ValidationException::withMessages([
            'credentials' => ['The provided credentials are incorrect.'],
        ]);
    }

    /**
     * Logout - works for both Users and Students
     */
    public function logout($user)
    {
        // Delete all tokens (logout from all devices)
        $user->tokens()->delete();

        // Or delete only current token:
        // $user->currentAccessToken()->delete();

        return ['message' => 'Logged out successfully'];
    }

    /**
     * Get authenticated user profile - works for both Users and Students
     */
    public function getProfile($user)
    {
        return $user;
    }
}
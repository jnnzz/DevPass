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
            'student' => $student,
            'token' => $token
        ];
    }

    /**
     * Login a student, admin, or security guard
     */
    public function login(array $credentials)
    {
        $identifier = $credentials['id']; // Can be student ID or email
        
        // Check if it's an email format (contains @)
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            // Try User model first (admin/security)
            $user = User::where('email', $identifier)->first();
            
            if ($user && Hash::check($credentials['password'], $user->password)) {
                $token = $user->createToken('auth-token')->plainTextToken;
                
                return [
                    'user' => $user,
                    'user_type' => 'admin', // or 'security' based on role
                    'role' => $user->role,
                    'token' => $token
                ];
            }
        }
        
        // Try Student model (by student ID)
        $student = Student::where('id', $identifier)->first();
        
        if ($student && Hash::check($credentials['password'], $student->password)) {
            $token = $student->createToken('auth-token')->plainTextToken;
            
            return [
                'student' => $student,
                'user_type' => 'student',
                'role' => 'student',
                'token' => $token
            ];
        }
        
        // If neither found, throw validation error
        throw ValidationException::withMessages([
            'id' => ['The provided credentials are incorrect.'],
        ]);
    }

    /**
     * Logout a student, admin, or security guard
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
     * Get authenticated user profile (student, admin, or security)
     */
    public function getProfile($user)
    {
        return $user;
    }
}
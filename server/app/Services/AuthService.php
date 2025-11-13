<?php

namespace App\Services;

use App\Models\Student;
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
     * Login a student
     */
    public function login(array $credentials)
    {
        // Find student by email
        $student = Student::where('id', $credentials['id'])->first();

        // Check if student exists and password is correct
        if (!$student || !Hash::check($credentials['password'], $student->password)) {
            throw ValidationException::withMessages([
                'id' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Delete old tokens (optional - for single device login)
        // $student->tokens()->delete();

        // Create new token
        $token = $student->createToken('auth-token')->plainTextToken;

        return [
            'student' => $student,
            'token' => $token
        ];
    }

    /**
     * Logout a student
     */
    public function logout(Student $student)
    {
        // Delete all tokens (logout from all devices)
        $student->tokens()->delete();

        // Or delete only current token:
        // $student->currentAccessToken()->delete();

        return ['message' => 'Logged out successfully'];
    }

    /**
     * Get authenticated student profile
     */
    public function getProfile(Student $student)
    {
        return $student;
    }
}
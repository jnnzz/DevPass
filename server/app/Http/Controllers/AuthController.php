<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register a new student
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|min:6|max:8|unique:students,id',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:students,email',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable|string|max:15',
            'department' => 'nullable|string|max:50',
            'course' => 'required|string|max:100',
            'year_of_study' => 'nullable|integer|min:1|max:10',
        ]);

        $result = $this->authService->register($validated);

        return response()->json([
            'message' => 'Registration successful',
            'student' => $result['student'],
            'token' => $result['token']
        ], 201);
    }

    /**
     * Login student, admin, or security guard
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'id' => 'required|string', // Can be student ID or email
            'password' => 'required|string',
        ]);

        $result = $this->authService->login($credentials);

        $response = [
            'message' => 'Login successful',
            'token' => $result['token'],
            'user_type' => $result['user_type'],
            'role' => $result['role'],
        ];

        // Include user or student based on type
        if ($result['user_type'] === 'student') {
            $response['student'] = $result['student'];
        } else {
            $response['user'] = $result['user'];
        }

        return response()->json($response);
    }

    /**
     * Logout student
     */
    public function logout(Request $request)
    {
        $result = $this->authService->logout($request->user());

        return response()->json($result);
    }

    /**
     * Get authenticated student profile
     */
    public function profile(Request $request)
    {
        $student = $this->authService->getProfile($request->user());

        return response()->json($student);
    }
}
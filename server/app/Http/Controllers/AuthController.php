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
            'id' => 'required|string|min:6|max:8',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:students,email',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable|string|max:15',
            'department' => 'nullable|string|max:50',
            'course' => 'nullable|string|max:100',
            'year_of_study' => 'nullable|integer',
        ]);

        $result = $this->authService->register($validated);

        return response()->json([
            'message' => 'Registration successful',
            'student' => $result['student'],
            'token' => $result['token']
        ], 201);
    }

    /**
     * Login student
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'id' => 'required|string',
            'password' => 'required|string',
        ]);

        $result = $this->authService->login($credentials);

        return response()->json([
            'message' => 'Login successful',
            'student' => $result['student'],
            'token' => $result['token']
        ]);
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
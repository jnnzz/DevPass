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
            'password' => 'required|string|min:6',
            'password_confirmation' => 'nullable|string|same:password',
            'phone' => 'nullable|string|max:15',
            'department' => 'nullable|string|max:50',
            'course' => 'nullable|string|max:100',
            'year_of_study' => 'nullable|integer',
        ]);

        // Remove password_confirmation from data as it's not stored
        unset($validated['password_confirmation']);

        $result = $this->authService->register($validated);

        return response()->json([
            'message' => 'Registration successful',
            'user' => $result['user'],
            'role' => $result['role'],
            'token' => $result['token']
        ], 201);
    }

    /**
     * Login - supports Students, Admin, and Security Personnel
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'id' => 'nullable|string', // For students
            'email' => 'nullable|email', // For admin/security or students
            'password' => 'required|string',
        ]);

        // Ensure either id or email is provided
        if (empty($credentials['id']) && empty($credentials['email'])) {
            return response()->json([
                'message' => 'Either id or email is required'
            ], 422);
        }

        $result = $this->authService->login($credentials);

        return response()->json([
            'message' => 'Login successful',
            'user' => $result['user'],
            'role' => $result['role'],
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
     * Get authenticated user profile (works for both Users and Students)
     */
    public function profile(Request $request)
    {
        // Get the authenticated user first
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }
        
        // Get the token to verify we're loading the correct model
        $token = $user->currentAccessToken();
        
        if (!$token) {
            return response()->json([
                'message' => 'Invalid token'
            ], 401);
        }
        
        // Ensure we're loading the correct model based on token's tokenable_type
        // This fixes cases where Sanctum might resolve to the wrong model
        if ($token->tokenable_type === 'App\\Models\\Student' && !($user instanceof \App\Models\Student)) {
            // Token is for Student but user is User model - reload the student
            $user = \App\Models\Student::find($token->tokenable_id);
        } elseif ($token->tokenable_type === 'App\\Models\\User' && !($user instanceof \App\Models\User)) {
            // Token is for User but user is Student model - reload the user
            $user = \App\Models\User::find($token->tokenable_id);
        }
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $profile = $this->authService->getProfile($user);

        return response()->json($profile);
    }
}
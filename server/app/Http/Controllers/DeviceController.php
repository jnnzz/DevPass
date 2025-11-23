<?php

namespace App\Http\Controllers;

use App\Services\DeviceService;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class DeviceController extends Controller
{
    protected $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    /**
     * Get all devices for authenticated student
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Check if user is authenticated
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated. Please login first.'
            ], 401);
        }
        
        // Check if the authenticated user is a Student
        $isStudent = ($user instanceof \App\Models\Student) 
                  || ($user->getTable() === 'students');
        
        if (!$isStudent) {
            return response()->json([
                'message' => 'Unauthorized. Only students can view devices.'
            ], 403);
        }
        
        $devices = $this->deviceService->getStudentDevices($user->getKey());

        return response()->json($devices);
    }

    /**
     * Register a new device
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'device_type' => 'required|string|in:Laptop,Desktop,Tablet,Mobile',
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'serial_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
            'proof_of_ownership' => 'nullable|string',
        ]);

        $user = $request->user();
        
        // Check if user is authenticated
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated. Please login first.'
            ], 401);
        }
        
        // Try to manually resolve Student from token if needed
        $student = $user;
        if (!($user instanceof Student) && $user->getTable() !== 'students') {
            // Try to get the Student from the token
            $token = $request->bearerToken();
            if ($token) {
                $accessToken = PersonalAccessToken::findToken($token);
                if ($accessToken && $accessToken->tokenable_type === Student::class) {
                    $student = Student::find($accessToken->tokenable_id);
                }
            }
        }
        
        // Check if we have a valid Student
        if (!($student instanceof Student) && $student->getTable() !== 'students') {
            return response()->json([
                'message' => 'Unauthorized. Only students can register devices.',
                'debug' => [
                    'user_class' => get_class($user),
                    'table' => $user->getTable(),
                    'tokenable_type' => $request->bearerToken() ? (PersonalAccessToken::findToken($request->bearerToken())->tokenable_type ?? 'unknown') : 'no token'
                ]
            ], 403);
        }
        
        // Get student ID - use getKey() which works with any primary key name
        $studentId = $student->getKey();
        
        if (empty($studentId)) {
            return response()->json([
                'message' => 'Invalid student ID. Please login again.'
            ], 400);
        }
        
        try {
            $device = $this->deviceService->registerDevice($validated, $studentId);
            
            return response()->json([
                'message' => 'Device registered successfully. Waiting for approval.',
                'device' => $device
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get specific device
     */
    public function show(string $id, Request $request)
    {
        $user = $request->user();
        if (!$user || $user->getTable() !== 'students') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $device = $this->deviceService->getDeviceById($id, $user->getKey());

        if (!$device) {
            return response()->json(['message' => 'Device not found'], 404);
        }

        return response()->json($device);
    }

    /**
     * Update device (limited fields)
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'brand' => 'sometimes|string|max:100',
            'model' => 'sometimes|string|max:100',
            'serial_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        if (!$user || $user->getTable() !== 'students') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $device = $this->deviceService->getDeviceById($id, $user->getKey());

        if (!$device) {
            return response()->json(['message' => 'Device not found'], 404);
        }

        // Only allow updates to pending devices
        if ($device->status !== 'pending') {
            return response()->json(['message' => 'Can only update pending devices'], 403);
        }

        $device->update($validated);

        return response()->json([
            'message' => 'Device updated successfully',
            'device' => $device->fresh()
        ]);
    }

    /**
     * Delete device (only if pending or rejected)
     */
    public function destroy(string $id, Request $request)
    {
        $user = $request->user();
        if (!$user || $user->getTable() !== 'students') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $device = $this->deviceService->getDeviceById($id, $user->getKey());

        if (!$device) {
            return response()->json(['message' => 'Device not found'], 404);
        }

        // Only allow deletion of pending or rejected devices
        if (!in_array($device->status, ['pending', 'rejected'])) {
            return response()->json(['message' => 'Can only delete pending or rejected devices'], 403);
        }

        $device->delete();

        return response()->json(['message' => 'Device deleted successfully']);
    }

    /**
     * Generate QR code for approved device
     */
    public function generateQR(string $id, Request $request)
    {
        $user = $request->user();
        if (!$user || $user->getTable() !== 'students') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        try {
            $device = $this->deviceService->generateQR($id, $user->getKey());
            
            return response()->json([
                'message' => 'QR code generated successfully',
                'device' => $device,
                'qr_hash' => $device->qr_hash,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Renew device QR code
     */
    public function renew(string $id, Request $request)
    {
        $user = $request->user();
        if (!$user || $user->getTable() !== 'students') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        try {
            $device = $this->deviceService->renewDevice($id, $user->getKey());
            
            return response()->json([
                'message' => 'Device QR code renewed successfully',
                'device' => $device,
                'qr_hash' => $device->qr_hash,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get recent activities for authenticated student
     */
    public function activities(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->getTable() !== 'students') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $activities = $this->deviceService->getStudentActivities($user->getKey());

        return response()->json($activities);
    }
}

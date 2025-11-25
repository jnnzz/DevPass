<?php

namespace App\Http\Controllers;

use App\Services\DeviceService;
use Illuminate\Http\Request;

class AdminDeviceController extends Controller
{
    protected $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }
    
    /**
     * Check if user is admin before any action
     */
    private function checkAdmin($request)
    {
        $user = $request->user();
        
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }
        
        return null;
    }

    /**
     * Get all devices (with filters)
     */
    public function index(Request $request)
    {
        try {
            // Check admin access
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $filters = [
                'status' => $request->query('status'),
                'student_id' => $request->query('student_id'),
                'search' => $request->query('search'),
            ];

            // Remove null filters
            $filters = array_filter($filters, function($value) {
                return $value !== null && $value !== '';
            });

            $devices = $this->deviceService->getAllDevices($filters);

            return response()->json($devices);
        } catch (\Exception $e) {
            \Log::error('Error getting devices: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Error loading devices: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific device
     */
    public function show(string $id, Request $request)
    {
        try {
            // Check admin access
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $device = $this->deviceService->getDeviceById($id);
            
            if (!$device) {
                return response()->json(['message' => 'Device not found'], 404);
            }

            $device->load(['student', 'activities']);

            return response()->json($device);
        } catch (\Exception $e) {
            \Log::error('Error getting device: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error loading device: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve device
     */
    public function approve(string $id, Request $request)
    {
        try {
            // Check admin access
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $device = $this->deviceService->approveDevice($id, $request->user()->id);
            
            return response()->json([
                'message' => 'Device approved successfully',
                'device' => $device
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Reject device
     */
    public function reject(string $id, Request $request)
    {
        try {
            // Check admin access
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $validated = $request->validate([
                'reason' => 'nullable|string|max:500',
            ]);

            $device = $this->deviceService->rejectDevice($id, $validated['reason'] ?? null, $request->user()->id);
            
            return response()->json([
                'message' => 'Device rejected successfully',
                'device' => $device
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get statistics for dashboard
     */
    public function statistics(Request $request)
    {
        try {
            // Check admin access
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $stats = $this->deviceService->getStatistics();

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error getting statistics: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Error loading statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all activities
     */
    public function activities(Request $request)
    {
        try {
            // Check admin access
            $adminCheck = $this->checkAdmin($request);
            if ($adminCheck) {
                return $adminCheck;
            }
            
            $limit = $request->query('limit', 50);
            $activities = $this->deviceService->getAllActivities($limit);

            return response()->json($activities);
        } catch (\Exception $e) {
            \Log::error('Error getting activities: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Error loading activities: ' . $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Services\DeviceService;
use Illuminate\Http\Request;

class SecurityController extends Controller
{
    protected $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    /**
     * Check if user is security personnel
     */
    private function checkSecurity($request)
    {
        $user = $request->user();
        
        if (!$user || $user->role !== 'security') {
            return response()->json(['message' => 'Unauthorized. Security access required.'], 403);
        }
        
        return null;
    }

    /**
     * Get statistics for security personnel
     */
    public function statistics(Request $request)
    {
        try {
            // Check security access
            $securityCheck = $this->checkSecurity($request);
            if ($securityCheck) {
                return $securityCheck;
            }
            
            $gateName = $request->query('gate_name');
            $stats = $this->deviceService->getSecurityStatistics($gateName);

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error getting security statistics: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error loading statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities/scans for security personnel
     */
    public function activities(Request $request)
    {
        try {
            // Check security access
            $securityCheck = $this->checkSecurity($request);
            if ($securityCheck) {
                return $securityCheck;
            }
            
            $limit = $request->query('limit', 50);
            $gateName = $request->query('gate_name');
            $activities = $this->deviceService->getSecurityActivities($limit, $gateName);

            return response()->json($activities);
        } catch (\Exception $e) {
            \Log::error('Error getting security activities: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error loading activities: ' . $e->getMessage()
            ], 500);
        }
    }
}


<?php

namespace App\Http\Controllers;

use App\Services\DeviceService;
use Illuminate\Http\Request;

class QRController extends Controller
{
    protected $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    /**
     * Check if user is security or admin
     */
    private function checkSecurityOrAdmin($request)
    {
        $user = $request->user();
        
        if (!$user || !in_array($user->role, ['admin', 'security'])) {
            return response()->json(['message' => 'Unauthorized. Security or admin access required.'], 403);
        }
        
        return null;
    }

    /**
     * Validate QR code (scan) - accepts either QR hash or JSON data
     */
    public function validate(Request $request)
    {
        // Check security or admin access
        $accessCheck = $this->checkSecurityOrAdmin($request);
        if ($accessCheck) {
            return $accessCheck;
        }

        $validated = $request->validate([
            'qr_data' => 'required|string', // Can be hash or JSON string
            'gate_name' => 'nullable|string|max:100',
        ]);

        $result = $this->deviceService->validateQR(
            $validated['qr_data'], 
            $validated['gate_name'] ?? null
        );

        $statusCode = $result['valid'] ? 200 : 400;

        return response()->json($result, $statusCode);
    }

    /**
     * Get device by QR hash (for validation preview) - accepts hash or JSON data
     */
    public function getByHash(string $qrData, Request $request)
    {
        // Check security or admin access
        $accessCheck = $this->checkSecurityOrAdmin($request);
        if ($accessCheck) {
            return $accessCheck;
        }

        $result = $this->deviceService->validateQR($qrData);
        
        if (!$result['valid']) {
            return response()->json([
                'message' => $result['message'],
                'device' => $result['device'] ?? null,
                'student_data' => $result['student_data'] ?? null,
            ], 404);
        }

        return response()->json([
            'device' => $result['device'],
            'student' => $result['student'],
            'student_data' => $result['student_data'],
            'valid' => true
        ]);
    }

    /**
     * Public QR code reader - no authentication required
     * Returns student and device data when QR code is scanned
     */
    public function readPublic(Request $request)
    {
        $validated = $request->validate([
            'qr_data' => 'required|string', // QR hash string
        ]);

        // Use the same validation logic but don't log activity (read-only)
        $result = $this->deviceService->readQR($validated['qr_data']);

        if (!$result['valid']) {
            return response()->json([
                'valid' => false,
                'message' => $result['message'],
            ], 404);
        }

        return response()->json([
            'valid' => true,
            'message' => 'QR code read successfully',
            'device' => $result['device'],
            'student' => $result['student'],
            'student_data' => $result['student_data'],
        ]);
    }

    /**
     * Deny access manually (security decision)
     */
    public function deny(Request $request)
    {
        // Check security or admin access
        $accessCheck = $this->checkSecurityOrAdmin($request);
        if ($accessCheck) {
            return $accessCheck;
        }

        $validated = $request->validate([
            'qr_data' => 'required|string',
            'gate_name' => 'nullable|string|max:100',
        ]);

        $result = $this->deviceService->denyAccess(
            $validated['qr_data'], 
            $validated['gate_name'] ?? null
        );

        return response()->json($result, 200);
    }
}

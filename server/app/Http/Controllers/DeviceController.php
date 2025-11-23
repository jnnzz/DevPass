<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DeviceController extends Controller
{
    /**
     * Register a new device for authenticated student
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'device_type' => 'required|string|in:Laptop,Desktop,Tablet,Mobile',
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'serial_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get authenticated student
        $student = $request->user();

        // Check if user is a student
        if (!($student instanceof Student)) {
            return response()->json([
                'message' => 'Only students can register devices'
            ], 403);
        }

        // Create device with pending status
        $device = Device::create([
            'student_id' => $student->pkStudentID,
            'device_type' => $request->device_type,
            'brand' => $request->brand,
            'model' => $request->model,
            'serial_number' => $request->serial_number,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Device registration submitted successfully. Waiting for admin approval.',
            'device' => $device->load('student:id,name,email,department,course')
        ], 201);
    }

    /**
     * Get devices for authenticated student
     */
    public function index(Request $request)
    {
        $student = $request->user();

        // Check if user is a student
        if (!($student instanceof Student)) {
            return response()->json([
                'message' => 'Only students can view their devices'
            ], 403);
        }

        $devices = Device::where('student_id', $student->pkStudentID)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($devices, 200);
    }

    /**
     * Get single device by ID
     */
    public function show(Request $request, $id)
    {
        $student = $request->user();

        if (!($student instanceof Student)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $device = Device::where('id', $id)
            ->where('student_id', $student->pkStudentID)
            ->first();

        if (!$device) {
            return response()->json([
                'message' => 'Device not found'
            ], 404);
        }

        return response()->json($device->load('student'), 200);
    }

    /**
     * Get scan activity for authenticated student
     */
    public function getScanActivity(Request $request)
    {
        $student = $request->user();

        if (!($student instanceof Student)) {
            return response()->json([
                'message' => 'Only students can view their scan activity'
            ], 403);
        }

        try {
            $scans = DB::table('device_scans')
                ->join('devices', 'device_scans.device_id', '=', 'devices.id')
                ->where('devices.student_id', $student->pkStudentID)
                ->select(
                    'device_scans.id',
                    'device_scans.gate_name',
                    'device_scans.status',
                    'device_scans.created_at as scan_time',
                    'devices.brand',
                    'devices.model',
                    'devices.device_type'
                )
                ->orderBy('device_scans.created_at', 'desc')
                ->limit(50)
                ->get();

            return response()->json($scans, 200);
        } catch (\Exception $e) {
            // Return empty array if table doesn't exist
            return response()->json([], 200);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\Student;
use App\Models\EntryLog;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DeviceController extends Controller
{
    protected $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
    }

    /**
     * Get all devices with student information (for admin) or student's own devices (for students)
     */
    public function index(Request $request)
    {
        $status = $request->query('status'); // pending, active, all
        $user = $request->user();
        
        $query = Device::with(['student', 'admin', 'qrCodes']);
        
        // If user is a student (not admin), only show their own devices
        if ($user && isset($user->id)) {
            // Check if user is admin by course or email
            $isAdmin = false;
            if (isset($user->course)) {
                $isAdmin = strtolower($user->course) === 'admin';
            }
            if (!$isAdmin && isset($user->email)) {
                $isAdmin = str_contains(strtolower($user->email), 'admin@devpass');
            }
            
            // If not admin, filter by student_id
            if (!$isAdmin) {
                $query->where('student_id', $user->id);
            }
        }
        
        if ($status && $status !== 'all') {
            $query->where('registration_status', $status);
        }
        
        $devices = $query->orderBy('registration_date', 'desc')->get();
        
        // Format response for frontend
        $formatted = $devices->map(function ($device) {
            $latestQR = $device->qrCodes()->where('is_active', true)->latest('expires_at')->first();
            
            // Get last scanned timestamp from entry_log
            $lastScanned = null;
            if ($latestQR) {
                $lastEntry = EntryLog::where('qr_code_hash', $latestQR->qr_code_hash)
                    ->where('status', 'success')
                    ->latest('scan_timestamp')
                    ->first();
                
                if ($lastEntry && $lastEntry->scan_timestamp) {
                    $lastScanned = $lastEntry->scan_timestamp->format('M d, Y h:i A');
                }
            }
            
            return [
                'id' => $device->device_id,
                'studentName' => $device->student->name ?? 'Unknown',
                'studentId' => $device->student->id ?? 'N/A',
                // 'department' => $device->student->department ?? 'N/A',
                'course' => $device->student->course ?? 'N/A',
                'type' => $device->device_type,
                'brand' => $device->brand,
                'model' => $device->model,
                'serialNumber' => $device->serial_number,
                'status' => $device->registration_status,
                'registrationDate' => $device->registration_date ? $device->registration_date->format('Y-m-d') : null,
                'qrExpiry' => $latestQR && $latestQR->expires_at ? $latestQR->expires_at->format('Y-m-d') : null,
                'qrCodeHash' => $latestQR ? $latestQR->qr_code_hash : null,
                'lastScanned' => $lastScanned,
            ];
        });
        
        return response()->json($formatted);
    }

    /**
     * Get device statistics
     */
    public function stats()
    {
        $total = Device::count();
        $pending = Device::where('registration_status', 'pending')->count();
        $active = Device::where('registration_status', 'active')->count();
        
        return response()->json([
            'total' => $total,
            'pending' => $pending,
            'active' => $active,
        ]);
    }

    /**
     * Approve a device
     */
    public function approve($id)
    {
        $device = Device::findOrFail($id);
        $user = Auth::user();
        
        // Check if user is admin
        $isAdmin = false;
        if (isset($user->course)) {
            $isAdmin = strtolower($user->course) === 'admin';
        }
        if (!$isAdmin && isset($user->email)) {
            $isAdmin = str_contains(strtolower($user->email), 'admin@devpass');
        }
        
        if (!$isAdmin) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }
        
        // Get admin ID from admins table if exists, otherwise use user's pkStudentID
        $adminId = null;
        if (isset($user->pkStudentID)) {
            // Try to find admin by email or create one
            $admin = \App\Models\Admin::where('email', $user->email)->first();
            if ($admin) {
                $adminId = $admin->admin_id;
            }
        }
        
        $device->registration_status = 'active';
        $device->approved_by = $adminId;
        $device->approved_at = Carbon::now();
        $device->save();
        
        // Create QR code for the device
        $qrCode = $this->qrCodeService->createQRCode([
            'device_id' => $device->device_id,
            'expires_at' => Carbon::now()->addMonth(),
            'is_active' => true,
        ]);
        
        return response()->json([
            'message' => 'Device approved successfully',
            'device' => $device,
            'qr_code' => $qrCode
        ]);
    }

    /**
     * Reject a device
     */
    public function reject($id)
    {
        $device = Device::findOrFail($id);
        $user = Auth::user();
        
        // Check if user is admin
        $isAdmin = false;
        if (isset($user->course)) {
            $isAdmin = strtolower($user->course) === 'admin';
        }
        if (!$isAdmin && isset($user->email)) {
            $isAdmin = str_contains(strtolower($user->email), 'admin@devpass');
        }
        
        if (!$isAdmin) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }
        
        $device->registration_status = 'rejected';
        $device->save();
        
        return response()->json([
            'message' => 'Device rejected successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'device_type' => 'required|string|max:50',
            'brand' => 'nullable|string|max:50',
            'model' => 'nullable|string|max:100',
            'serial_number' => 'nullable|string|max:100',
            'processor' => 'nullable|string|max:100',
            'motherboard' => 'nullable|string|max:100',
            'memory' => 'nullable|string|max:50',
            'harddrive' => 'nullable|string|max:100',
            'monitor' => 'nullable|string|max:100',
            'casing' => 'nullable|string|max:100',
            'cd_dvd_rom' => 'nullable|string|max:50',
            'operating_system' => 'nullable|string|max:100',
            'model_number' => 'nullable|string|max:100',
            'mac_address' => 'nullable|string|max:17',
        ]);

        $student = $request->user();
        
        $device = Device::create([
            'student_id' => $student->id,
            'device_type' => $validated['device_type'],
            'brand' => $validated['brand'] ?? null,
            'model' => $validated['model'] ?? null,
            'serial_number' => $validated['serial_number'] ?? null,
            'processor' => $validated['processor'] ?? null,
            'motherboard' => $validated['motherboard'] ?? null,
            'memory' => $validated['memory'] ?? null,
            'harddrive' => $validated['harddrive'] ?? null,
            'monitor' => $validated['monitor'] ?? null,
            'casing' => $validated['casing'] ?? null,
            'cd_dvd_rom' => $validated['cd_dvd_rom'] ?? null,
            'operating_system' => $validated['operating_system'] ?? null,
            'model_number' => $validated['model_number'] ?? null,
            'mac_address' => $validated['mac_address'] ?? null,
            'registration_date' => Carbon::now(),
            'registration_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Device registered successfully',
            'device' => $device
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $device = Device::with(['student', 'admin', 'qrCodes'])->findOrFail($id);
        $latestQR = $device->qrCodes()->where('is_active', true)->latest('expires_at')->first();
        
        return response()->json([
            'id' => $device->device_id,
            'studentName' => $device->student->name ?? 'Unknown',
            'studentId' => $device->student->id ?? 'N/A',
            // 'department' => $device->student->department ?? 'N/A',
            'course' => $device->student->course ?? 'N/A',
            'type' => $device->device_type,
            'brand' => $device->brand,
            'model' => $device->model,
            'serialNumber' => $device->serial_number,
            'status' => $device->registration_status,
            'registrationDate' => $device->registration_date ? $device->registration_date->format('Y-m-d') : null,
            'qrExpiry' => $latestQR && $latestQR->expires_at ? $latestQR->expires_at->format('Y-m-d') : null,
        ]);
    }
}

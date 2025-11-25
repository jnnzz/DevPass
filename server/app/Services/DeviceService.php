<?php

namespace App\Services;

use App\Models\Device;
use App\Models\Activity;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DeviceService
{
    /**
     * Get all devices for a student
     */
    public function getStudentDevices($studentId)
    {
        return Device::where('student_id', $studentId)
            ->with(['activities', 'student'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get device by ID (for specific student)
     */
    public function getDeviceById($deviceId, $studentId = null)
    {
        $query = Device::with('activities')->where('id', $deviceId);
        
        if ($studentId) {
            $query->where('student_id', $studentId);
        }
        
        return $query->first();
    }

    /**
     * Register a new device
     */
    public function registerDevice(array $data, $studentId)
    {
        $device = Device::create([
            'student_id' => $studentId,
            'device_type' => $data['device_type'],
            'brand' => $data['brand'],
            'model' => $data['model'],
            'serial_number' => $data['serial_number'] ?? null,
            'status' => 'pending', // Always start as pending
            'notes' => $data['notes'] ?? null,
            'proof_of_ownership' => $data['proof_of_ownership'] ?? null,
        ]);

        // Load the student relationship to ensure it's available
        return $device->load('student');
    }

    /**
     * Generate QR code for approved device
     */
    public function generateQR($deviceId, $studentId = null)
    {
        $device = $this->getDeviceById($deviceId, $studentId);
        
        if (!$device) {
            throw new \Exception('Device not found');
        }

        if ($device->status !== 'active') {
            throw new \Exception('Device must be approved before generating QR code');
        }

        // Load student relationship
        $device->load('student');
        
        // Generate unique QR hash
        $qrHash = $this->generateUniqueQrHash();
        
        // Set expiration date (e.g., 1 year from now)
        $expiresAt = Carbon::now()->addYear();

        $device->update([
            'qr_hash' => $qrHash,
            'qr_expires_at' => $expiresAt,
        ]);

        return $device->fresh()->load('student');
    }
    
    /**
     * Get QR code data (just the hash)
     */
    public function getQRCodeData($deviceId)
    {
        $device = Device::find($deviceId);
        
        if (!$device || !$device->qr_hash) {
            return null;
        }
        
        // Return just the hash string
        return $device->qr_hash;
    }

    /**
     * Renew device QR code
     */
    public function renewDevice($deviceId, $studentId = null)
    {
        $device = $this->getDeviceById($deviceId, $studentId);
        
        if (!$device) {
            throw new \Exception('Device not found');
        }

        if ($device->status !== 'active') {
            throw new \Exception('Only active devices can be renewed');
        }

        // Generate new QR hash
        $qrHash = $this->generateUniqueQrHash();
        
        // Set new expiration date
        $expiresAt = Carbon::now()->addYear();

        $device->update([
            'qr_hash' => $qrHash,
            'qr_expires_at' => $expiresAt,
        ]);

        return $device->fresh();
    }

    /**
     * Update last scanned timestamp
     */
    public function updateLastScanned($deviceId)
    {
        $device = Device::find($deviceId);
        
        if ($device) {
            $device->update([
                'last_scanned_at' => Carbon::now(),
            ]);
        }

        return $device;
    }

    /**
     * Create activity log
     */
    public function logActivity(array $data)
    {
        try {
            // Only create activity if device_id and student_id are provided (not null)
            if (isset($data['device_id']) && isset($data['student_id']) && 
                $data['device_id'] !== null && $data['student_id'] !== null) {
                return Activity::create([
                    'device_id' => $data['device_id'],
                    'student_id' => $data['student_id'],
                    'gate_name' => $data['gate_name'] ?? null,
                    'status' => $data['status'],
                    'message' => $data['message'] ?? null,
                    'scanned_at' => $data['scanned_at'] ?? Carbon::now(),
                ]);
            }
            // If device_id or student_id is null, don't create activity
            return null;
        } catch (\Exception $e) {
            \Log::error('Failed to log activity: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get recent activities for a student
     */
    public function getStudentActivities($studentId, $limit = 20)
    {
        return Activity::where('student_id', $studentId)
            ->with('device')
            ->orderBy('scanned_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Generate unique QR hash
     */
    private function generateUniqueQrHash(): string
    {
        do {
            $hash = Str::random(32); // Generate a random 32-character hash
        } while (Device::where('qr_hash', $hash)->exists());

        return $hash;
    }

    /**
     * Read QR code (public access, no activity logging)
     */
    public function readQR($qrData)
    {
        // QR code contains just the hash string
        $qrHash = $qrData;
        
        if (!$qrHash) {
            return [
                'valid' => false,
                'message' => 'Invalid QR code format',
            ];
        }
        
        // Look up device by hash and eagerly load student relationship
        $device = Device::with('student')->where('qr_hash', $qrHash)->first();
        
        if (!$device) {
            return [
                'valid' => false,
                'message' => 'QR code is not from the DevPass system. This QR code is not registered in our database.',
            ];
        }

        // Check if device is active
        if ($device->status !== 'active') {
            return [
                'valid' => false,
                'message' => 'Device is not active',
                'device' => $device->load('student'),
            ];
        }

        // Check if QR is expired
        if ($device->isQrExpired()) {
            return [
                'valid' => false,
                'message' => 'QR code has expired',
                'device' => $device->load('student'),
            ];
        }

        // Load student relationship with all fields
        $device->load('student');
        
        if (!$device->student) {
            return [
                'valid' => false,
                'message' => 'Student information not found',
            ];
        }
        
        // Return complete student and device data (read-only, no logging)
        return [
            'valid' => true,
            'message' => 'QR code read successfully',
            'qr_hash' => $device->qr_hash, // Include hash for accept/deny actions
            'device' => [
                'id' => $device->id,
                'brand' => $device->brand,
                'model' => $device->model,
                'device_type' => $device->device_type,
                'serial_number' => $device->serial_number,
                'qr_hash' => $device->qr_hash,
                'qr_expires_at' => $device->qr_expires_at ? $device->qr_expires_at->toIso8601String() : null,
                'last_scanned_at' => $device->last_scanned_at ? $device->last_scanned_at->toIso8601String() : null,
            ],
            'student' => $device->student,
            'student_data' => [
                'student_id' => $device->student->id,
                'student_name' => $device->student->name,
                'student_email' => $device->student->email,
                'student_department' => $device->student->department,
                'student_course' => $device->student->course,
                'student_phone' => $device->student->phone,
                'year_of_study' => $device->student->year_of_study,
            ],
        ];
    }

    /**
     * Deny access manually (security decision)
     */
    public function denyAccess($qrData, $gateName = null)
    {
        try {
            // QR code contains just the hash string
            $qrHash = trim($qrData);
            
            if (!$qrHash) {
                return [
                    'valid' => false,
                    'message' => 'Invalid QR code format',
                ];
            }
            
            // Look up device by hash
            $device = Device::with('student')->where('qr_hash', $qrHash)->first();
            
            if (!$device) {
                return [
                    'valid' => false,
                    'message' => 'QR code is not from the DevPass system. This QR code is not registered in our database.',
                ];
            }

            // Log denied access (only if device exists)
            try {
                $this->logActivity([
                    'device_id' => $device->id,
                    'student_id' => $device->student_id,
                    'gate_name' => $gateName,
                    'status' => 'denied',
                    'message' => 'Access denied by security personnel',
                ]);
            } catch (\Exception $e) {
                \Log::error('Failed to log deny activity: ' . $e->getMessage());
                // Continue even if logging fails
            }

            return [
                'valid' => false,
                'message' => 'Access denied',
                'success' => true, // Indicate the deny was processed successfully
                'device' => $device->load('student'),
            ];
        } catch (\Exception $e) {
            \Log::error('Error in denyAccess: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return [
                'valid' => false,
                'message' => 'Failed to process denial: ' . $e->getMessage(),
                'success' => false,
            ];
        }
    }

    /**
     * Validate QR code - accepts QR hash string
     */
    public function validateQR($qrData, $gateName = null)
    {
        // QR code contains just the hash string
        $qrHash = $qrData;
        
        if (!$qrHash) {
            // Log failed validation attempt
            $this->logActivity([
                'device_id' => null,
                'student_id' => null,
                'gate_name' => $gateName,
                'status' => 'denied',
                'message' => 'Invalid QR code format',
            ]);

            return [
                'valid' => false,
                'message' => 'Invalid QR code format',
            ];
        }
        
        // Look up device by hash and eagerly load student relationship
        $device = Device::with('student')->where('qr_hash', $qrHash)->first();
        
        if (!$device) {
            // Log failed validation attempt
            $this->logActivity([
                'device_id' => null,
                'student_id' => null,
                'gate_name' => $gateName,
                'status' => 'denied',
                'message' => 'QR code is not from the DevPass system',
            ]);

            return [
                'valid' => false,
                'message' => 'QR code is not from the DevPass system. This QR code is not registered in our database.',
            ];
        }

        if ($device->status !== 'active') {
            // Log denied access
            $this->logActivity([
                'device_id' => $device->id,
                'student_id' => $device->student_id,
                'gate_name' => $gateName,
                'status' => 'denied',
                'message' => 'Device is not active',
            ]);

            return [
                'valid' => false,
                'message' => 'Device is not active',
                'device' => $device->load('student'),
            ];
        }

        if ($device->isQrExpired()) {
            // Log expired QR
            $this->logActivity([
                'device_id' => $device->id,
                'student_id' => $device->student_id,
                'gate_name' => $gateName,
                'status' => 'denied',
                'message' => 'QR code has expired',
            ]);

            return [
                'valid' => false,
                'message' => 'QR code has expired',
                'device' => $device->load('student'),
            ];
        }

        // Update last scanned
        $this->updateLastScanned($device->id);

        // Log successful activity
        $this->logActivity([
            'device_id' => $device->id,
            'student_id' => $device->student_id,
            'gate_name' => $gateName,
            'status' => 'success',
            'message' => 'QR code validated successfully',
        ]);

        // Load student relationship with all fields
        $device->load('student');
        
        if (!$device->student) {
            return [
                'valid' => false,
                'message' => 'Student information not found',
            ];
        }
        
        // Return complete student and device data
        return [
            'valid' => true,
            'message' => 'Access granted',
            'device' => [
                'id' => $device->id,
                'brand' => $device->brand,
                'model' => $device->model,
                'device_type' => $device->device_type,
                'serial_number' => $device->serial_number,
                'qr_expires_at' => $device->qr_expires_at ? $device->qr_expires_at->toIso8601String() : null,
                'last_scanned_at' => $device->last_scanned_at ? $device->last_scanned_at->toIso8601String() : null,
            ],
            'student' => $device->student,
            'student_data' => [
                'student_id' => $device->student->id,
                'student_name' => $device->student->name,
                'student_email' => $device->student->email,
                'student_department' => $device->student->department,
                'student_course' => $device->student->course,
                'student_phone' => $device->student->phone,
                'year_of_study' => $device->student->year_of_study,
            ],
        ];
    }

    /**
     * Get all devices (for admin)
     */
    public function getAllDevices($filters = [])
    {
        try {
            $query = Device::with(['student', 'activities'])
                ->orderBy('created_at', 'desc');

            // Filter by device ID
            if (isset($filters['device_id'])) {
                $query->where('id', $filters['device_id']);
            }

            // Filter by status (skip if 'all')
            if (isset($filters['status']) && $filters['status'] !== 'all') {
                $query->where('status', $filters['status']);
            }

            // Filter by student ID
            if (isset($filters['student_id'])) {
                $query->where('student_id', $filters['student_id']);
            }

            // Search by student name or device info
            if (isset($filters['search'])) {
                $search = $filters['search'];
                $query->where(function($q) use ($search) {
                    $q->where('brand', 'like', "%{$search}%")
                      ->orWhere('model', 'like', "%{$search}%")
                      ->orWhere('serial_number', 'like', "%{$search}%")
                      ->orWhereHas('student', function($studentQuery) use ($search) {
                          $studentQuery->where('name', 'like', "%{$search}%")
                                       ->orWhere('id', 'like', "%{$search}%")
                                       ->orWhere('email', 'like', "%{$search}%");
                      });
                });
            }

            return $query->get();
        } catch (\Exception $e) {
            \Log::error('Error in getAllDevices: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Approve device (admin only)
     */
    public function approveDevice($deviceId, $adminId = null)
    {
        $device = Device::find($deviceId);
        
        if (!$device) {
            throw new \Exception('Device not found');
        }

        if ($device->status !== 'pending') {
            throw new \Exception('Only pending devices can be approved');
        }

        // Update device status
        $device->update([
            'status' => 'active',
            'approved_at' => Carbon::now(),
            'rejected_at' => null,
            'rejection_reason' => null,
        ]);

        // Automatically generate QR code when approved
        try {
            $this->generateQR($deviceId);
        } catch (\Exception $e) {
            // Log error but don't fail the approval
            \Log::error('Failed to generate QR code after approval: ' . $e->getMessage());
        }

        return $device->fresh()->load('student');
    }

    /**
     * Reject device (admin only)
     */
    public function rejectDevice($deviceId, $reason = null, $adminId = null)
    {
        $device = Device::find($deviceId);
        
        if (!$device) {
            throw new \Exception('Device not found');
        }

        if ($device->status !== 'pending') {
            throw new \Exception('Only pending devices can be rejected');
        }

        // Update device status
        $device->update([
            'status' => 'rejected',
            'rejected_at' => Carbon::now(),
            'rejection_reason' => $reason,
            'approved_at' => null,
        ]);

        return $device->fresh()->load('student');
    }

    /**
     * Get device statistics (for admin dashboard)
     */
    public function getStatistics()
    {
        try {
            return [
                'total' => Device::count(),
                'pending' => Device::where('status', 'pending')->count(),
                'active' => Device::where('status', 'active')->count(),
                'rejected' => Device::where('status', 'rejected')->count(),
                'expired' => Device::where('status', 'expired')->count(),
                'scansToday' => Activity::whereDate('scanned_at', Carbon::today())
                    ->where('status', 'success')
                    ->count(),
            ];
        } catch (\Exception $e) {
            \Log::error('Error getting statistics: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get all activities (for admin)
     */
    public function getAllActivities($limit = 50)
    {
        try {
            // Use left join to handle cases where device or student might be null
            return Activity::with(['device', 'student'])
                ->orderBy('scanned_at', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();
        } catch (\Exception $e) {
            \Log::error('Error in getAllActivities: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Get statistics for security personnel (filtered by gate if provided)
     */
    public function getSecurityStatistics($gateName = null)
    {
        try {
            $query = Activity::query();
            
            // Filter by gate if provided
            if ($gateName) {
                $query->where('gate_name', $gateName);
            }
            
            $todayQuery = clone $query;
            $lastHourQuery = clone $query;
            
            // Today's scans
            $scansToday = (clone $todayQuery)
                ->whereDate('scanned_at', Carbon::today())
                ->count();
            
            // Successful scans today
            $successToday = (clone $todayQuery)
                ->whereDate('scanned_at', Carbon::today())
                ->where('status', 'success')
                ->count();
            
            // Last hour scans
            $lastHour = (clone $lastHourQuery)
                ->where('scanned_at', '>=', Carbon::now()->subHour())
                ->count();
            
            // Calculate success rate
            $successRate = $scansToday > 0 
                ? round(($successToday / $scansToday) * 100) 
                : 0;

            return [
                'scansToday' => $scansToday,
                'successRate' => $successRate,
                'lastHour' => $lastHour,
            ];
        } catch (\Exception $e) {
            \Log::error('Error getting security statistics: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get activities for security personnel (filtered by gate if provided)
     */
    public function getSecurityActivities($limit = 50, $gateName = null)
    {
        try {
            $query = Activity::with(['device', 'student'])
                ->whereIn('status', ['success', 'failed', 'denied', 'expired']) // Only granted (success) and denied
                ->orderBy('scanned_at', 'desc')
                ->orderBy('created_at', 'desc');
            
            // Filter by gate if provided
            if ($gateName) {
                $query->where('gate_name', $gateName);
            }
            
            return $query->limit($limit)->get();
        } catch (\Exception $e) {
            \Log::error('Error in getSecurityActivities: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }
}


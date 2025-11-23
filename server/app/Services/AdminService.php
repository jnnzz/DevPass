<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Device;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminService
{
    /**
     * Get dashboard statistics
     */
    public function getDashboardStats()
    {
        $totalStudents = Student::count();
        $totalDevices = Device::count();
        $pendingDevices = Device::where('status', 'pending')->count();
        $activeDevices = Device::where('status', 'active')->count();
        
        // Get scans today (assuming you have a scans/entries table)
        try {
            $scansToday = DB::table('device_scans')
                ->whereDate('created_at', Carbon::today())
                ->count();
        } catch (\Exception $e) {
            $scansToday = 0; // Table might not exist yet
        }

        // Get recent registrations (last 7 days)
        $recentRegistrations = Student::where('created_at', '>=', Carbon::now()->subDays(7))->count();

        // Get pending approvals
        $pendingApprovals = Device::where('status', 'pending')
            ->with('student:id,name,email,department,course')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return [
            'total_students' => $totalStudents,
            'total_devices' => $totalDevices,
            'pending_devices' => $pendingDevices,
            'active_devices' => $activeDevices,
            'scans_today' => $scansToday,
            'recent_registrations' => $recentRegistrations,
            'pending_approvals' => $pendingApprovals,
        ];
    }

    /**
     * Get all students with pagination
     */
    public function getAllStudents($perPage = 15, $search = null)
    {
        $query = Student::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%")
                  ->orWhere('course', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get student by ID
     */
    public function getStudentById($id)
    {
        return Student::with('devices')->find($id);
    }

    /**
     * Update student information
     */
    public function updateStudent($id, array $data)
    {
        $student = Student::find($id);
        if (!$student) {
            return null;
        }

        // Remove password from data if it's empty
        if (isset($data['password']) && empty($data['password'])) {
            unset($data['password']);
        }

        $student->update($data);
        return $student->fresh();
    }

    /**
     * Delete student
     */
    public function deleteStudent($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return false;
        }

        // Delete associated devices
        $student->devices()->delete();
        
        // Delete student
        $student->delete();
        
        return true;
    }

    /**
     * Get all devices with filters
     */
    public function getAllDevices($status = null, $search = null, $perPage = 15)
    {
        $query = Device::with('student:pkStudentID,id,name,email,department,course,phone,year_of_study');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search && trim($search) !== '') {
            $searchTerm = strtolower(trim($search));
            $query->where(function($q) use ($searchTerm) {
                // Search in device fields (case-insensitive)
                $q->whereRaw('LOWER(brand) LIKE ?', ["%{$searchTerm}%"])
                  ->orWhereRaw('LOWER(model) LIKE ?', ["%{$searchTerm}%"])
                  ->orWhereRaw('LOWER(serial_number) LIKE ?', ["%{$searchTerm}%"])
                  ->orWhereRaw('LOWER(device_type) LIKE ?', ["%{$searchTerm}%"])
                  ->orWhereRaw('LOWER(notes) LIKE ?', ["%{$searchTerm}%"])
                  // Search in student fields (case-insensitive)
                  ->orWhereHas('student', function($studentQuery) use ($searchTerm) {
                      $studentQuery->whereRaw('LOWER(name) LIKE ?', ["%{$searchTerm}%"])
                                   ->orWhereRaw('LOWER(id) LIKE ?', ["%{$searchTerm}%"])
                                   ->orWhereRaw('LOWER(email) LIKE ?', ["%{$searchTerm}%"])
                                   ->orWhereRaw('LOWER(department) LIKE ?', ["%{$searchTerm}%"])
                                   ->orWhereRaw('LOWER(course) LIKE ?', ["%{$searchTerm}%"])
                                   ->orWhereRaw('LOWER(phone) LIKE ?', ["%{$searchTerm}%"]);
                  });
            });
        }

        // If perPage is 100 or more, return all results (not paginated)
        if ($perPage >= 100) {
            return $query->orderBy('created_at', 'desc')->get();
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Approve device
     */
    public function approveDevice($deviceId)
    {
        $device = Device::find($deviceId);
        if (!$device) {
            return null;
        }

        $device->status = 'active';
        $device->approved_at = Carbon::now();
        $device->qr_expires_at = Carbon::now()->addDays(30); // QR valid for 30 days
        $device->save();

        return $device->load('student:pkStudentID,id,name,email,department,course,phone,year_of_study');
    }

    /**
     * Reject device
     */
    public function rejectDevice($deviceId, $reason = null)
    {
        $device = Device::find($deviceId);
        if (!$device) {
            return null;
        }

        $device->status = 'rejected';
        $device->rejection_reason = $reason;
        $device->rejected_at = Carbon::now();
        $device->save();

        return $device->load('student:pkStudentID,id,name,email,department,course,phone,year_of_study');
    }

    /**
     * Get recent scan activity
     */
    public function getRecentScans($limit = 20)
    {
        try {
            return DB::table('device_scans')
                ->join('devices', 'device_scans.device_id', '=', 'devices.id')
                ->join('students', 'devices.student_id', '=', 'students.pkStudentID')
                ->select(
                    'device_scans.*',
                    'students.name as student_name',
                    'students.id as student_id',
                    'devices.brand',
                    'devices.model'
                )
                ->orderBy('device_scans.created_at', 'desc')
                ->limit($limit)
                ->get();
        } catch (\Exception $e) {
            // Return empty collection if table doesn't exist
            return collect([]);
        }
    }
}


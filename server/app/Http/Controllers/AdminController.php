<?php

namespace App\Http\Controllers;

use App\Services\AdminService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    /**
     * Get dashboard statistics
     */
    public function dashboardStats()
    {
        try {
            $stats = $this->adminService->getDashboardStats();
            return response()->json($stats, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all students with pagination and search
     */
    public function getStudents(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 15);
            $search = $request->get('search');

            $students = $this->adminService->getAllStudents($perPage, $search);
            return response()->json($students, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching students',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student by ID
     */
    public function getStudent($id)
    {
        try {
            $student = $this->adminService->getStudentById($id);
            
            if (!$student) {
                return response()->json(['message' => 'Student not found'], 404);
            }

            return response()->json($student, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update student information
     */
    public function updateStudent(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:100',
                'email' => 'sometimes|email|unique:students,email,' . $id . ',pkStudentID',
                'phone' => 'nullable|string|max:15',
                'department' => 'nullable|string|max:50',
                'course' => 'sometimes|string|max:100',
                'year_of_study' => 'nullable|integer|min:1|max:10',
                'password' => 'nullable|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $student = $this->adminService->updateStudent($id, $validator->validated());
            
            if (!$student) {
                return response()->json(['message' => 'Student not found'], 404);
            }

            return response()->json([
                'message' => 'Student updated successfully',
                'student' => $student
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete student
     */
    public function deleteStudent($id)
    {
        try {
            $deleted = $this->adminService->deleteStudent($id);
            
            if (!$deleted) {
                return response()->json(['message' => 'Student not found'], 404);
            }

            return response()->json(['message' => 'Student deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all devices with filters
     */
    public function getDevices(Request $request)
    {
        try {
            $status = $request->get('status', 'all');
            $search = $request->get('search');
            $perPage = $request->get('per_page', 15);

            $devices = $this->adminService->getAllDevices($status, $search, $perPage);
            return response()->json($devices, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching devices',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve device
     */
    public function approveDevice($id)
    {
        try {
            $device = $this->adminService->approveDevice($id);
            
            if (!$device) {
                return response()->json(['message' => 'Device not found'], 404);
            }

            return response()->json([
                'message' => 'Device approved successfully',
                'device' => $device
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error approving device',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject device
     */
    public function rejectDevice(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'reason' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $device = $this->adminService->rejectDevice($id, $request->get('reason'));
            
            if (!$device) {
                return response()->json(['message' => 'Device not found'], 404);
            }

            return response()->json([
                'message' => 'Device rejected successfully',
                'device' => $device
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error rejecting device',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent scan activity
     */
    public function getRecentScans(Request $request)
    {
        try {
            $limit = $request->get('limit', 20);
            $scans = $this->adminService->getRecentScans($limit);
            return response()->json($scans, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching recent scans',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

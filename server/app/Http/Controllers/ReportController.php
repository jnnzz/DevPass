<?php

namespace App\Http\Controllers;

use App\Services\AdminService;
use App\Models\Student;
use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    /**
     * Generate students report (CSV)
     */
    public function studentsReport(Request $request)
    {
        try {
            $format = $request->get('format', 'csv'); // csv or json
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            $query = Student::query();

            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }

            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }

            $students = $query->orderBy('created_at', 'desc')->get();

            if ($format === 'csv') {
                return $this->generateCsv($students, 'students_report', [
                    'ID' => 'id',
                    'Name' => 'name',
                    'Email' => 'email',
                    'Phone' => 'phone',
                    'Department' => 'department',
                    'Course' => 'course',
                    'Year of Study' => 'year_of_study',
                    'Registered At' => 'created_at',
                ]);
            }

            return response()->json([
                'data' => $students,
                'total' => $students->count(),
                'generated_at' => Carbon::now()->toDateTimeString(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error generating students report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate devices report (CSV)
     */
    public function devicesReport(Request $request)
    {
        try {
            $format = $request->get('format', 'csv');
            $status = $request->get('status');
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            $query = Device::with('student:id,name,email,department,course');

            if ($status) {
                $query->where('status', $status);
            }

            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }

            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }

            $devices = $query->orderBy('created_at', 'desc')->get();

            if ($format === 'csv') {
                $data = $devices->map(function($device) {
                    return [
                        'Device ID' => $device->id,
                        'Student Name' => $device->student->name ?? 'N/A',
                        'Student ID' => $device->student->id ?? 'N/A',
                        'Device Type' => $device->device_type,
                        'Brand' => $device->brand,
                        'Model' => $device->model,
                        'Serial Number' => $device->serial_number ?? 'N/A',
                        'Status' => $device->status,
                        'Approved At' => $device->approved_at ? $device->approved_at->format('Y-m-d H:i:s') : 'N/A',
                        'QR Expires At' => $device->qr_expires_at ? $device->qr_expires_at->format('Y-m-d H:i:s') : 'N/A',
                        'Registered At' => $device->created_at->format('Y-m-d H:i:s'),
                    ];
                });

                return $this->generateCsvFromArray($data->toArray(), 'devices_report');
            }

            return response()->json([
                'data' => $devices,
                'total' => $devices->count(),
                'generated_at' => Carbon::now()->toDateTimeString(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error generating devices report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate scan activity report
     */
    public function scanActivityReport(Request $request)
    {
        try {
            $format = $request->get('format', 'csv');
            $startDate = $request->get('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));

            $scans = DB::table('device_scans')
                ->join('devices', 'device_scans.device_id', '=', 'devices.id')
                ->join('students', 'devices.student_id', '=', 'students.pkStudentID')
                ->whereBetween('device_scans.created_at', [$startDate, $endDate . ' 23:59:59'])
                ->select(
                    'device_scans.id',
                    'students.name as student_name',
                    'students.id as student_id',
                    'devices.brand',
                    'devices.model',
                    'device_scans.gate_name',
                    'device_scans.status',
                    'device_scans.created_at as scan_time'
                )
                ->orderBy('device_scans.created_at', 'desc')
                ->get();

            if ($format === 'csv') {
                $data = $scans->map(function($scan) {
                    return [
                        'Scan ID' => $scan->id,
                        'Student Name' => $scan->student_name,
                        'Student ID' => $scan->student_id,
                        'Device' => $scan->brand . ' ' . $scan->model,
                        'Gate' => $scan->gate_name ?? 'N/A',
                        'Status' => $scan->status,
                        'Scan Time' => Carbon::parse($scan->scan_time)->format('Y-m-d H:i:s'),
                    ];
                });

                return $this->generateCsvFromArray($data->toArray(), 'scan_activity_report');
            }

            return response()->json([
                'data' => $scans,
                'total' => $scans->count(),
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ],
                'generated_at' => Carbon::now()->toDateTimeString(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error generating scan activity report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate summary statistics report
     */
    public function summaryReport(Request $request)
    {
        try {
            $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
            $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));

            $stats = [
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ],
                'students' => [
                    'total' => Student::count(),
                    'new_registrations' => Student::whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])->count(),
                ],
                'devices' => [
                    'total' => Device::count(),
                    'pending' => Device::where('status', 'pending')->count(),
                    'active' => Device::where('status', 'active')->count(),
                    'rejected' => Device::where('status', 'rejected')->count(),
                    'new_registrations' => Device::whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])->count(),
                ],
                'scans' => [
                    'total' => DB::table('device_scans')->count(),
                    'in_period' => DB::table('device_scans')
                        ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                        ->count(),
                    'today' => DB::table('device_scans')
                        ->whereDate('created_at', Carbon::today())
                        ->count(),
                ],
                'generated_at' => Carbon::now()->toDateTimeString(),
            ];

            return response()->json($stats, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error generating summary report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method to generate CSV from model collection
     */
    private function generateCsv($collection, $filename, $columns)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}_" . Carbon::now()->format('Y-m-d_His') . ".csv\"",
        ];

        $callback = function() use ($collection, $columns) {
            $file = fopen('php://output', 'w');
            
            // Write headers
            fputcsv($file, array_keys($columns));
            
            // Write data
            foreach ($collection as $item) {
                $row = [];
                foreach ($columns as $column) {
                    $value = data_get($item, $column);
                    if ($value instanceof Carbon) {
                        $value = $value->format('Y-m-d H:i:s');
                    }
                    $row[] = $value ?? '';
                }
                fputcsv($file, $row);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Helper method to generate CSV from array
     */
    private function generateCsvFromArray($data, $filename)
    {
        if (empty($data)) {
            return response()->json(['message' => 'No data to export'], 404);
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}_" . Carbon::now()->format('Y-m-d_His') . ".csv\"",
        ];

        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');
            
            // Write headers from first row keys
            if (!empty($data)) {
                fputcsv($file, array_keys($data[0]));
                
                // Write data rows
                foreach ($data as $row) {
                    fputcsv($file, array_values($row));
                }
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

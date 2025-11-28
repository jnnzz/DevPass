<?php

namespace App\Services;

use App\Models\EntryLog;
use Carbon\Carbon;

class EntryLogService
{
    public function getAllEntryLogs($limit = 50, $securityGuardId = null)
    {
        $query = EntryLog::with(['qrCode.device.student', 'gate', 'securityGuard']);
        
        // Filter by security guard if provided
        if ($securityGuardId) {
            $query->where('security_guard_id', $securityGuardId);
        }
        
        return $query->orderBy('scan_timestamp', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getEntryLogById($id)
    {
        return EntryLog::with(['qrCode.device.student', 'gate', 'securityGuard'])
            ->findOrFail($id);
    }

    public function getEntryLogsByGate($gateId, $limit = 50, $securityGuardId = null)
    {
        $query = EntryLog::where('gate_id', $gateId);
        
        // Filter by security guard if provided
        if ($securityGuardId) {
            $query->where('security_guard_id', $securityGuardId);
        }
        
        return $query->with(['qrCode.device.student', 'gate', 'securityGuard'])
            ->orderBy('scan_timestamp', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getEntryLogsByStudent($studentId, $limit = 50)
    {
        return EntryLog::whereHas('qrCode.device', function ($query) use ($studentId) {
                $query->where('student_id', $studentId);
            })
            ->with(['qrCode.device', 'gate', 'securityGuard'])
            ->where('status', 'success')
            ->orderBy('scan_timestamp', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getEntryLogsByDate($date, $gateId = null)
    {
        $query = EntryLog::whereDate('scan_timestamp', $date);
        
        if ($gateId) {
            $query->where('gate_id', $gateId);
        }
        
        return $query->get();
    }

    public function createEntryLog(array $data)
    {
        // Set scan_timestamp if not provided
        if (!isset($data['scan_timestamp'])) {
            $data['scan_timestamp'] = Carbon::now();
        }

        return EntryLog::create($data);
    }

    public function getStats($gateId = null, $date = null, $securityGuardId = null)
    {
        $date = $date ? Carbon::parse($date) : Carbon::today();
        
        $query = EntryLog::whereDate('scan_timestamp', $date);
        
        if ($gateId) {
            $query->where('gate_id', $gateId);
        }
        
        // Filter by security guard if provided
        if ($securityGuardId) {
            $query->where('security_guard_id', $securityGuardId);
        }
        
        $totalScans = $query->count();
        $successCount = $query->where('status', 'success')->count();
        $successRate = $totalScans > 0 ? round(($successCount / $totalScans) * 100) : 0;
        $lastHour = $query->where('scan_timestamp', '>=', Carbon::now()->subHour())->count();
        
        return [
            'scansToday' => $totalScans,
            'successRate' => $successRate,
            'lastHour' => $lastHour,
        ];
    }
}


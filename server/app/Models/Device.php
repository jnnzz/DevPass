<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Device extends Model
{
    protected $fillable = [
        'student_id',
        'device_type',
        'brand',
        'model',
        'serial_number',
        'notes',
        'status',
        'approved_at',
        'rejected_at',
        'rejection_reason',
        'qr_expires_at',
        'last_scanned_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'qr_expires_at' => 'datetime',
        'last_scanned_at' => 'datetime',
    ];

    /**
     * Get the student that owns the device
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'pkStudentID');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    protected $fillable = [
        'device_id',
        'student_id',
        'gate_name',
        'status',
        'message',
        'scanned_at',
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    /**
     * Get the device that was scanned
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    /**
     * Get the student who owns the device
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'pkStudentID');
    }
}

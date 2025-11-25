<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Device extends Model
{
    protected $fillable = [
        'student_id',
        'device_type',
        'brand',
        'model',
        'serial_number',
        'status',
        'qr_hash',
        'qr_expires_at',
        'last_scanned_at',
        'notes',
        'proof_of_ownership',
        'approved_at',
        'rejected_at',
        'rejection_reason',
    ];

    protected $casts = [
        'qr_expires_at' => 'datetime',
        'last_scanned_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /**
     * Get the student that owns the device
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'pkStudentID');
    }

    /**
     * Get all activities for this device
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    /**
     * Check if QR code is expired
     */
    public function isQrExpired(): bool
    {
        if (!$this->qr_expires_at) {
            return false;
        }
        return $this->qr_expires_at->isPast();
    }

    /**
     * Check if device is active and QR is valid
     */
    public function isActiveAndValid(): bool
    {
        return $this->status === 'active' && !$this->isQrExpired();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Device extends Model
{
    use HasFactory;

    protected $table = 'devices';
    protected $primaryKey = 'device_id';

    protected $fillable = [
        'student_id',
        'device_type',
        'processor',
        'motherboard',
        'memory',
        'harddrive',
        'monitor',
        'casing',
        'cd_dvd_rom',
        'operating_system',
        'model_number',
        'brand',
        'model',
        'serial_number',
        'mac_address',
        'registration_date',
        'registration_status',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'registration_date' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'approved_by', 'admin_id');
    }

    public function qrCodes(): HasMany
    {
        return $this->hasMany(QRCode::class, 'device_id', 'device_id');
    }
}

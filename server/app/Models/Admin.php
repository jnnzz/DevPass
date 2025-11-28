<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admins';
    protected $primaryKey = 'admin_id';

    protected $fillable = [
        'username',
        'email',
        'created_at',
    ];

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class, 'approved_by', 'admin_id');
    }
}

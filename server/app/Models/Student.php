<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'students';
    protected $primaryKey = 'pkStudentID';

    protected $fillable = [
        'id',
        'name',
        'email',
        'phone',
        'department',
        'course',
        'year_of_study',
        'password', // Add password field
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Automatically hash password when setting it
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }
}
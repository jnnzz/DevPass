<?php

namespace App\Services;

use App\Models\SecurityGuard;

class SecurityGuardService
{
    public function getAllSecurityGuards()
    {
        return SecurityGuard::all();
    }

    public function getSecurityGuardById($id)
    {
        return SecurityGuard::findOrFail($id);
    }

    public function createSecurityGuard(array $data)
    {
        return SecurityGuard::create($data);
    }

    public function updateSecurityGuard($id, array $data)
    {
        $guard = SecurityGuard::findOrFail($id);
        $guard->update($data);
        return $guard;
    }

    public function deleteSecurityGuard($id)
    {
        $guard = SecurityGuard::findOrFail($id);
        $guard->delete();
        return true;
    }
}


<?php

namespace App\Services;

use App\Models\Admin;

class AdminService
{
    public function getAllAdmins()
    {
        return Admin::all();
    }

    public function getAdminById($id)
    {
        return Admin::findOrFail($id);
    }

    public function createAdmin(array $data)
    {
        return Admin::create($data);
    }

    public function updateAdmin($id, array $data)
    {
        $admin = Admin::findOrFail($id);
        $admin->update($data);
        return $admin;
    }

    public function deleteAdmin($id)
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();
        return true;
    }
}


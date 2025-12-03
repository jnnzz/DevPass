<?php

namespace App\Http\Controllers;

use App\Services\AdminService;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function index()
    {
        $admins = $this->adminService->getAllAdmins();
        return response()->json($admins);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50',
            'email' => 'required|email|max:158|unique:admins,email',
        ]);

        $admin = $this->adminService->createAdmin($validated);
        return response()->json($admin, 201);
    }

    public function show($id)
    {
        $admin = $this->adminService->getAdminById($id);
        return response()->json($admin);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'username' => 'sometimes|string|max:50',
            'email' => 'sometimes|email|max:158|unique:admins,email,' . $id . ',admin_id',
        ]);

        $admin = $this->adminService->updateAdmin($id, $validated);
        return response()->json($admin);
    }

    public function destroy($id)
    {
        $this->adminService->deleteAdmin($id);
        return response()->json(['message' => 'Admin deleted successfully']);
    }
}

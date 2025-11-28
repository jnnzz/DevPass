<?php

namespace App\Http\Controllers;

use App\Services\GateService;
use Illuminate\Http\Request;

class GateController extends Controller
{
    protected $gateService;

    public function __construct(GateService $gateService)
    {
        $this->gateService = $gateService;
    }

    public function index()
    {
        $gates = $this->gateService->getAllGates();
        return response()->json($gates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'gate_name' => 'required|string|max:50',
            'location' => 'nullable|string|max:100',
        ]);

        $gate = $this->gateService->createGate($validated);
        return response()->json($gate, 201);
    }

    public function show($id)
    {
        $gate = $this->gateService->getGateById($id);
        return response()->json($gate);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'gate_name' => 'sometimes|string|max:50',
            'location' => 'sometimes|nullable|string|max:100',
        ]);

        $gate = $this->gateService->updateGate($id, $validated);
        return response()->json($gate);
    }

    public function destroy($id)
    {
        $this->gateService->deleteGate($id);
        return response()->json(['message' => 'Gate deleted successfully']);
    }
}

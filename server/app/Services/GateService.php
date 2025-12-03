<?php

namespace App\Services;

use App\Models\Gate;

class GateService
{
    public function getAllGates()
    {
        return Gate::all();
    }

    public function getGateById($id)
    {
        return Gate::findOrFail($id);
    }

    public function getGateByName($name)
    {
        return Gate::where('gate_name', $name)->first();
    }

    public function createGate(array $data)
    {
        return Gate::create($data);
    }

    public function updateGate($id, array $data)
    {
        $gate = Gate::findOrFail($id);
        $gate->update($data);
        return $gate;
    }

    public function deleteGate($id)
    {
        $gate = Gate::findOrFail($id);
        $gate->delete();
        return true;
    }
}


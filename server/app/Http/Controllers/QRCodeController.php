<?php

namespace App\Http\Controllers;

use App\Services\QRCodeService;
use Illuminate\Http\Request;

class QRCodeController extends Controller
{
    protected $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
    }

    public function index()
    {
        $qrCodes = $this->qrCodeService->getAllQRCodes();
        return response()->json($qrCodes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'device_id' => 'required|exists:devices,device_id',
            'qr_code_hash' => 'nullable|string|max:255|unique:qr_codes,qr_code_hash',
            'expires_at' => 'required|date',
            'is_active' => 'sometimes|boolean',
        ]);

        $qrCode = $this->qrCodeService->createQRCode($validated);
        return response()->json($qrCode, 201);
    }

    public function show($id)
    {
        $qrCode = $this->qrCodeService->getQRCodeById($id);
        return response()->json($qrCode);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'device_id' => 'sometimes|exists:devices,device_id',
            'qr_code_hash' => 'sometimes|string|max:255|unique:qr_codes,qr_code_hash,' . $id . ',qr_id',
            'expires_at' => 'sometimes|date',
            'is_active' => 'sometimes|boolean',
        ]);

        $qrCode = $this->qrCodeService->updateQRCode($id, $validated);
        return response()->json($qrCode);
    }

    public function destroy($id)
    {
        $this->qrCodeService->deleteQRCode($id);
        return response()->json(['message' => 'QR Code deleted successfully']);
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students', 'pkStudentID')->onDelete('cascade');
            $table->string('device_type'); // Laptop, Desktop, Tablet, Mobile
            $table->string('brand');
            $table->string('model');
            $table->string('serial_number')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'active', 'rejected', 'expired'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('qr_expires_at')->nullable();
            $table->timestamp('last_scanned_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};

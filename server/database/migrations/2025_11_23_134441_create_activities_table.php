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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students', 'pkStudentID')->onDelete('cascade');
            $table->string('gate_name')->nullable(); // Gate where scan happened
            $table->string('status'); // success, denied, expired
            $table->text('message')->nullable(); // Additional message
            $table->timestamp('scanned_at'); // When the scan occurred
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};

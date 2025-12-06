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
        // Only create if devices table doesn't exist
        if (!Schema::hasTable('devices')) {
            Schema::create('devices', function (Blueprint $table) {
                $table->id('device_id');
                $table->string('student_id', 20);
                $table->string('device_type', 50);
                $table->string('processor', 100)->nullable();
                $table->string('motherboard', 100)->nullable();
                $table->string('memory', 50)->nullable();
                $table->string('harddrive', 100)->nullable();
                $table->string('monitor', 100)->nullable();
                $table->string('casing', 100)->nullable();
                $table->string('cd_dvd_rom', 50)->nullable();
                $table->string('operating_system', 100)->nullable();
                $table->string('model_number', 100)->nullable();
                $table->string('brand', 50)->nullable();
                $table->string('model', 100)->nullable();
                $table->string('serial_number', 100)->nullable();
                $table->string('mac_address', 17)->nullable();
                $table->timestamp('registration_date')->nullable();
                $table->string('registration_status', 20)->default('pending');
                $table->unsignedBigInteger('approved_by');
                $table->timestamp('approved_at')->nullable();
                $table->timestamps();
                
                $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
                $table->foreign('approved_by')->references('admin_id')->on('admins')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};

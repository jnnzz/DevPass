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
        // Only create if entry_log table doesn't exist
        if (!Schema::hasTable('entry_log')) {
            Schema::create('entry_log', function (Blueprint $table) {
                $table->id('log_id');
                $table->string('qr_code_hash', 255);
                $table->unsignedBigInteger('gate_id');
                $table->string('security_guard_id', 20);
                $table->timestamp('scan_timestamp')->nullable();
                $table->string('status', 20)->default('success');
                $table->timestamps();
                
                $table->foreign('qr_code_hash')->references('qr_code_hash')->on('qr_codes')->onDelete('cascade');
                $table->foreign('gate_id')->references('gate_id')->on('gates')->onDelete('cascade');
                $table->foreign('security_guard_id')->references('guard_id')->on('security_guards')->onDelete('cascade');
                $table->index('scan_timestamp');
                $table->index('status');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entry_log');
    }
};

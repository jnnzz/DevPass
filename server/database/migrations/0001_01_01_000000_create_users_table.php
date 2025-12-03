<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Note: Users table is not created as we use students table for authentication.
     * This migration is kept for Laravel compatibility but does nothing.
     */
    public function up(): void
    {
        // Intentionally empty - using students table instead of users table
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally empty
    }
};

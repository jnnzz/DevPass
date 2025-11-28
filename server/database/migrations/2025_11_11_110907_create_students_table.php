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
        if (!Schema::hasTable('students')) {
            Schema::create('students', function (Blueprint $table) {
                $table->id('pkStudentID');
                $table->string('id')->unique(); // Student ID (e.g., STU001) - must be unique and indexed for foreign key
                $table->string('name');
                $table->string('email')->unique();
                $table->string('password'); // Encrypted password
                $table->string('course');
                // ✅ Newly added columns
                $table->string('phone')->nullable();
                $table->string('department')->nullable();
                $table->integer('year_of_study')->nullable();

                $table->timestamps(); // created_at and updated_at
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};

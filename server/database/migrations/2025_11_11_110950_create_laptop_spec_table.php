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
        Schema::create('laptop_specifications', function (Blueprint $table) {
            $table->id('spec_id');
            $table->unsignedBigInteger('laptop_id');
            $table->string('processor', 100);
            $table->string('motherboard', 100);
            $table->string('memory', 50);
            $table->string('harddrive', 100);
            $table->string('monitor', 100);
            $table->string('casing', 100);
            $table->string('cd_dvd_rom', 50);
            $table->string('operating_system', 100);
            $table->timestamps();

            // Foreign key constraint (optional - uncomment if you have a laptops table)
            // $table->foreign('laptop_id')->references('id')->on('laptops')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laptop_specifications');
    }
};
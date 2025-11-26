<?php

namespace App\Console\Commands;

use App\Models\Student;
use Illuminate\Console\Command;

class CreateTestAccount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-test-account';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a test student account for login';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Check if account already exists
        $existing = Student::where('email', 'test@example.com')->first();
        
        if ($existing) {
            $this->info('Account already exists!');
            $this->line('');
            $this->line('Login credentials:');
            $this->line('Student ID: ' . $existing->id);
            $this->line('Password: password123');
            $this->line('Email: ' . $existing->email);
            $this->line('Name: ' . $existing->name);
            return 0;
        }

        // Create new account
        try {
            $student = Student::create([
                'id' => 'STU001',
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123', // Will be auto-hashed by model
                'course' => 'Computer Science',
                'phone' => '1234567890',
                'department' => 'IT Department',
                'year_of_study' => 2,
            ]);
            
            $this->info('✅ Account created successfully!');
            $this->line('');
            $this->line('Login credentials:');
            $this->line('Student ID: STU001');
            $this->line('Password: password123');
            $this->line('Email: test@example.com');
            $this->line('Name: Test User');
            
            return 0;
        } catch (\Exception $e) {
            $this->error('Error creating account: ' . $e->getMessage());
            return 1;
        }
    }
}

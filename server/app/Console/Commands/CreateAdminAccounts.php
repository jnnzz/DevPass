<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminAccounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin-accounts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create admin and security guard accounts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Create Admin Account
        $admin = User::firstOrCreate(
            ['email' => 'admin@devpass.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        if ($admin->wasRecentlyCreated) {
            $this->info('✅ Admin account created successfully!');
        } else {
            $this->info('ℹ️  Admin account already exists!');
        }

        $this->line('');
        $this->line('Admin Login Credentials:');
        $this->line('Email: admin@devpass.com');
        $this->line('Password: admin123');
        $this->line('Role: admin');
        $this->line('');

        // Create Security Guard Account
        $security = User::firstOrCreate(
            ['email' => 'security@devpass.com'],
            [
                'name' => 'Security Guard',
                'password' => Hash::make('security123'),
                'role' => 'security',
            ]
        );

        if ($security->wasRecentlyCreated) {
            $this->info('✅ Security guard account created successfully!');
        } else {
            $this->info('ℹ️  Security guard account already exists!');
        }

        $this->line('');
        $this->line('Security Guard Login Credentials:');
        $this->line('Email: security@devpass.com');
        $this->line('Password: security123');
        $this->line('Role: security');
        $this->line('');

        $this->info('✨ All accounts are ready to use!');
        
        return 0;
    }
}

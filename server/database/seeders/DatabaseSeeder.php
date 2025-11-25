<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clear existing data (optional - uncomment if you want fresh data each time)
        // User::truncate();
        // Student::truncate();

        // Create Admin Accounts
        $this->createAdminAccounts();

        // Create Security/Personnel Accounts
        $this->createPersonnelAccounts();

        // Create Student Accounts
        $this->createStudentAccounts();
    }

    /**
     * Create admin accounts
     */
    private function createAdminAccounts(): void
    {
        $admins = [
            [
                'name' => 'John Admin',
                'email' => 'admin@devpass.com',
                'password' => 'admin123',
                'role' => 'admin',
            ],
            [
                'name' => 'Sarah Administrator',
                'email' => 'sarah.admin@devpass.com',
                'password' => 'admin123',
                'role' => 'admin',
            ],
            [
                'name' => 'Michael Manager',
                'email' => 'michael.admin@devpass.com',
                'password' => 'admin123',
                'role' => 'admin',
            ],
        ];

        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make($admin['password']),
                    'role' => $admin['role'],
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('Admin accounts created successfully!');
    }

    /**
     * Create security/personnel accounts
     */
    private function createPersonnelAccounts(): void
    {
        $personnel = [
            [
                'name' => 'David Security',
                'email' => 'david.security@devpass.com',
                'password' => 'security123',
                'role' => 'security',
            ],
            [
                'name' => 'Emma Guard',
                'email' => 'emma.security@devpass.com',
                'password' => 'security123',
                'role' => 'security',
            ],
            [
                'name' => 'Robert Officer',
                'email' => 'robert.security@devpass.com',
                'password' => 'security123',
                'role' => 'security',
            ],
            [
                'name' => 'Lisa Watchman',
                'email' => 'lisa.security@devpass.com',
                'password' => 'security123',
                'role' => 'security',
            ],
            [
                'name' => 'James Patrol',
                'email' => 'james.security@devpass.com',
                'password' => 'security123',
                'role' => 'security',
            ],
        ];

        foreach ($personnel as $person) {
            User::updateOrCreate(
                ['email' => $person['email']],
                [
                    'name' => $person['name'],
                    'password' => Hash::make($person['password']),
                    'role' => $person['role'],
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('Security/Personnel accounts created successfully!');
    }

    /**
     * Create student accounts
     */
    private function createStudentAccounts(): void
    {
        $students = [
            [
                'id' => 'STU001',
                'name' => 'Alice Johnson',
                'email' => 'alice.johnson@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456789',
                'department' => 'Computer Science',
                'course' => 'Bachelor of Science in Computer Science',
                'year_of_study' => 3,
            ],
            [
                'id' => 'STU002',
                'name' => 'Bob Smith',
                'email' => 'bob.smith@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456790',
                'department' => 'Engineering',
                'course' => 'Bachelor of Science in Electrical Engineering',
                'year_of_study' => 2,
            ],
            [
                'id' => 'STU003',
                'name' => 'Carol Williams',
                'email' => 'carol.williams@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456791',
                'department' => 'Business Administration',
                'course' => 'Bachelor of Business Administration',
                'year_of_study' => 4,
            ],
            [
                'id' => 'STU004',
                'name' => 'Daniel Brown',
                'email' => 'daniel.brown@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456792',
                'department' => 'Information Technology',
                'course' => 'Bachelor of Science in Information Technology',
                'year_of_study' => 1,
            ],
            [
                'id' => 'STU005',
                'name' => 'Eva Davis',
                'email' => 'eva.davis@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456793',
                'department' => 'Computer Science',
                'course' => 'Bachelor of Science in Computer Science',
                'year_of_study' => 3,
            ],
            [
                'id' => 'STU006',
                'name' => 'Frank Miller',
                'email' => 'frank.miller@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456794',
                'department' => 'Engineering',
                'course' => 'Bachelor of Science in Mechanical Engineering',
                'year_of_study' => 2,
            ],
            [
                'id' => 'STU007',
                'name' => 'Grace Wilson',
                'email' => 'grace.wilson@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456795',
                'department' => 'Business Administration',
                'course' => 'Bachelor of Business Administration',
                'year_of_study' => 4,
            ],
            [
                'id' => 'STU008',
                'name' => 'Henry Moore',
                'email' => 'henry.moore@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456796',
                'department' => 'Information Technology',
                'course' => 'Bachelor of Science in Information Technology',
                'year_of_study' => 2,
            ],
            [
                'id' => 'STU009',
                'name' => 'Ivy Taylor',
                'email' => 'ivy.taylor@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456797',
                'department' => 'Computer Science',
                'course' => 'Bachelor of Science in Computer Science',
                'year_of_study' => 1,
            ],
            [
                'id' => 'STU010',
                'name' => 'Jack Anderson',
                'email' => 'jack.anderson@student.university.edu',
                'password' => 'student123',
                'phone' => '09123456798',
                'department' => 'Engineering',
                'course' => 'Bachelor of Science in Civil Engineering',
                'year_of_study' => 3,
            ],
        ];

        foreach ($students as $student) {
            Student::updateOrCreate(
                ['email' => $student['email']],
                [
                    'id' => $student['id'],
                    'name' => $student['name'],
                    'password' => $student['password'], // Will be auto-hashed by model
                    'phone' => $student['phone'],
                    'department' => $student['department'],
                    'course' => $student['course'],
                    'year_of_study' => $student['year_of_study'],
                ]
            );
        }

        $this->command->info('Student accounts created successfully!');
    }
}

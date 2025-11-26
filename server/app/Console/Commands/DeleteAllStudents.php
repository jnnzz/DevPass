<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class DeleteAllStudents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-all-students {--force : Force deletion without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete all student accounts from the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = Student::count();

        if ($count === 0) {
            $this->info('No students found in the database.');
            return 0;
        }

        if (!$this->option('force')) {
            if (!$this->confirm("Are you sure you want to delete all {$count} student accounts? This action cannot be undone!")) {
                $this->info('Operation cancelled.');
                return 0;
            }
        }

        try {
            // Delete all students (cascade will handle related devices if configured)
            DB::beginTransaction();
            
            // Delete all students
            $deleted = Student::query()->delete();
            
            DB::commit();
            
            $this->info("Successfully deleted {$deleted} student account(s).");
            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Error deleting students: ' . $e->getMessage());
            return 1;
        }
    }
}

<?php

namespace App\Services;

use App\Models\Student;

class StudentService
{
    public function getAllStudents()
    {
        return Student::all();
    }

    public function getStudentById($id)
    {
        return Student::find($id);
    }

    public function addStudent($data)
    {
        return Student::create($data);
    }

    public function updateStudent($id, $data)
    {
        $student = Student::find($id);
        if(!$student) return null;

        $student->update($data);
        return $student;
    }

    public function deleteStudent($id)
    {
        $student = Student::find($id);
        if(!$student) return false;

        $student->delete();
        return true;
    }
}
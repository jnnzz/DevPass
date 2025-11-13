<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\StudentService;

class StudentController extends Controller
{
    protected $studentService;

    // Dependency Injection (like @Autowired in Spring Boot)
    public function __construct(StudentService $studentService)
    {
      $this->studentService = $studentService;
    }

    public function index()
    {
        return response()->json($this->studentService->getAllStudents(), 200);
    }

    public function show($id)
    {
        $student = $this->studentService->getStudentById($id);
        return $student
            ? response()->json($student, 200)
            : response()->json(['message' => 'Student not found'], 404);
    }

    public function store(Request $request)
    {
        $student = $this->studentService->addStudent($request->all());
        return response()->json($student, 201);
    }

    public function update(Request $request, $id)
    {
        $student = $this->studentService->updateStudent($id, $request->all());
        return $student
            ? response()->json($student, 200)
            : response()->json(['message' => 'Student not found'], 404);
    }

    public function destroy($id)
    {
        $deleted = $this->studentService->deleteStudent($id);
        return $deleted
            ? response()->json(['message' => 'Student deleted', 200])
            : response()->json(['message' => 'Student not found', 404]);
    }
}
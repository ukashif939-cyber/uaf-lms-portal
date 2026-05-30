const { v4: uuidv4 } = require('uuid');

const users = [
    {
        id: '1',
        name: 'Ali Khan',
        email: 'ali.khan@uaf.edu.pk',
        role: 'student',
        regId: '2021-ag-1234',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali',
        password: 'password123' // Mock password
    },
    {
        id: '2',
        name: 'Fatima Bibi',
        email: 'fatima.bibi@uaf.edu.pk',
        role: 'student',
        regId: '2021-ag-5678',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
        password: 'password123'
    },
    {
        id: '3',
        name: 'Admin User',
        email: 'admin@uaf.edu.pk',
        role: 'admin',
        regId: 'ADMIN-001',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        password: 'admin'
    },
    {
        id: '4',
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@uaf.edu.pk',
        role: 'student',
        regId: '2022-ag-2345',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
        password: 'password123'
    },
    {
        id: '5',
        name: 'Ayesha Malik',
        email: 'ayesha.malik@uaf.edu.pk',
        role: 'student',
        regId: '2022-ag-3456',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha',
        password: 'password123'
    },
    {
        id: '6',
        name: 'Usman Ali',
        email: 'usman.ali@uaf.edu.pk',
        role: 'student',
        regId: '2023-ag-4567',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Usman',
        password: 'password123'
    }
];

const attendance = [
    // Ali Khan - Student 1
    { studentId: '1', semester: 'Fall 2024', subject: 'Computer Science 101', total: 20, attended: 18, percentage: 90 },
    { studentId: '1', semester: 'Fall 2024', subject: 'Mathematics', total: 20, attended: 15, percentage: 75 },
    { studentId: '1', semester: 'Fall 2024', subject: 'Physics', total: 20, attended: 20, percentage: 100 },
    { studentId: '1', semester: 'Fall 2024', subject: 'English', total: 20, attended: 16, percentage: 80 },
    { studentId: '1', semester: 'Fall 2024', subject: 'Database Systems', total: 20, attended: 17, percentage: 85 },

    // Fatima Bibi - Student 2
    { studentId: '2', semester: 'Fall 2024', subject: 'Computer Science 101', total: 20, attended: 19, percentage: 95 },
    { studentId: '2', semester: 'Fall 2024', subject: 'Mathematics', total: 20, attended: 18, percentage: 90 },
    { studentId: '2', semester: 'Fall 2024', subject: 'Chemistry', total: 20, attended: 17, percentage: 85 },
    { studentId: '2', semester: 'Fall 2024', subject: 'English', total: 20, attended: 20, percentage: 100 },

    // Ahmed Hassan - Student 4
    { studentId: '4', semester: 'Fall 2024', subject: 'Data Structures', total: 20, attended: 14, percentage: 70 },
    { studentId: '4', semester: 'Fall 2024', subject: 'Operating Systems', total: 20, attended: 16, percentage: 80 },
    { studentId: '4', semester: 'Fall 2024', subject: 'Statistics', total: 20, attended: 15, percentage: 75 },

    // Ayesha Malik - Student 5
    { studentId: '5', semester: 'Fall 2024', subject: 'Web Development', total: 20, attended: 19, percentage: 95 },
    { studentId: '5', semester: 'Fall 2024', subject: 'Software Engineering', total: 20, attended: 18, percentage: 90 },
    { studentId: '5', semester: 'Fall 2024', subject: 'Discrete Mathematics', total: 20, attended: 17, percentage: 85 }
];

const grades = [
    {
        studentId: '1',
        semester: 'Spring 2024',
        results: [
            { subject: 'Data Structures', grade: 'A', mid: 25, final: 45, sessional: 18, total: 88 },
            { subject: 'Linear Algebra', grade: 'B+', mid: 22, final: 40, sessional: 15, total: 77 },
            { subject: 'Pakistan Studies', grade: 'A', mid: 24, final: 42, sessional: 19, total: 85 },
            { subject: 'Object Oriented Programming', grade: 'A-', mid: 23, final: 41, sessional: 17, total: 81 },
            { subject: 'Digital Logic Design', grade: 'B+', mid: 21, final: 39, sessional: 16, total: 76 }
        ]
    },
    {
        studentId: '2',
        semester: 'Spring 2024',
        results: [
            { subject: 'Data Structures', grade: 'A+', mid: 28, final: 48, sessional: 20, total: 96 },
            { subject: 'Linear Algebra', grade: 'A', mid: 26, final: 44, sessional: 18, total: 88 },
            { subject: 'Pakistan Studies', grade: 'A+', mid: 27, final: 47, sessional: 19, total: 93 },
            { subject: 'Chemistry', grade: 'A', mid: 25, final: 43, sessional: 18, total: 86 }
        ]
    },
    {
        studentId: '4',
        semester: 'Spring 2024',
        results: [
            { subject: 'Programming Fundamentals', grade: 'B', mid: 20, final: 38, sessional: 14, total: 72 },
            { subject: 'Calculus', grade: 'B+', mid: 22, final: 40, sessional: 15, total: 77 },
            { subject: 'English Composition', grade: 'A-', mid: 23, final: 41, sessional: 17, total: 81 }
        ]
    },
    {
        studentId: '5',
        semester: 'Spring 2024',
        results: [
            { subject: 'Database Systems', grade: 'A', mid: 26, final: 44, sessional: 18, total: 88 },
            { subject: 'Computer Networks', grade: 'A-', mid: 24, final: 42, sessional: 17, total: 83 },
            { subject: 'Software Engineering', grade: 'A+', mid: 28, final: 48, sessional: 20, total: 96 },
            { subject: 'Web Technologies', grade: 'A', mid: 25, final: 43, sessional: 19, total: 87 }
        ]
    }
];

const fees = [
    // Ali Khan - Student 1
    { id: 'v1', studentId: '1', title: 'Fall 2024 Semester Fee', amount: 45000, status: 'Paid', dueDate: '2024-09-15' },
    { id: 'v2', studentId: '1', title: 'Library Fine', amount: 500, status: 'Pending', dueDate: '2024-11-01' },
    { id: 'v3', studentId: '1', title: 'Lab Fee', amount: 5000, status: 'Paid', dueDate: '2024-09-20' },

    // Fatima Bibi - Student 2
    { id: 'v4', studentId: '2', title: 'Fall 2024 Semester Fee', amount: 45000, status: 'Paid', dueDate: '2024-09-15' },
    { id: 'v5', studentId: '2', title: 'Sports Fee', amount: 2000, status: 'Paid', dueDate: '2024-10-01' },

    // Ahmed Hassan - Student 4
    { id: 'v6', studentId: '4', title: 'Fall 2024 Semester Fee', amount: 45000, status: 'Pending', dueDate: '2024-09-15' },
    { id: 'v7', studentId: '4', title: 'Hostel Fee', amount: 15000, status: 'Pending', dueDate: '2024-09-20' },
    { id: 'v8', studentId: '4', title: 'Examination Fee', amount: 3000, status: 'Paid', dueDate: '2024-10-10' },

    // Ayesha Malik - Student 5
    { id: 'v9', studentId: '5', title: 'Fall 2024 Semester Fee', amount: 45000, status: 'Paid', dueDate: '2024-09-15' },
    { id: 'v10', studentId: '5', title: 'Lab Fee', amount: 5000, status: 'Paid', dueDate: '2024-09-20' },

    // Usman Ali - Student 6
    { id: 'v11', studentId: '6', title: 'Fall 2024 Semester Fee', amount: 45000, status: 'Pending', dueDate: '2024-09-15' },
    { id: 'v12', studentId: '6', title: 'Transport Fee', amount: 8000, status: 'Pending', dueDate: '2024-09-25' }
];

const library = [
    // Computer Science Books
    { id: 'l1', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', type: 'Book', category: 'Computer Science', link: '#' },
    { id: 'l2', title: 'Clean Code', author: 'Robert C. Martin', type: 'Book', category: 'Software Engineering', link: '#' },
    { id: 'l3', title: 'Design Patterns', author: 'Gang of Four', type: 'Book', category: 'Software Engineering', link: '#' },
    { id: 'l4', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', type: 'Book', category: 'Software Engineering', link: '#' },
    { id: 'l5', title: 'Artificial Intelligence: A Modern Approach', author: 'Russell & Norvig', type: 'Book', category: 'AI/ML', link: '#' },

    // Mathematics Books
    { id: 'l6', title: 'Calculus Early Transcendentals', author: 'James Stewart', type: 'Book', category: 'Mathematics', link: '#' },
    { id: 'l7', title: 'Linear Algebra and Its Applications', author: 'Gilbert Strang', type: 'Book', category: 'Mathematics', link: '#' },
    { id: 'l8', title: 'Discrete Mathematics', author: 'Kenneth Rosen', type: 'Book', category: 'Mathematics', link: '#' },

    // Agriculture Books
    { id: 'l9', title: 'Principles of Agronomy', author: 'Dr. Muhammad Ashraf', type: 'Book', category: 'Agriculture', link: '#' },
    { id: 'l10', title: 'Soil Science Fundamentals', author: 'Dr. Ahmad Khan', type: 'Book', category: 'Agriculture', link: '#' },
    { id: 'l11', title: 'Modern Crop Production', author: 'UAF Faculty', type: 'Book', category: 'Agriculture', link: '#' },

    // Research Journals
    { id: 'l12', title: 'UAF Research Journal 2023', author: 'UAF Press', type: 'Journal', category: 'Research', link: '#' },
    { id: 'l13', title: 'Journal of Agricultural Sciences', author: 'UAF Press', type: 'Journal', category: 'Research', link: '#' },
    { id: 'l14', title: 'Pakistan Journal of Computer Science', author: 'HEC', type: 'Journal', category: 'Research', link: '#' },

    // General Books
    { id: 'l15', title: 'English Grammar in Use', author: 'Raymond Murphy', type: 'Book', category: 'Language', link: '#' },
    { id: 'l16', title: 'Pakistan Studies', author: 'Dr. Ikram Rabbani', type: 'Book', category: 'Social Sciences', link: '#' },
    { id: 'l17', title: 'Islamic Studies', author: 'Dr. Muhammad Hamidullah', type: 'Book', category: 'Islamic Studies', link: '#' },

    // E-Books
    { id: 'l18', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', type: 'E-Book', category: 'Computer Science', link: '#' },
    { id: 'l19', title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', type: 'E-Book', category: 'Computer Science', link: '#' },
    { id: 'l20', title: 'Computer Networks', author: 'Andrew Tanenbaum', type: 'E-Book', category: 'Computer Science', link: '#' }
];

const feedback = [];

// Detailed marks breakdown for each subject (for /marks page)
const marksBreakdown = [
    {
        studentId: '1',
        semester: 'Spring 2024',
        subjects: [
            {
                subject: 'Data Structures',
                total: 88,
                breakdown: [
                    { type: 'Quiz 1', marks: 8, total: 10 },
                    { type: 'Quiz 2', marks: 9, total: 10 },
                    { type: 'Assignment 1', marks: 4, total: 5 },
                    { type: 'Mid Term', marks: 25, total: 25 },
                    { type: 'Final Exam', marks: 42, total: 50 }
                ]
            },
            {
                subject: 'Linear Algebra',
                total: 77,
                breakdown: [
                    { type: 'Quiz 1', marks: 7, total: 10 },
                    { type: 'Quiz 2', marks: 8, total: 10 },
                    { type: 'Assignment 1', marks: 5, total: 5 },
                    { type: 'Mid Term', marks: 22, total: 25 },
                    { type: 'Final Exam', marks: 35, total: 50 }
                ]
            },
            {
                subject: 'Pakistan Studies',
                total: 85,
                breakdown: [
                    { type: 'Quiz 1', marks: 9, total: 10 },
                    { type: 'Quiz 2', marks: 10, total: 10 },
                    { type: 'Assignment 1', marks: 5, total: 5 },
                    { type: 'Mid Term', marks: 24, total: 25 },
                    { type: 'Final Exam', marks: 37, total: 50 }
                ]
            }
        ]
    },
    {
        studentId: '2',
        semester: 'Spring 2024',
        subjects: [
            {
                subject: 'Data Structures',
                total: 96,
                breakdown: [
                    { type: 'Quiz 1', marks: 10, total: 10 },
                    { type: 'Quiz 2', marks: 10, total: 10 },
                    { type: 'Assignment 1', marks: 5, total: 5 },
                    { type: 'Mid Term', marks: 25, total: 25 },
                    { type: 'Final Exam', marks: 46, total: 50 }
                ]
            },
            {
                subject: 'Linear Algebra',
                total: 88,
                breakdown: [
                    { type: 'Quiz 1', marks: 9, total: 10 },
                    { type: 'Quiz 2', marks: 9, total: 10 },
                    { type: 'Assignment 1', marks: 5, total: 5 },
                    { type: 'Mid Term', marks: 24, total: 25 },
                    { type: 'Final Exam', marks: 41, total: 50 }
                ]
            }
        ]
    },
    {
        studentId: '4',
        semester: 'Spring 2024',
        subjects: [
            {
                subject: 'Programming Fundamentals',
                total: 72,
                breakdown: [
                    { type: 'Quiz 1', marks: 6, total: 10 },
                    { type: 'Quiz 2', marks: 7, total: 10 },
                    { type: 'Assignment 1', marks: 4, total: 5 },
                    { type: 'Mid Term', marks: 20, total: 25 },
                    { type: 'Final Exam', marks: 35, total: 50 }
                ]
            },
            {
                subject: 'Calculus',
                total: 77,
                breakdown: [
                    { type: 'Quiz 1', marks: 7, total: 10 },
                    { type: 'Quiz 2', marks: 8, total: 10 },
                    { type: 'Assignment 1', marks: 4, total: 5 },
                    { type: 'Mid Term', marks: 22, total: 25 },
                    { type: 'Final Exam', marks: 36, total: 50 }
                ]
            }
        ]
    },
    {
        studentId: '5',
        semester: 'Spring 2024',
        subjects: [
            {
                subject: 'Database Systems',
                total: 88,
                breakdown: [
                    { type: 'Quiz 1', marks: 9, total: 10 },
                    { type: 'Quiz 2', marks: 9, total: 10 },
                    { type: 'Assignment 1', marks: 5, total: 5 },
                    { type: 'Mid Term', marks: 24, total: 25 },
                    { type: 'Final Exam', marks: 41, total: 50 }
                ]
            },
            {
                subject: 'Software Engineering',
                total: 96,
                breakdown: [
                    { type: 'Quiz 1', marks: 10, total: 10 },
                    { type: 'Quiz 2', marks: 10, total: 10 },
                    { type: 'Assignment 1', marks: 5, total: 5 },
                    { type: 'Mid Term', marks: 25, total: 25 },
                    { type: 'Final Exam', marks: 46, total: 50 }
                ]
            },
            {
                subject: 'Web Technologies',
                total: 87,
                breakdown: [
                    { type: 'Quiz 1', marks: 9, total: 10 },
                    { type: 'Quiz 2', marks: 8, total: 10 },
                    { type: 'Assignment 1', marks: 5, total: 5 },
                    { type: 'Mid Term', marks: 24, total: 25 },
                    { type: 'Final Exam', marks: 41, total: 50 }
                ]
            }
        ]
    }
];

// Enhanced grades data to match new frontend structure
const gradesEnhanced = [
    {
        studentId: '1',
        semester: 'Spring 2025',
        semesterGPA: '3.60',
        cumulativeGPA: '3.45',
        creditHours: 19,
        courses: [
            { code: 'CS-301', name: 'Database Systems', grade: 'A', gpa: '4.0', credit: 3, marks: '88%' },
            { code: 'CS-302', name: 'Software Engineering', grade: 'A-', gpa: '3.7', credit: 3, marks: '83%' },
            { code: 'CS-201', name: 'Data Structures', grade: 'B+', gpa: '3.3', credit: 4, marks: '78%' },
            { code: 'CS-303', name: 'Operating Systems', grade: 'B', gpa: '3.0', credit: 3, marks: '75%' },
            { code: 'CS-304', name: 'Web Technologies', grade: 'A', gpa: '4.0', credit: 3, marks: '90%' },
            { code: 'CS-305', name: 'Computer Networks', grade: 'A-', gpa: '3.7', credit: 3, marks: '84%' }
        ]
    },
    {
        studentId: '2',
        semester: 'Spring 2025',
        semesterGPA: '3.85',
        cumulativeGPA: '3.78',
        creditHours: 19,
        courses: [
            { code: 'CS-301', name: 'Database Systems', grade: 'A', gpa: '4.0', credit: 3, marks: '92%' },
            { code: 'CS-302', name: 'Software Engineering', grade: 'A', gpa: '4.0', credit: 3, marks: '89%' },
            { code: 'CS-201', name: 'Data Structures', grade: 'A', gpa: '4.0', credit: 4, marks: '91%' },
            { code: 'CS-303', name: 'Operating Systems', grade: 'A-', gpa: '3.7', credit: 3, marks: '82%' },
            { code: 'CS-304', name: 'Web Technologies', grade: 'A', gpa: '4.0', credit: 3, marks: '94%' },
            { code: 'CS-305', name: 'Computer Networks', grade: 'A-', gpa: '3.7', credit: 3, marks: '85%' }
        ]
    },
    {
        studentId: '4',
        semester: 'Spring 2025',
        semesterGPA: '3.20',
        cumulativeGPA: '3.10',
        creditHours: 16,
        courses: [
            { code: 'CS-101', name: 'Programming Fundamentals', grade: 'B+', gpa: '3.3', credit: 4, marks: '78%' },
            { code: 'MATH-201', name: 'Calculus I', grade: 'B', gpa: '3.0', credit: 3, marks: '73%' },
            { code: 'ENG-101', name: 'English Composition', grade: 'A-', gpa: '3.7', credit: 3, marks: '82%' },
            { code: 'CS-102', name: 'Digital Logic Design', grade: 'B+', gpa: '3.3', credit: 3, marks: '77%' },
            { code: 'PHY-101', name: 'Physics', grade: 'B', gpa: '3.0', credit: 3, marks: '72%' }
        ]
    },
    {
        studentId: '5',
        semester: 'Spring 2025',
        semesterGPA: '3.75',
        cumulativeGPA: '3.65',
        creditHours: 19,
        courses: [
            { code: 'CS-301', name: 'Database Systems', grade: 'A', gpa: '4.0', credit: 3, marks: '88%' },
            { code: 'CS-302', name: 'Software Engineering', grade: 'A', gpa: '4.0', credit: 3, marks: '96%' },
            { code: 'CS-304', name: 'Web Technologies', grade: 'A-', gpa: '3.7', credit: 3, marks: '87%' },
            { code: 'CS-305', name: 'Computer Networks', grade: 'A-', gpa: '3.7', credit: 3, marks: '83%' },
            { code: 'CS-306', name: 'Artificial Intelligence', grade: 'A', gpa: '4.0', credit: 4, marks: '90%' },
            { code: 'CS-307', name: 'Mobile App Development', grade: 'B+', gpa: '3.3', credit: 3, marks: '79%' }
        ]
    }
];

module.exports = { users, attendance, grades, fees, library, feedback, marksBreakdown, gradesEnhanced };

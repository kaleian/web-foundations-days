
-- Day 6 Assignment: School Database
-- SQLite

PRAGMA foreign_keys = ON;

-- 1. Create the students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create the courses table
CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL UNIQUE
);

-- 3. Create the enrolments table
CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id)
        REFERENCES students(id),

    FOREIGN KEY (course_id)
        REFERENCES courses(id)
);

-- 4. Insert at least three students
INSERT INTO students (id, name, email) VALUES
    (1, 'Alice Kamau', 'alice@example.com'),
    (2, 'Brian Otieno', 'brian@example.com'),
    (3, 'Carol Wanjiku', 'carol@example.com'),
    (4, 'David Mwangi', 'david@example.com');

-- 5. Insert at least three courses
INSERT INTO courses (id, course_name) VALUES
    (1, 'Database Systems'),
    (2, 'Web Development'),
    (3, 'Software Engineering');

-- 6. Insert at least five enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
    (1, 1, 'B'),
    (1, 2, 'A'),
    (2, 1, 'B'),
    (2, 3, 'A'),
    (3, 2, 'B');

-- 7. QUERY ONE:
-- All courses taken by one student, identified by name
SELECT
    s.name AS student_name,
    c.course_name,
    e.grade
FROM students AS s
JOIN enrolments AS e ON s.id = e.student_id
JOIN courses AS c ON c.id = e.course_id
WHERE s.name = 'Alice Kamau';

-- 8. QUERY TWO:
-- All students enrolled in one course
SELECT
    s.name AS student_name,
    s.email
FROM students AS s
JOIN enrolments AS e ON s.id = e.student_id
JOIN courses AS c ON c.id = e.course_id
WHERE c.course_name = 'Database Systems';

-- 9. QUERY THREE:
-- Number of students enrolled in each course
-- LEFT JOIN includes courses with zero enrolments
SELECT
    c.course_name,
    COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e ON c.id = e.course_id
GROUP BY c.id, c.course_name
ORDER BY c.id;

-- 10. QUERY FOUR:
-- Students who have no enrolments
SELECT
    s.id,
    s.name,
    s.email
FROM students AS s
LEFT JOIN enrolments AS e ON s.id = e.student_id
WHERE e.student_id IS NULL;

-- 11. QUERY FIVE:
-- Update one student's grade for one course
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 1
  AND course_id = 1;

-- Optional verification of the grade update
SELECT
    s.name AS student_name,
    c.course_name,
    e.grade
FROM enrolments AS e
JOIN students AS s ON s.id = e.student_id
JOIN courses AS c ON c.id = e.course_id
WHERE e.student_id = 1
  AND e.course_id = 1;

-- 12. Create an index for looking up enrolments by course
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);

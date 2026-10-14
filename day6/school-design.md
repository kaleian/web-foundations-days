
# School Database Design

## 1. Students Table

The `students` table stores each student's ID, name, and email address.
The ID is the primary key, and both the name and email are required.
The email column has a UNIQUE constraint to prevent duplicate email
addresses.

## 2. Courses Table

The `courses` table stores the courses offered by the school.
Each course has a unique ID and a required course name.
The ID is the primary key, and the course name is also unique.

## 3. Enrolments Table

The `enrolments` table connects students to courses and stores the
grade a student receives in each course. It contains `student_id`
and `course_id` as foreign keys referencing the students and courses
tables. Its composite primary key (`student_id`, `course_id`) prevents
a student from enrolling in the same course more than once.

## Relationships

There is a one-to-many relationship between students and enrolments:
one student can have multiple enrolment records, but each enrolment
belongs to one student. There is also a one-to-many relationship
between courses and enrolments because one course can have many
enrolment records, while each enrolment belongs to one course.

Students and courses have a many-to-many relationship. A student can
take multiple courses, and a course can contain multiple students.
The enrolments table is necessary as a join table to represent this
relationship and store additional information, such as grades, for
each student-course combination.

## Index

I would add an index on `enrolments(course_id)`. This makes it faster
to find all students enrolled in a particular course and can improve
queries that group enrolments by course. The index requires additional
storage and adds some overhead when enrolment records are inserted,
updated, or deleted.

## SQL or NoSQL?

I would choose a relational SQL database for this school system.
Students, courses, and enrolments have clearly defined relationships,
and foreign keys help maintain data integrity. SQL supports JOIN
operations, aggregation, constraints, and transactions, making it
suitable for finding students in courses and calculating enrolment
counts. A relational database is a natural fit for this structured
data and its many-to-many relationship.

/*
 School Management System Database Schema
 =====================================
 
 This schema is designed to manage a comprehensive school management system that can
 handle multiple school, student, staff, academics, and financial operations.
 
 Design Principles:
 -----------------
 1. Data Integrity: Uses constraints, foreign keys, and checks to maintain data consistency
 2. Scalability: Designed to handle multiple school and large datasets
 3. Audit Trail: Tracks creation and modifications of critical data
 4. Security: Implements role-based access and data protection measures
 5. Flexibility: Uses JSONB for dynamic data requirements
 
 Core Components:
 --------------
 1. Academic Management (school, class, subject, exam)
 2. People Management (student, teacher, staff, parent)
 3. Financial Management (fee, payment)
 4. Operational Management (attendance, timetables)
 */
/*
 Enum Types
 ----------
 Using ENUMs for fixed value sets provides:
 - Data consistency
 - Input validation
 - Better performance than VARCHAR
 */
CREATE TYPE school_type AS ENUM ('primary', 'secondary', 'combined');
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'staff', 'student', 'parent');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE exam_type AS ENUM ('quiz', 'mid_term', 'final', 'assignment');
CREATE TYPE event_scope AS ENUM (
    'inter_school',
    'intra_school',
    'class_level',
    'stream_level'
);
CREATE TYPE facility_type AS ENUM (
    'library',
    'lab',
    'sports_field',
    'canteen',
    'swimming_pool',
    'transport'
);
CREATE TYPE employment_status AS ENUM (
    'full_time',
    'part_time',
    'contract',
    'intern',
    'temporary'
);
CREATE TYPE relationship_type AS ENUM ('father', 'mother', 'guardian', 'other');
CREATE TYPE participant_type AS ENUM ('student', 'teacher', 'staff', 'guest');
CREATE TYPE participation_status AS ENUM (
    'registered',
    'attended',
    'absent',
    'withdrawn',
    'disqualified'
);
CREATE TYPE event_role AS ENUM (
    'participant',
    'organizer',
    'judge',
    'supervisor'
);
CREATE TYPE payment_method AS ENUM (
    'cash',
    'bank_transfer',
    'credit_card',
    'mobile_money',
    'cheque'
);
CREATE TYPE fee_type_enum AS ENUM (
    'tuition',
    'library',
    'sports',
    'transport',
    'miscellaneous'
);
CREATE TYPE reviewable_entity AS ENUM ('school', 'school_facility', 'event', 'teacher');
CREATE TYPE severity AS ENUM (
    'emergency',
    'urgent',
    'priotity',
    'inquiry',
    'low'
);
/*
 Core Institution Tables
 ----------------------
 These tables form the foundational structure of the school system.
 */
-- Schools: The top-level entity in the system
CREATE TABLE school (
    school_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type school_type NOT NULL,
    address TEXT,
    contact_info JSONB,
    -- Stores multiple contact details in flexible format
    license_info JSONB,
    -- Stores licensing and certification details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
-- Academic years: Define the school years
CREATE TABLE academic_year (
    academic_year_id SERIAL PRIMARY KEY,
    school_id INT REFERENCES school(school_id),
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    -- Only one year should be current
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);
--
-- Semester/Terms within academic years
CREATE TABLE semester (
    semester_id SERIAL PRIMARY KEY,
    academic_year_id INT REFERENCES academic_year(academic_year_id),
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_semester_dates CHECK (end_date > start_date)
);
--
-- award table
CREATE TABLE award(
    award_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    semester_id INT REFERENCES semester(semester_id),
    awarded_by VARCHAR(100),
    awared_for VARCHAR(100),
    school_id INT REFERENCES school(school_id)
);
--Facility available 
CREATE TABLE facility (
    facility_id SERIAL PRIMARY KEY,
    facility_name VARCHAR(50),
    type facility_type,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
--Facility in schools
CREATE TABLE school_facility(
    school_id INT REFERENCES school(school_id),
    facility_id INT REFERENCES facility(facility_id),
    notes varchar(100),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
/*
 Organizational Structure
 -----------------------
 Department and class form the organizational hierarchy within school
 */
-- Department: Academic divisions within school
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    school_id INT REFERENCES school(school_id),
    name VARCHAR(100) NOT NULL,
    -- e.g., "Mathematics", "Sciences"
    description TEXT,
    head_of_department INT,
    -- References staff table (added later)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
/*
 Staff and Users Management
 ------------------------
 Handles all personnel-related data including authentication and authorization
 */
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role user_role NOT NULL,
    password_hash TEXT NOT NULL,
    emergency_contacts JSONB,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
-- Staff: All employees including teacher and administrative staff
CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    school_id INT REFERENCES school(school_id),
    department_id INT REFERENCES department(department_id),
    user_id INT REFERENCES users(user_id),
    employment_status employment_status,
    -- e.g., "full-time", "part-time"
    qualifications JSONB,
    join_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
-- Add foreign key for department head after staff table exists
ALTER TABLE department
ADD CONSTRAINT fk_head_teacher FOREIGN KEY (head_of_department) REFERENCES staff(staff_id);
--
-- Teacher: Specialized staff record for teaching personnel
CREATE TABLE teacher (
    teacher_id SERIAL PRIMARY KEY,
    staff_id INT REFERENCES staff(staff_id),
    specialization VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
/*
 Academic Structure
 -----------------
 Defines the academic organization: class, stream, and subject
 */
-- Class: Main classes
CREATE TABLE class (
    class_id SERIAL PRIMARY KEY,
    school_id INT REFERENCES school(school_id),
    teacher_id INT REFERENCES teacher(teacher_id),
    -- Class teacher
    name VARCHAR(50) NOT NULL,
    -- e.g., "Grade 1", "Form 4"
    grade_level INTEGER NOT NULL,
    academic_year_id INT REFERENCES academic_year(academic_year_id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_grade_level CHECK (grade_level > 0)
);
--
-- Stream: Divisions within class (e.g., "1A", "1B")
CREATE TABLE stream (
    stream_id SERIAL PRIMARY KEY,
    class_id INT REFERENCES class(class_id),
    stream_name VARCHAR(50) NOT NULL,
    capacity INTEGER,
    -- Maximum number of student
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
-- Subject: Courses taught
CREATE TABLE subject (
    subject_id SERIAL PRIMARY KEY,
    department_id INT REFERENCES department(department_id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    -- Subject code e.g., "MATH101"
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
/*
 Student and Parent Management
 ----------------------------
 Handles student enrollment and parent/guardian information
 */
-- Parent/Guardians
CREATE TABLE parent (
    parent_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    relationship_type relationship_type NOT NULL,
    -- e.g., "father", "mother", "guardian"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
-- Student
CREATE TABLE student (
    student_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    date_of_birth DATE NOT NULL,
    medical_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
--current school a student is in
CREATE TABLE student_school (
    student_id INT REFERENCES student(student_id),
    stream_id INT REFERENCES stream(stream_id),
    admission_number VARCHAR(20) UNIQUE,
    admission_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    PRIMARY KEY (student_id, stream_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
--parent student relationship
CREATE TABLE parent_student(
    parent_id INT REFERENCES parent(parent_id),
    student_id INT REFERENCES student(student_id),
    PRIMARY KEY (parent_id, student_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
/*
 Academic Records
 ---------------
 Tracks attendance, examinations, and academic performance
 */
--attendace
--
-- Daily attendance tracking
CREATE TABLE attendance_record (
    attendance_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student(student_id),
    status attendance_status NOT NULL,
    reason TEXT,
    date_taken DATE NOT NULL,
    staff_id REFERENCES staff(staff_id),
    -- Required for absences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
-- Examinations
CREATE TABLE exam (
    exam_id SERIAL PRIMARY KEY,
    semester_id INT REFERENCES semester(semester_id),
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    type exam_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
-- Individual exam sittings for each subjects
CREATE TABLE exam_sitting (
    exam_sitting_id SERIAL PRIMARY KEY,
    exam_id INT REFERENCES exam(exam_id),
    supervisor INT REFERENCES teacher(teacher_id),
    subject_id INT REFERENCES subject(subject_id),
    stream_id INT REFERENCES stream(stream_id),
    out_of DECIMAL(5, 2),
    remarks TEXT,
    sitting_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_marks INTEGER NOT NULL,
    CONSTRAINT valid_marks CHECK (total_marks > 0),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
--student result
CREATE TABLE result(
    student_id INT REFERENCES student(student_id),
    marked_by INT REFERENCES teacher(teacher_id),
    marks_obtained DECIMAL(5, 2),
    exam_sitting_id INT REFERENCES exam_sitting(exam_sitting_id),
    PRIMARY KEY (student_id, exam_sitting_id),
    CONSTRAINT valid_marks_obtained CHECK (marks_obtained >= 0),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
/*
 Communication tables
 -----------------------
 Tables that allow communication of users in the system
 */
--
--table for messages
CREATE TABLE messages(
    message_id SERIAL PRIMARY KEY,
    message_details VARCHAR(200),
    topic VARCHAR(30),
    severity severity,
    sender INT REFERENCES users(user_id),
    recepient INT REFERENCES users(user_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
--
--- announcement table
CREATE TABLE announcement(
    announcement_id SERIAL PRIMARY KEY,
    announcement VARCHAR(500),
    semester_id INT REFERENCES semester(semester_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_for DATE NOT NULL,
    valid_upto DATE NOT NULL,
    scope event_scope NOT NULL,
    made_by INT REFERENCES users(user_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
/*
 Financial Management
 -------------------
 Handles fee structures and payment tracking
 */
-- Fee categories
CREATE TABLE fee_type (
    fee_type_id SERIAL PRIMARY KEY,
    school_id INT REFERENCES school(school_id),
    name fee_type_enum NOT NULL,
    -- e.g., "Tuition", "Library", "Sports"
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
-- Fee structure
CREATE TABLE fee (
    fee_id SERIAL PRIMARY KEY,
    fee_type_id INT REFERENCES fee_type(fee_type_id),
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE,
    academic_year_id INT REFERENCES academic_year(academic_year_id),
    class_id INT REFERENCES class(class_id),
    -- Different fee for different class
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_amount CHECK (amount >= 0),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
-- Payment records
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student(student_id),
    fee_id INT REFERENCES fee(fee_id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_method payment_method NOT NULL,
    -- e.g., "cash", "bank_transfer"
    status payment_status DEFAULT 'pending',
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_payment_amount CHECK (amount > 0),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
/*
 Events tables
 -----------------------
 Tables that allow event creation and participation
 */
--
-- Main events table
CREATE TABLE event (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    scope event_scope NOT NULL,
    semester_id INT REFERENCES semester(semester_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(user_id),
    CONSTRAINT valid_event_dates CHECK (end_date > start_date),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
-- This table handles which schools are participating (for inter-school events)
CREATE TABLE event_school_participant (
    event_id INT REFERENCES event(event_id),
    school_id INT REFERENCES school(school_id),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status participation_status DEFAULT 'registered',
    -- 'registered', 'withdrawn', 'disqualified'
    PRIMARY KEY (event_id, school_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
-- This table handles which classes are participating
CREATE TABLE event_class_participant (
    event_id INT REFERENCES event(event_id),
    class_id INT REFERENCES class(class_id),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status participation_status DEFAULT 'registered',
    PRIMARY KEY (event_id, class_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
-- This table handles which streams are participating
CREATE TABLE event_stream_participant (
    event_id INT REFERENCES event(event_id),
    stream_id INT REFERENCES stream(stream_id),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status participation_status DEFAULT 'registered',
    PRIMARY KEY (event_id, stream_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
--
-- This table tracks individual users participation
CREATE TABLE event_user_participant (
    event_id INT REFERENCES event(event_id),
    user_id INT REFERENCES users(user_id),
    participant_type participant_type NOT NULL,
    -- 'student', 'teacher', 'staff', 'guest'
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    attendance_status participation_status DEFAULT 'registered',
    -- 'registered', 'attended', 'absent'
    role event_role,
    -- 'participant', 'organizer', 'judge', 'supervisor'
    PRIMARY KEY (event_id, user_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
/*
 Many-to-Many Relationships
 -------------------------
 Junction tables for handling many-to-many relationships
 */
-- Teacher to Subject mapping
CREATE TABLE teacher_subject (
    teacher_id INT REFERENCES teacher(teacher_id),
    subject_id INT REFERENCES subject(subject_id),
    assigned_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (teacher_id, subject_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
-- Student to Subject enrollment
CREATE TABLE student_subject (
    student_id INT REFERENCES student(student_id),
    subject_id INT REFERENCES subject(subject_id),
    academic_year_id INT REFERENCES academic_year(academic_year_id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (student_id, subject_id, academic_year_id),
    deleted_at TIMESTAMP WITH TIME ZONE -- For soft deletes
);
CREATE TABLE timetable_slot (
    slot_id SERIAL PRIMARY KEY,
    day_of_week INT NOT NULL CHECK (
        day_of_week BETWEEN 1 AND 7
    ),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL CHECK (end_time > start_time),
    room_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_time_slot UNIQUE (day_of_week, start_time, end_time)
);
CREATE TABLE slot_assignment (
    assignment_id SERIAL PRIMARY KEY,
    slot_id INT NOT NULL REFERENCES timetable_slot(slot_id),
    stream_id INT REFERENCES stream(stream_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    teacher_id INT NOT NULL REFERENCES teacher(teacher_id),
    subject_id INT NOT NULL REFERENCES subject(subject_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_slot_teacher_stream UNIQUE (slot_id, teacher_id, stream_id)
);
-- Create the main reviews table
CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    reviewer_id INT NOT NULL REFERENCES users(user_id),
    entity_type reviewable_entity NOT NULL,
    -- Reference to the specific entity being reviewed
    school_id INT REFERENCES school(school_id),
    school_facility_id INT NULL,
    -- Will be populated for school facility reviews
    event_id INT NULL REFERENCES event(event_id),
    teacher_id INT NULL REFERENCES teacher(teacher_id),
    -- Review content
    rating INTEGER NOT NULL,
    title VARCHAR(100),
    content TEXT NOT NULL,
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    -- For soft deletes
    -- Validation constraints
    CONSTRAINT valid_rating CHECK (
        rating >= 1
        AND rating <= 5
    ),
    CONSTRAINT valid_entity_reference CHECK (
        CASE
            WHEN entity_type = 'school' THEN school_id IS NOT NULL
            AND school_facility_id IS NULL
            AND event_id IS NULL
            AND teacher_id IS NULL
            WHEN entity_type = 'school_facility' THEN school_id IS NOT NULL
            AND school_facility_id IS NOT NULL
            AND event_id IS NULL
            AND teacher_id IS NULL
            WHEN entity_type = 'event' THEN event_id IS NOT NULL
            AND school_id IS NULL
            AND school_facility_id IS NULL
            AND teacher_id IS NULL
            WHEN entity_type = 'teacher' THEN teacher_id IS NOT NULL
            AND school_id IS NULL
            AND school_facility_id IS NULL
            AND event_id IS NULL
        END
    )
);
/*
 Performance Optimization
 -----------------------
 Indexes for frequently accessed columns
 */
CREATE INDEX idx_student_admission_number ON student(admission_number);
CREATE INDEX idx_student_school_id ON student(school_id);
CREATE INDEX idx_staff_school_id ON staff(school_id);
CREATE INDEX idx_payment_student_id ON payment(student_id);
CREATE INDEX idx_exam_sitting_student_id ON exam_sitting(student_id);
CREATE INDEX idx_attendance_student_id ON attendance_record(student_id);
CREATE INDEX idx_event_scope ON event(scope);
CREATE INDEX idx_event_date ON event(start_date, end_date);
CREATE INDEX idx_event_user_participant ON event_user_participant(event_id, user_id);
CREATE INDEX idx_event_school_participant ON event_school_participant(event_id, school_id);
CREATE INDEX idx_review_entity_type ON review(entity_type);
CREATE INDEX idx_review_school ON review(school_id)
WHERE school_id IS NOT NULL;
CREATE INDEX idx_review_facility ON review(school_facility_id)
WHERE school_facility_id IS NOT NULL;
CREATE INDEX idx_review_event ON review(event_id)
WHERE event_id IS NOT NULL;
CREATE INDEX idx_review_teacher ON review(teacher_id)
WHERE teacher_id IS NOT NULL;
/*
 Usage Notes:
 -----------
 1. Always use parameterized queries to prevent SQL injection
 2. Implement appropriate access control at the application level
 3. Regular backup of the database is recommended
 4. Monitor and analyze query performance periodically
 5. Consider implementing partitioning for large tables (e.g., attendance_record)
 6. Implement appropriate archival strategy for historical data
 
 Common Queries:
 -------------
 1. Student academic performance:
 - Join exam_sitting with exam and student
 2. Fee balance:
 - Join payment with fee and student
 3. Class attendance:
 - Join attendance_record with student and class
 4. Teacher schedules:
 - Join timetable_slot with teacher and subject
 */
-- 1. Get all users who participated in an event, including their school/class context
/*
 Automated Timestamp Updates
 --------------------------
 Trigger function to automatically update updated_at timestamps
 */
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';
CREATE OR REPLACE VIEW event_participation_details AS
SELECT e.event_id,
    e.name AS event_name,
    e.scope,
    u.user_id,
    u.first_name,
    u.last_name,
    eup.participant_type,
    eup.role,
    sch.school_id,
    sch.name AS school_name,
    c.class_id,
    c.name AS class_name,
    str.stream_id,
    str.stream_name
FROM event e
    JOIN event_user_participant eup ON e.event_id = eup.event_id
    JOIN users u ON eup.user_id = u.user_id
    LEFT JOIN student s ON u.user_id = s.user_id
    LEFT JOIN student_school ss ON s.student_id = ss.student_id
    LEFT JOIN stream str ON ss.stream_id = str.stream_id
    LEFT JOIN class c ON str.class_id = c.class_id
    LEFT JOIN school sch ON c.school_id = sch.school_id;
-- 2. Get all participants (schools, classes, streams, and users) for an event
CREATE OR REPLACE FUNCTION get_event_participants(p_event_id INT) RETURNS TABLE (
        participant_type VARCHAR,
        participant_id INT,
        participant_name VARCHAR,
        participation_level VARCHAR
    ) AS $$ BEGIN -- Return schools
    RETURN QUERY
SELECT 'school'::VARCHAR,
    esp.school_id,
    s.name,
    'school_level'::VARCHAR
FROM event_school_participant esp
    JOIN school s ON esp.school_id = s.school_id
WHERE esp.event_id = p_event_id;
-- Return classes
RETURN QUERY
SELECT 'class'::VARCHAR,
    ecp.class_id,
    c.name,
    'class_level'::VARCHAR
FROM event_class_participant ecp
    JOIN class c ON ecp.class_id = c.id
WHERE ecp.event_id = p_event_id;
-- Return streams
RETURN QUERY
SELECT 'stream'::VARCHAR,
    esp.stream_id,
    s.stream_name,
    'stream_level'::VARCHAR
FROM event_stream_participant esp
    JOIN stream s ON esp.stream_id = s.id
WHERE esp.event_id = p_event_id;
-- Return individual users
RETURN QUERY
SELECT 'user'::VARCHAR,
    eup.user_id,
    u.first_name || ' ' || u.last_name,
    eup.participant_type
FROM event_user_participant eup
    JOIN users u ON eup.user_id = u.user_id
WHERE eup.event_id = p_event_id;
END;
$$ LANGUAGE plpgsql;
-- Add trigger for updating the updated_at timestamp
CREATE TRIGGER update_review_updated_at BEFORE
UPDATE ON review FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Create helpful views for each type of review
CREATE VIEW school_reviews AS
SELECT r.*,
    u.first_name || ' ' || u.last_name as reviewer_name,
    s.name as school_name
FROM review r
    JOIN users u ON r.reviewer_id = u.user_id
    JOIN school s ON r.school_id = s.school_id
WHERE r.entity_type = 'school'
    AND r.deleted_at IS NULL;
CREATE VIEW facility_reviews AS
SELECT r.*,
    u.first_name || ' ' || u.last_name as reviewer_name,
    s.name as school_name,
    f.facility_name
FROM review r
    JOIN users u ON r.reviewer_id = u.user_id
    JOIN school s ON r.school_id = s.school_id
    JOIN facility f ON r.school_facility_id = f.facility_id
WHERE r.entity_type = 'school_facility'
    AND r.deleted_at IS NULL;
CREATE VIEW event_reviews AS
SELECT r.*,
    u.first_name || ' ' || u.last_name as reviewer_name,
    e.name as event_name
FROM review r
    JOIN users u ON r.reviewer_id = u.user_id
    JOIN event e ON r.event_id = e.event_id
WHERE r.entity_type = 'event'
    AND r.deleted_at IS NULL;
CREATE VIEW teacher_reviews AS
SELECT r.*,
    u.first_name || ' ' || u.last_name as reviewer_name,
    t_u.first_name || ' ' || t_u.last_name as teacher_name
FROM review r
    JOIN users u ON r.reviewer_id = u.user_id
    JOIN teacher t ON r.teacher_id = t.teacher_id
    JOIN staff s ON t.staff_id = s.staff_id
    JOIN users t_u ON s.user_id = t_u.user_id
WHERE r.entity_type = 'teacher'
    AND r.deleted_at IS NULL;
-- Apply the trigger to relevant tables
CREATE TRIGGER update_schools_updated_at BEFORE
UPDATE ON school FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_updated_at BEFORE
UPDATE ON student FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE
UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
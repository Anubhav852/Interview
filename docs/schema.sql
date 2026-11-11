-- GRIT interview scheduling schema (PostgreSQL). Times stored in UTC, shown in IST.
CREATE TABLE students(id serial PRIMARY KEY,name text NOT NULL,batch text,approved bool DEFAULT true,miles_on_hold int DEFAULT 0,miles_credited int DEFAULT 0);
CREATE TABLE skill_clearances(student_id int REFERENCES students,skill text,level int,cleared_at timestamptz,PRIMARY KEY(student_id,skill,level));
CREATE TABLE badge_requirements(badge text,skill text,level int,PRIMARY KEY(badge,skill,level));
CREATE TABLE interviewers(id serial PRIMARY KEY,name text NOT NULL,active bool DEFAULT true);
CREATE TABLE availability_rules(interviewer_id int REFERENCES interviewers,weekday int CHECK(weekday BETWEEN 0 AND 6),start_hour int,PRIMARY KEY(interviewer_id,weekday,start_hour));
CREATE TABLE availability_overrides(interviewer_id int REFERENCES interviewers,date date,hour int,kind text CHECK(kind IN('off','block','extra')),PRIMARY KEY(interviewer_id,date,hour));
CREATE TABLE interviews(id serial PRIMARY KEY,student_id int REFERENCES students,interviewer_id int REFERENCES interviewers,start_at timestamptz NOT NULL,end_at timestamptz NOT NULL,
 status text CHECK(status IN('booked','pass','fail','retake','noshow','cancelled_student','cancelled_interviewer')),attempt_no int,reschedule_count int DEFAULT 0,created_at timestamptz DEFAULT now(),
 UNIQUE(interviewer_id,start_at));
CREATE UNIQUE INDEX one_active_booking ON interviews(student_id) WHERE status='booked';
CREATE TABLE interview_outcomes(interview_id int PRIMARY KEY REFERENCES interviews,result text,rubric jsonb,notes text,focus_areas text[],cooldown_until date,retake_after date,recorded_by text,recorded_at timestamptz DEFAULT now());
CREATE TABLE badges(student_id int REFERENCES students,badge text,status text CHECK(status IN('awarded','nullified')),miles_awarded int,PRIMARY KEY(student_id,badge));
CREATE TABLE integrity_flags(id serial PRIMARY KEY,student_id int REFERENCES students,interview_id int REFERENCES interviews,reason text,status text CHECK(status IN('open','upheld','dismissed')),created_at timestamptz DEFAULT now());
CREATE TABLE notifications(id serial PRIMARY KEY,student_id int REFERENCES students,type text,title text,body text,sent_at timestamptz DEFAULT now(),read_at timestamptz);
CREATE TABLE audit_log(id serial PRIMARY KEY,actor text,action text,target text,at timestamptz DEFAULT now());

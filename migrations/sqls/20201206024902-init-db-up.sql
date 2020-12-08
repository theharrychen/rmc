-- Creating Tables
CREATE TABLE university (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    name varchar(255) UNIQUE NOT NULL,
    country varchar(255),
    province varchar(255),
    city varchar(255),
    website varchar(255)
);
CREATE TABLE department (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    field varchar(255) NOT NULL,
    university_id INT,
    FOREIGN KEY (university_id) REFERENCES university (id)
);
CREATE TABLE course (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    code varchar(255) NOT NULL,
    department_id INT,
    subject varchar(255) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id)
);
CREATE TABLE app_user (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(60) NOT NULL
);
CREATE TABLE student (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    user_id INT,
    university_id INT,
    FOREIGN KEY (user_id) REFERENCES app_user (id),
    FOREIGN KEY (university_id) REFERENCES university (id)
);
CREATE TABLE review (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    course_id INT,
    student_id INT,
    rating decimal CHECK (
        rating >= 1
        AND rating <= 5
    ),
    professor varchar(255),
    difficulty decimal CHECK (
        difficulty >= 1
        AND difficulty <= 5
    ),
    comments varchar(255),
    FOREIGN KEY (course_id) REFERENCES course (id),
    FOREIGN KEY (student_id) REFERENCES student (id)
);
CREATE TABLE admin (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES app_user (id)
);
CREATE TABLE news_post (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    admin_id INT,
    title varchar(255) NOT NULL,
    body varchar(255),
    FOREIGN KEY (admin_id) REFERENCES admin (id)
);
CREATE TABLE course_request (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    code varchar(255) NOT NULL,
    student_id INT,
    subject varchar(255) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student (id)
);
CREATE TABLE university_rating (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    university_id INT,
    student_id INT,
    comments varchar(255),
    safety_rating decimal CHECK (
        safety_rating >= 1
        AND safety_rating <= 5
    ),
    facilities_rating decimal CHECK (
        facilities_rating >= 1
        AND facilities_rating <= 5
    ),
    opportunities_rating decimal CHECK (
        opportunities_rating >= 1
        AND opportunities_rating <= 5
    ),
    FOREIGN KEY (university_id) REFERENCES university (id),
    FOREIGN KEY (student_id) REFERENCES student (id)
);
CREATE TABLE approve (
    id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 100 INCREMENT BY 1) PRIMARY KEY,
    course_id INT,
    code varchar(255) NOT NULL,
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admin (id),
    FOREIGN KEY (course_id) REFERENCES course (id)
);
-- Seeding Database Data
INSERT INTO university (id, name, country, province, city, website) 
VALUES (1, 'University of Calgary', 'Canada', 'Alberta', 'Calgary', 'https://www.ucalgary.ca/');

INSERT INTO university (id, name, country, province, city, website) 
VALUES (2, 'MIT', 'USA', 'Massachusetts', 'Cambridge', 'https://www.mit.edu/');

-- Departments
INSERT INTO department (id, field, university_id)
VALUES (1, 'Computer Science', 1);

INSERT INTO department (id, field, university_id)
VALUES (2, 'Math', 1);

INSERT INTO department (id, field, university_id)
VALUES (3, 'Computer Science', 2);

-- Courses
INSERT INTO course (id, code, department_id, subject)
VALUES (1, 'CPSC 471', 1, 'Computer Science');

INSERT INTO course (id, code, department_id, subject)
VALUES (2, 'CPSC 453', 1, 'Computer Science');

-- App Users
INSERT INTO app_user (id, username, email, password)
VALUES (1, 'harry', 'harry@rmc.ca', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm'); -- Admin
INSERT INTO app_user (id, username, email, password)
VALUES (2, 'jesse', 'jesse@rmc.ca', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm'); -- Admin
INSERT INTO app_user (id, username, email, password)
VALUES (3, 'billy', 'billy@ucalgary.ca', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');
INSERT INTO app_user (id, username, email, password)
VALUES (4, 'amy', 'amy@ucalgary.ca', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');
INSERT INTO app_user (id, username, email, password)
VALUES (5, 'carl', 'carl@ucalgary.ca', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');
INSERT INTO app_user (id, username, email, password)
VALUES (6, 'juan', 'juan@ucalgary.ca', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');
INSERT INTO app_user (id, username, email, password)
VALUES (7, 'emily', 'emily@mit.edu', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');
INSERT INTO app_user (id, username, email, password)
VALUES (8, 'chris', 'chris@mit.edu', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');
INSERT INTO app_user (id, username, email, password)
VALUES (9, 'kyle', 'kyle@mit.edu', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');
INSERT INTO app_user (id, username, email, password)
VALUES (10, 'stephanie', 'stephanie@mit.edu', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');
INSERT INTO app_user (id, username, email, password)
VALUES (11, 'ellie', 'ellie@mit.edu', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');
INSERT INTO app_user (id, username, email, password)
VALUES (12, 'joel', 'joel@mit.edu', '$2a$10$Rw7evnNydFbmlv6Z4qMyO.BzSU7LBVAp2BLob0lHgzrFWTKKafaPm');

-- Students
INSERT INTO student (id, user_id, university_id)
VALUES (1, 3, 1);
INSERT INTO student (id, user_id, university_id)
VALUES (2, 4, 1);
INSERT INTO student (id, user_id, university_id)
VALUES (3, 5, 1);
INSERT INTO student (id, user_id, university_id)
VALUES (4, 6, 1);
INSERT INTO student (id, user_id, university_id)
VALUES (5, 7, 2);
INSERT INTO student (id, user_id, university_id)
VALUES (6, 8, 2);
INSERT INTO student (id, user_id, university_id)
VALUES (7, 9, 2);
INSERT INTO student (id, user_id, university_id)
VALUES (8, 10, 2);
INSERT INTO student (id, user_id, university_id)
VALUES (9, 11, 2);
INSERT INTO student (id, user_id, university_id)
VALUES (10, 12, 2);

-- Admins
INSERT INTO admin (id, user_id)
VALUES (1, 1);
INSERT INTO admin (id, user_id)
VALUES (2, 2);

-- Reviews
INSERT INTO review (id, course_id, student_id, rating, professor, difficulty, comments)
VALUES (1, 1, 1, 1, 'Dr. Won', 1, 'uno');

INSERT INTO review (id, course_id, student_id, rating, professor, difficulty, comments)
VALUES (2, 2, 2, 2, 'Dr. First Loser', 2, 'dos');

INSERT INTO review (id, course_id, student_id, rating, professor, difficulty, comments)
VALUES (3, 1, 2, 1, 'General Kenobi?', 1, 'hello there');

INSERT INTO review (id, course_id, student_id, rating, professor, difficulty, comments)
VALUES (4, 2, 1, 3, 'Run of the mill professor', 3, 'dis course aight');

-- University Ratings
INSERT INTO university_rating (id, university_id, student_id, comments, safety_rating, facilities_rating, opportunities_rating)
VALUES (1, 1, 1, 'comment', 1, 1, 1);

INSERT INTO university_rating (id, university_id, student_id, comments, safety_rating, facilities_rating, opportunities_rating)
VALUES (2, 2, 10, 'comment2', 2, 2, 2);

-- News Posts
INSERT INTO news_post (id, admin_id, title, body)
VALUES (1, 1, 'tits', 'nough said');

INSERT INTO news_post (id, admin_id, title, body)
VALUES (2, 2, 'not appropriate Harry!!', 'I think you have some explaining to do');

-- Course Requests
INSERT INTO course_request (id, code, student_id, subject)
VALUES (1, 'CPSC 999', 1, 'Computer Science');

INSERT INTO course_request (id, code, student_id, subject)
VALUES (2, 'CPSC 901', 1, 'Computer Science');

INSERT INTO course_request (id, code, student_id, subject)
VALUES (3, 'MATH 888', 2, 'Math');
CREATE TABLE university (
    name varchar(255) PRIMARY KEY,
    country varchar(255),
    province varchar(255),
    city varchar(255),
    website varchar(255)
);
CREATE TABLE department (
    field varchar(255),
    uni_name varchar(255),
    PRIMARY KEY (field),
    FOREIGN KEY (uni_name) REFERENCES university (name)
);
CREATE TABLE course (
    code varchar(255),
    department varchar(255),
    subject varchar(255),
    PRIMARY KEY (code),
    FOREIGN KEY (department) REFERENCES department (field)
);
CREATE TABLE "user" (
    username varchar(255) PRIMARY KEY,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL
);
CREATE TABLE review (
    course_code varchar(255) PRIMARY KEY,
    reviewer varchar(255),
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
    FOREIGN KEY (reviewer) REFERENCES "user" (username),
    FOREIGN KEY (course_code) REFERENCES course (code)
);
CREATE TABLE student (
    username varchar(255) REFERENCES "user" PRIMARY KEY,
    university_name varchar(255),
    FOREIGN KEY (university_name) REFERENCES university (name)
);
CREATE TABLE admin (
    username varchar(255) REFERENCES "user" PRIMARY KEY
);
CREATE TABLE news_post (
    id integer PRIMARY KEY,
    author varchar(255),
    title varchar(255) NOT NULL,
    body varchar(255),
    FOREIGN KEY (author) REFERENCES admin (username)
);
CREATE TABLE course_request (
    code varchar(255) PRIMARY KEY,
    student_username varchar(255),
    subject varchar(255) NOT NULL,
    FOREIGN KEY (student_username) REFERENCES student (username)
);
CREATE TABLE university_rating (
    uni_name varchar(255),
    student_name varchar(255),
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
    FOREIGN KEY (uni_name) REFERENCES university (name),
    FOREIGN KEY (student_name) REFERENCES student (username)
);
CREATE TABLE approve (
    code varchar(255) REFERENCES course_request,
    admin varchar(255),
    FOREIGN KEY (admin) REFERENCES admin (username)
);
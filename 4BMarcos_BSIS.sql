CREATE DATABASE IF NOT EXISTS `ACTS`;
USE `ACTS`;

-- Login accounts for the PHP session requirement.
DROP TABLE IF EXISTS `TBL_USERS`;
CREATE TABLE `TBL_USERS` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `UN` VARCHAR(50) NOT NULL,
    `PW` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `UK_USERNAME` (`UN`)
) ENGINE=InnoDB;

-- Default account: username = admin, password = admin123
INSERT INTO `TBL_USERS` (`UN`, `PW`) VALUES
('admin', '$2y$12$EhZW8EFN7a6/gySCIJB.YOKrdT2aV9yZq99BPQmtem5Y/9jk.P3fe');


DROP TABLE IF EXISTS `TBL_SUBJECT`;
DROP TABLE IF EXISTS `TBL_SCHOOLYEAR`;
DROP TABLE IF EXISTS `TBL_TERM`;
DROP TABLE IF EXISTS `TBL_SECTION`;
DROP TABLE IF EXISTS `TBL_YEARLEVEL`;
DROP TABLE IF EXISTS `TBL_COURSE`;

CREATE TABLE `TBL_COURSE` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `COURSE` VARCHAR(20) NOT NULL,
    `DESCRIPTION` VARCHAR(150) NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `UK_COURSE` (`COURSE`)
) ENGINE=InnoDB;

CREATE TABLE `TBL_YEARLEVEL` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `YEARLEVEL` VARCHAR(10) NOT NULL,
    `DESCRIPTION` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `UK_YEARLEVEL` (`YEARLEVEL`)
) ENGINE=InnoDB;

CREATE TABLE `TBL_SECTION` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `SECTION` VARCHAR(10) NOT NULL,
    `DESCRIPTION` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `UK_SECTION` (`SECTION`)
) ENGINE=InnoDB;

CREATE TABLE `TBL_TERM` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `TERM` VARCHAR(20) NOT NULL,
    `DESCRIPTION` VARCHAR(80) NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `UK_TERM` (`TERM`)
) ENGINE=InnoDB;

CREATE TABLE `TBL_SCHOOLYEAR` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `SCHOOLYEAR` VARCHAR(20) NOT NULL,
    `DESCRIPTION` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `UK_SCHOOLYEAR` (`SCHOOLYEAR`)
) ENGINE=InnoDB;

CREATE TABLE `TBL_SUBJECT` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `COURSE` VARCHAR(20) NOT NULL,
    `YEARLEVEL` VARCHAR(10) NOT NULL,
    `TERM` VARCHAR(20) NOT NULL,
    `CODE` VARCHAR(30) NOT NULL,
    `TITLE` VARCHAR(200) NOT NULL,
    `LECTURE` DECIMAL(4,1) NOT NULL,
    `LABORATORTY` DECIMAL(4,1) NOT NULL,
    `CREDIT` DECIMAL(4,1) NOT NULL,
    `GRADE` DECIMAL(5,2) NULL,
    `PRE_REQUISITE` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `UK_SUBJECT_CODE` (`COURSE`,`CODE`)
) ENGINE=InnoDB;

INSERT INTO `TBL_COURSE` (`COURSE`,`DESCRIPTION`) VALUES
('BSIS','Bachelor of Science in Information System');

INSERT INTO `TBL_YEARLEVEL` (`YEARLEVEL`,`DESCRIPTION`) VALUES
('1ST','FIRST YEAR'),
('2ND','SECOND YEAR'),
('3RD','THIRD YEAR'),
('4TH','FOURTH YEAR');

INSERT INTO `TBL_SECTION` (`SECTION`,`DESCRIPTION`) VALUES
('A','Section A'),
('B','Section B'),
('C','Section C'),
('D','Section D'),
('E','Section E'),
('F','Section F'),
('G','Section G');

INSERT INTO `TBL_TERM` (`TERM`,`DESCRIPTION`) VALUES
('1ST SEM','FIRST SEMESTER'),
('2ND SEM','SECOND SEMESTER'),
('SUMMER','SUMMER CLASS'),
('TUTORIAL','TUTORIAL CLASS');

INSERT INTO `TBL_SCHOOLYEAR` (`SCHOOLYEAR`,`DESCRIPTION`) VALUES
('2018-2019','AY 2018-2019'),
('2024-2025','AY 2024-2025'),
('2025-2026','AY 2025-2026'),
('2026-2027','AY 2026-2027');

INSERT INTO `TBL_SUBJECT`
(`COURSE`,`YEARLEVEL`,`TERM`,`CODE`,`TITLE`,`LECTURE`,`LABORATORTY`,`CREDIT`,`GRADE`,`PRE_REQUISITE`) VALUES
('BSIS','1ST','1ST SEM','CC101','Introduction to Computing',3,0,3,NULL,'NONE'),
('BSIS','1ST','1ST SEM','CC102','Computer Programming 1',3,0,3,NULL,'NONE'),
('BSIS','1ST','1ST SEM','GE1','Understanding the Self',3,0,3,NULL,'NONE'),
('BSIS','1ST','1ST SEM','GE2','Mathematics in the Modern World',3,0,3,NULL,'NONE'),
('BSIS','1ST','1ST SEM','MATH1','Calculus',3,0,3,NULL,'NONE'),
('BSIS','1ST','1ST SEM','PE1','Physical Fitness & Gymnastics',2,0,2,NULL,'NONE'),
('BSIS','1ST','1ST SEM','NSTP113','National Service Training Program',3,0,3,NULL,'NONE'),

('BSIS','1ST','2ND SEM','IS101','Fund. of Information Systems',3,0,3,NULL,'NONE'),
('BSIS','1ST','2ND SEM','CC103','Computer Programming 2',2,1,3,NULL,'NONE'),
('BSIS','1ST','2ND SEM','IDBM1','Intro. Database Management',2,1,3,NULL,'NONE'),
('BSIS','1ST','2ND SEM','GE3','Readings in Philippine History',3,0,3,NULL,'NONE'),
('BSIS','1ST','2ND SEM','GE4','Purposive Communication',3,0,3,NULL,'NONE'),
('BSIS','1ST','2ND SEM','PE2','Rhythmic Activities',2,0,2,NULL,'PE1'),
('BSIS','1ST','2ND SEM','NSTP123','National Service Training Program',3,0,3,NULL,'NSTP113'),

('BSIS','2ND','1ST SEM','CC104','Data Structures and Algorithms',2,1,3,NULL,'CC103'),
('BSIS','2ND','1ST SEM','DM101','Org. and Mgmt. Concepts',3,0,3,NULL,'NONE'),
('BSIS','2ND','1ST SEM','DM102','Financial Management',3,0,3,NULL,'NONE'),
('BSIS','2ND','1ST SEM','GE5','The Contemporary World',3,0,3,NULL,'NONE'),
('BSIS','2ND','1ST SEM','GE6','Art Appreciation',3,0,3,NULL,'NONE'),
('BSIS','2ND','1ST SEM','GEELEC1','Living in the IT Era',3,0,3,NULL,'NONE'),
('BSIS','2ND','1ST SEM','PE3','Individual / Dual Sports / Games',2,0,2,NULL,'PE2'),

('BSIS','2ND','2ND SEM','CC105','Information Management 1',3,0,3,NULL,'DM101'),
('BSIS','2ND','2ND SEM','IS103','IT Infrastructure and Network Technology',2,1,3,NULL,'NONE'),
('BSIS','2ND','2ND SEM','IS105','Enterprise Architecture',3,0,3,NULL,'NONE'),
('BSIS','2ND','2ND SEM','MATH2','Discrete Mathematics',3,0,3,NULL,'MATH1'),
('BSIS','2ND','2ND SEM','GE7','Science and Technology',3,0,3,NULL,'CC101'),
('BSIS','2ND','2ND SEM','GEELEC','Environmental Science',3,0,3,NULL,'NONE'),
('BSIS','2ND','2ND SEM','PE4','Team Sports / Games',2,0,2,NULL,'PE3'),

('BSIS','3RD','1ST SEM','DM103','Business Process Management',3,0,3,NULL,'DM102'),
('BSIS','3RD','1ST SEM','IS104','System Analysis and Design',3,0,3,NULL,'IDBM1'),
('BSIS','3RD','1ST SEM','QUAMET','Quantitative Methods',3,0,3,NULL,'MATH2'),
('BSIS','3RD','1ST SEM','ADV01','IS Elective 1',2,1,3,NULL,'3rd Yr Standing'),
('BSIS','3RD','1ST SEM','CC106',"Application Dev't & Emerging Technology",2,1,3,NULL,'CC103'),
('BSIS','3RD','1ST SEM','ADV06','IS Professional Elective',3,0,3,NULL,'3rd Yr Standing'),

('BSIS','3RD','2ND SEM','CAP101','Capstone Project 1',3,0,3,NULL,'QUAMET'),
('BSIS','3RD','2ND SEM','IS106','IS Project Management 1',3,0,3,NULL,'IS104'),
('BSIS','3RD','2ND SEM','ADV03','IS Elective 2',3,0,3,NULL,'ADV01'),
('BSIS','3RD','2ND SEM','DM104','Evaluation of Business Performance',2,1,3,NULL,'DM103'),
('BSIS','3RD','2ND SEM','ADV08','IS Professional Elective 3',3,0,3,NULL,'IDBM1'),
('BSIS','3RD','2ND SEM','GE8','Ethics',3,0,3,NULL,'NONE'),
('BSIS','3RD','2ND SEM','ADV07','IS Professional Elective 2',3,0,3,NULL,'3rd Yr Standing'),

('BSIS','3RD','SUMMER','IS107','IS Strategy, Mgmt., and Acquisition',3,0,3,NULL,'ADV03'),
('BSIS','3RD','SUMMER','ADV04','IS Elective 3',3,0,3,NULL,'IS PROF EL2'),
('BSIS','3RD','SUMMER','IS102','Professional Issues in Information System',3,0,3,NULL,'NONE'),

('BSIS','4TH','1ST SEM','IS108','IS Project Management 2',3,0,3,NULL,'IS106'),
('BSIS','4TH','1ST SEM','CAP102','Capstone Project 2',0,3,3,NULL,'CAP101'),
('BSIS','4TH','1ST SEM','ADV05','IS Elective 4',3,0,3,NULL,'ADV03'),
('BSIS','4TH','1ST SEM','ADV09','IS Professional Elective 4',3,0,3,NULL,'ADV07'),
('BSIS','4TH','1ST SEM','TECHNO','Technopreneurship',3,0,3,NULL,'4th Yr Standing'),
('BSIS','4TH','1ST SEM','RIZAL','Life, Works and Writings of Rizal',3,0,3,NULL,'NONE'),

('BSIS','4TH','2ND SEM','PRACT101','Practicum',0,9,9,NULL,'CAPSTONE 2');

SELECT * FROM `TBL_COURSE`;
SELECT * FROM `TBL_YEARLEVEL`;
SELECT * FROM `TBL_SECTION`;
SELECT * FROM `TBL_TERM`;
SELECT * FROM `TBL_SCHOOLYEAR`;
SELECT * FROM `TBL_SUBJECT`;

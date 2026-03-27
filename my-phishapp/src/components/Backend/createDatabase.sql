CREATE DATABASE phishing_simulator;
USE phishing_simulator;
CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(100),
    target_group VARCHAR(100),
    link_clicked INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    vulnerability varchar(265) DEFAULT 0
);
CREATE TABLE users (
    employee_id INT AUTO_INCREMENT PRIMARY key,
    name VARCHAR(265) not null,
    department varchar(265),
    designation varchar(265),
    email VARCHAR (265) not NULL,
    joining_date DATE,
    password VARCHAR(265) not null
);
CREATE TABLE admins (
    admin_id varchar(265) primary KEY,
    username varchar(265) not NULL,
    company_name varchar(265),
    role varchar(265),
    email VARCHAR(265),
    password VARCHAR(265) DEFAULT "admin",
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE links (
    link_id int auto_increment PRIMARY KEY,
    link_desc VARCHAR(265),
    link_status VARCHAR(265) not NULL,
    target_group varchar(265)
);
CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
campaign_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    email VARCHAR(255),
    clicked BOOLEAN DEFAULT FALSE,
    click_time DATETIME,
    submitted BOOLEAN DEFAULT FALSE
)
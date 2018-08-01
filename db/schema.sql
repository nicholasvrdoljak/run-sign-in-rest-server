
DROP DATABASE IF EXISTS sloppy_moose;

CREATE DATABASE sloppy_moose;

USE sloppy_moose;

CREATE TABLE users (
  `id` INT AUTO_INCREMENT,
  `firstname` VARCHAR(255) NOT NULL,
  `lastname` VARCHAR(255) NOT NULL,
  `dob` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `number_of_runs` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `firstname` (`firstname`),
  INDEX `lastname` (`lastname`),
  INDEX `name` (`firstname`,`lastname`)
);

CREATE TABLE administrator (
  `id` INT AUTO_INCREMENT,
  `username` VARCHAR(255), 
  `password` VARCHAR(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE runs (
  `id` INT AUTO_INCREMENT,
  `hash` VARCHAR(255) UNIQUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_of_run` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `run_date` (`date_of_run`)
);

CREATE TABLE user_runs (
  `id` INT AUTO_INCREMENT,
  `user_id` INT,
  `run_id` INT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`run_id`) REFERENCES `runs` (`id`),
  INDEX `user_id` (`user_id`),
  INDEX `run_id` (`run_id`)
);
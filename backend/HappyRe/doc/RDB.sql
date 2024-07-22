USE happyre;

CREATE TABLE if not exists user (
    id int auto_increment primary KEY,
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NULL, -- The password could be null for Social Login user
    name varchar(255) NOT NULL,
    role varchar(255) DEFAULT 'ROLE_USER',
    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    social_login varchar(255) NULL,
    profile_url varchar(255) NULL
);

CREATE TABLE if not exists `diary` (
    `diary_id` int auto_increment PRIMARY KEY,
    `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id` int NOT NULL,
    `summary` text NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE if not exists `message` (
    `message_id` int auto_increment PRIMARY KEY,
    `diary_id` int NOT NULL,
    `sequence` int NOT NULL,
    `content` text NOT NULL,
    `speaker` enum('ai', 'user') NOT NULL,
    `audio_key` varchar(255) NULL UNIQUE,
    FOREIGN KEY (`diary_id`) REFERENCES `diary`(`diary_id`) ON DELETE CASCADE
);

CREATE TABLE if not exists `diary_emotion` (
    `diary_emotion_id` int auto_increment PRIMARY KEY,
    `diary_id` int NOT NULL,
    `emotion_id` int NOT NULL,
    FOREIGN KEY (`diary_id`) REFERENCES `diary`(`diary_id`) ON DELETE CASCADE
);

CREATE TABLE if not exists `emotion` (
    `emotion_id` int auto_increment PRIMARY KEY,
    `emotion` varchar(255) NOT NULL
);

CREATE TABLE if not exists `keyword` (
    `keyword_id` int PRIMARY KEY,
    `diary_id` int NOT NULL,
    `sequence` int NOT NULL,
    `keyword` varchar(255) NOT NULL,
    `summary` text NOT NULL,
    FOREIGN KEY (`diary_id`) REFERENCES `diary`(`diary_id`) ON DELETE CASCADE
);

CREATE TABLE if not exists `keyword_emotion` (
    `keyword_emotion_id` int PRIMARY KEY,
    `keyword_id` int NOT NULL,
    `emotion_id` int NOT NULL,
    FOREIGN KEY (`keyword_id`) REFERENCES `keyword`(`keyword_id`) ON DELETE CASCADE
);
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

CREATE TABLE if not exists `keyword`(
    `keyword_id` INT PRIMARY KEY,
    `diary_id` INT NOT NULL,
    `sequence` INT NOT NULL,
    `keyword` VARCHAR(255) NOT NULL,
    `summary` TEXT NOT NULL,
    `russell_x` double NULL,
    `russell_y` double NULL,
    FOREIGN KEY (`diary_id`) REFERENCES `diary`(`diary_id`) ON DELETE CASCADE
);

CREATE TABLE if not exists `keyword_emotion` (
    `keyword_emotion_id` int PRIMARY KEY,
    `keyword_id` int NOT NULL,
    `emotion_id` int NOT NULL,
    FOREIGN KEY (`keyword_id`) REFERENCES `keyword`(`keyword_id`) ON DELETE CASCADE
);
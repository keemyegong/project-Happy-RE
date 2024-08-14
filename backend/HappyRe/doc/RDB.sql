use happyre;

DROP Table IF EXISTS `UserWordFrequency`; -- Rename?
DROP TABLE IF EXISTS `user_message_archived`;
DROP TABLE IF EXISTS `user_message_attached_keyword`;
DROP TABLE IF EXISTS `user_message`;
DROP TABLE IF EXISTS `keyword_emotion`;
DROP TABLE IF EXISTS `diary_emotion`;
DROP TABLE IF EXISTS `emotion`;
DROP TABLE IF EXISTS `keyword`;
DROP TABLE IF EXISTS `message`;
DROP TABLE IF EXISTS `diary`;
DROP TABLE IF EXISTS `user_avg`;
DROP TABLE IF EXISTS `user`;


CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'ROLE_USER',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `social_login` varchar(255) DEFAULT NULL,
  `profile_url` varchar(2048) DEFAULT NULL,
  `myfrog` int DEFAULT NULL,
  `russell_x` double DEFAULT NULL,
  `russell_y` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `diary` (
  `diary_id` int NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `summary` text,
  `russell_avg_x` double DEFAULT NULL,
  `russell_avg_y` double DEFAULT NULL,
  PRIMARY KEY (`diary_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `diary_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `keyword` (
  `keyword_id` int NOT NULL AUTO_INCREMENT,
  `diary_id` int NOT NULL,
  `sequence` int NOT NULL,
  `keyword` varchar(255) NOT NULL,
  `summary` text,
  `russell_x` double DEFAULT NULL,
  `russell_y` double DEFAULT NULL,
  `archived` boolean DEFAULT false,
  PRIMARY KEY (`keyword_id`),
  KEY `diary_id` (`diary_id`),
  CONSTRAINT `keyword_ibfk_1` FOREIGN KEY (`diary_id`) REFERENCES `diary` (`diary_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `message` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `diary_id` int NOT NULL,
  `sequence` int NOT NULL,
  `content` text NOT NULL,
  `summary` text,
  `speaker` enum('ai','user') NOT NULL,
  `audio_key` varchar(255) DEFAULT NULL,
  `russell_x` double DEFAULT NULL,
  `russell_y` double DEFAULT NULL,
  `archived` boolean DEFAULT false,
  PRIMARY KEY (`message_id`),
  UNIQUE KEY `audio_key` (`audio_key`),
  KEY `diary_id` (`diary_id`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`diary_id`) REFERENCES `diary` (`diary_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `emotion` (
  `emotion_id` int NOT NULL AUTO_INCREMENT,
  `emotion` varchar(255) NOT NULL,
  PRIMARY KEY (`emotion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `keyword_emotion` (
    `keyword_emotion_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `keyword_id` int NOT NULL,
    `emotion_id` int NOT NULL,
    FOREIGN KEY (`keyword_id`) REFERENCES `keyword`(`keyword_id`) ON DELETE CASCADE
);

CREATE TABLE `diary_emotion` (
  `diary_emotion_id` int NOT NULL AUTO_INCREMENT,
  `diary_id` int NOT NULL,
  `emotion_id` int NOT NULL,
  PRIMARY KEY (`diary_emotion_id`),
  KEY `diary_id` (`diary_id`),
  CONSTRAINT `diary_emotion_ibfk_1` FOREIGN KEY (`diary_id`) REFERENCES `diary` (`diary_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_message` (
	`user_message_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id` int NOT NULL,
	`date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`content` text,
	 CONSTRAINT `user_message_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_message_attached_keyword` (
	`user_message_attached_keyword_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_message_id` int NOT NULL,
	`keyword_id` int NOT NULL,
	FOREIGN KEY (`user_message_id`) REFERENCES `user_message`(`user_message_id`) ON DELETE CASCADE,
	FOREIGN KEY (`keyword_id`) REFERENCES `keyword`(`keyword_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_message_archived` (
	`user_message_archived_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id` int NOT NULL,
	`user_message_id` int NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`user_message_id`) REFERENCES `user_message`(`user_message_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE UserWordFrequency (
    user_id INT,
    word VARCHAR(255),
    frequency INT DEFAULT 1,
    PRIMARY KEY (user_id, word),
    FOREIGN KEY (user_id) REFERENCES User(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `user_avg` (
  `user_id` int NOT NULL ,
  `russell_sum_x` double not null,
  `russell_sum_y` double not null,
  `cnt` int default 0,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `USER`(`id`) ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
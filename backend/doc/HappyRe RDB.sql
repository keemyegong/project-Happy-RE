CREATE TABLE `user` (
	`user_id` int primary key,
	`email`	varchar(255)	NOT NULL unique,
	`password`	varchar(255)	not NULL,
	`username`	varchar(255)	not NULL,
	`admin`	bool	not NULL default false,
	`created_at`	timestamp	NULL default current_timestamp,
	`social_login`	enum("local", "kakao", "google") NULL,
	`profile_url`	varchar(255)	NULL
);

CREATE TABLE `diary` (
	`diary_id`	int primary key,
	`date`	timestamp	NOT NULL,
	`user_id`	int	NOT NULL,
	`summary`	text	NULL,
    foreign key (`user_id`) references `user`(`user_id`) on delete cascade
);

CREATE TABLE `message` (
	`message_id` int primary key,
	`diary_id`	int	NOT NULL,
	`sequence`	int	auto_increment NOT NULL,
	`content`	text not NULL,
	`speaker`	enum("ai", "user")	not NULL,
	`audio_key`	varchar(255)	NULL unique,
    #-- is it ok to refer non_key (but unique) field?
    foreign key (`diary_id`) references `diary`(`diary_id`) on delete cascade
);

CREATE TABLE `diary_emotion` (
	`diary_emotion_id`	int primary key,
	`diary_id`  int	not NULL,
	`emotion_id` int not NULL,
	foreign key (`diary_id`) references `diary`(`diary_id`) on delete cascade    
);

CREATE TABLE `emotion` (
	`emotion_id`	int	primary key,
	`emotion`	varchar(255)	not NULL
);

CREATE TABLE `keyword` (
	`keyword_id`	int primary key,
	`diary_id`	int	not null,
	`sequence`	int	not null,
	`keyword`	varchar(255) not null,
	`summary`	text not null,
    foreign key (`diary_id`) references `diary`(`diary_id`) on delete cascade
);

CREATE TABLE `keyword_emotion` (
	`keyword_emotion_id`	int primary key,
	`keyword_id`	int	not NULL,
	`emotion_id`	int	not NULL,
    foreign key (`keyword_id`) references `keyword`(`keyword_id`) on delete cascade
);

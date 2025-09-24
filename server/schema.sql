CREATE DATABASE IF NOT EXISTS `helpdesk_line` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `helpdesk_line`;

-- USERS
CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `full_name` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('admin','staff','requester') NOT NULL DEFAULT 'requester',
  `phone` VARCHAR(15) DEFAULT NULL,
  `line_user_id` VARCHAR(255) UNIQUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `ux_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TICKETS
CREATE TABLE `tickets` (
  `ticket_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('new','assigned','in_progress','pending','resolved','closed') NOT NULL DEFAULT 'new',
  `requester_id` INT DEFAULT NULL,
  `line_user_id` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resolved_at` TIMESTAMP NULL DEFAULT NULL,
  `closed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `idx_tickets_status` (`status`),
  KEY `idx_tickets_requester_id` (`requester_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ATTACHMENTS
CREATE TABLE `attachments` (
  `attachment_id` INT NOT NULL AUTO_INCREMENT,
  `ticket_id` INT DEFAULT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(512) NOT NULL,
  `mime_type` VARCHAR(100) DEFAULT NULL,
  `file_size` BIGINT DEFAULT NULL,
  `uploaded_by` INT DEFAULT NULL,
  `uploaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attachment_id`),
  KEY `fk_attachment_ticket` (`ticket_id`),
  CONSTRAINT `fk_attachment_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TICKET ASSIGNEES (many-to-many)
CREATE TABLE `ticket_assignees` (
  `ticket_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `assigned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ticket_id`, `staff_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `ticket_assignees_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_assignees_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- TICKET UPDATES (ประวัติการเปลี่ยนสถานะหรือคอมเมนต์)
CREATE TABLE `ticket_updates` (
  `update_id` INT NOT NULL AUTO_INCREMENT,
  `ticket_id` INT NOT NULL,
  `user_id` INT DEFAULT NULL,
  `comment` TEXT DEFAULT NULL,
  `old_status` ENUM('new','assigned','in_progress','pending','resolved','closed') DEFAULT NULL,
  `new_status` ENUM('new','assigned','in_progress','pending','resolved','closed') DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`update_id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ticket_updates_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_updates_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- USER SESSIONS (สำหรับ LINE Chatbot)
CREATE TABLE `user_sessions` (
  `session_id` INT NOT NULL AUTO_INCREMENT,
  `line_user_id` VARCHAR(255) NOT NULL UNIQUE,
  `step` VARCHAR(100) DEFAULT 'idle',
  `data` TEXT DEFAULT NULL,
  `retry_count` INT DEFAULT 0,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;






CREATE DATABASE IF NOT EXISTS `helpdesk_line` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `helpdesk_line`;

-- USERS
CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `full_name` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('admin','staff') NOT NULL DEFAULT 'staff',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TICKETS (เก็บ requester_name, requester_phone ใน ticket)
CREATE TABLE `tickets` (
  `ticket_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `requester_name` VARCHAR(255) NOT NULL,
  `requester_phone` VARCHAR(20) NOT NULL,
  `line_user_id` VARCHAR(64) NOT NULL,
  `status` ENUM('new','assigned','in_progress','pending','resolved','closed') NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resolved_at` TIMESTAMP NULL DEFAULT NULL,
  `closed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `idx_tickets_status` (`status`),
  KEY `idx_tickets_line_user_id` (`line_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ATTACHMENTS
CREATE TABLE `attachments` (
  `attachment_id` INT NOT NULL AUTO_INCREMENT,
  `ticket_id` INT DEFAULT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(512) NOT NULL,
  `mime_type` VARCHAR(100) DEFAULT NULL,
  `file_size` BIGINT DEFAULT NULL,
  `uploaded_by` INT DEFAULT NULL,
  `uploaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attachment_id`),
  KEY `fk_attachment_ticket` (`ticket_id`),
  CONSTRAINT `fk_attachment_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TICKET ASSIGNEES
CREATE TABLE `ticket_assignees` (
  `ticket_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `assigned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ticket_id`, `staff_id`),
  CONSTRAINT `ticket_assignees_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_assignees_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- TICKET UPDATES
CREATE TABLE `ticket_updates` (
  `update_id` INT NOT NULL AUTO_INCREMENT,
  `ticket_id` INT NOT NULL,
  `user_id` INT DEFAULT NULL,
  `old_status` ENUM('new','assigned','in_progress','pending','resolved','closed') DEFAULT NULL,
  `new_status` ENUM('new','assigned','in_progress','pending','resolved','closed') DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`update_id`),
  CONSTRAINT `ticket_updates_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_updates_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- USER SESSIONS (LINE chatbot state)
CREATE TABLE `user_sessions` (
  `session_id` INT NOT NULL AUTO_INCREMENT,
  `line_user_id` VARCHAR(255) NOT NULL UNIQUE,
  `step` VARCHAR(100) DEFAULT 'idle',
  `data` TEXT DEFAULT NULL,
  `retry_count` INT DEFAULT 0,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

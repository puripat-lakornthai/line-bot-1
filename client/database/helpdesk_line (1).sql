-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2025 at 12:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `helpdesk_line`
--

-- --------------------------------------------------------

--
-- Table structure for table `attachments`
--

CREATE TABLE `attachments` (
  `attachment_id` int(11) NOT NULL,
  `ticket_id` int(11) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(512) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attachments`
--

INSERT INTO `attachments` (`attachment_id`, `ticket_id`, `file_name`, `file_path`, `mime_type`, `file_size`, `uploaded_by`, `uploaded_at`) VALUES
(2, 14, 'image-1748939528754.jpg', '/uploads/image-1748939528754.jpg', 'image/jpeg', 232227, 2, '2025-06-03 08:32:09'),
(3, 15, 'image-1748941526493.jpg', '/uploads/image-1748941526493.jpg', 'image/jpeg', 35338, 2, '2025-06-03 09:05:26');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved','closed','pending_requester') NOT NULL DEFAULT 'open',
  `priority` tinyint(4) DEFAULT 3 COMMENT '1=สูง, 2=กลาง, 3=ต่ำ',
  `requester_id` int(11) DEFAULT NULL,
  `line_user_id` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticket_id`, `title`, `phone`, `description`, `status`, `priority`, `requester_id`, `line_user_id`, `created_at`, `updated_at`, `resolved_at`, `closed_at`) VALUES
(1, 'แจ้งปัญหาจาก ddwdw dwd sds', NULL, 'โทรศัพท์เปิดไม่ติดมา 2 วันแล้วครับ', 'open', 3, NULL, NULL, '2025-06-03 02:54:07', '2025-06-03 02:54:07', NULL, NULL),
(2, 'แจ้งปัญหาจาก งกกงงดงกง กววดวด', '0928474933', 'วิธีใช้ทาก่อนออกไปแล้วครับกับผู้ชายเสื้อด้านบนสุดจะบรรยายพิเศษ โดยไม่🙂‍↔️', 'open', 3, NULL, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 05:52:23', '2025-06-03 05:52:23', NULL, NULL),
(3, 'แจ้งปัญหาจาก นกวกวกว ยกยดยด', '0924837583', 'ว ดีกว่าครับเพราะมันเป็นการสร้างเม็ดสี🫟ที่สุดในรอบปี', 'open', 3, NULL, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 06:19:32', '2025-06-03 06:19:32', NULL, NULL),
(4, 'แจ้งปัญหาจาก ดกหดหกดหก', '0924837583', 'ว ดีกว่าครับเพราะมันเป็นการสร้างเม็ดสี🫟ที่สุดในรอบปี', 'open', 3, NULL, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 06:49:46', '2025-06-03 06:49:46', NULL, NULL),
(5, 'แจ้งปัญหาจาก ้ดเก้ กดเ้ด้ ดเ้', '0924837583', 'หอกกกกกกกกกกอปแอปแอปแอ แอ', 'open', 3, NULL, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 06:58:10', '2025-06-03 06:58:10', NULL, NULL),
(6, 'แจ้งปัญหาจาก หอกกกกกกกกกกอปแอปแอปแอ แอ', '0924837583', 'หอกกกกกกกกกกอปแอปแอปแอ แอ', 'open', 3, NULL, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 07:07:27', '2025-06-03 07:07:27', NULL, NULL),
(7, 'แจ้งปัญหาจาก พวพวพย พยวพวพ', '0927473848', 'กบบกบกบก กยกนกยกยบกบกขแ', 'open', 3, 2, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 07:17:26', '2025-06-03 07:17:26', NULL, NULL),
(8, 'แจ้งปัญหาจาก บกกยยก กกยยกยก', '0924837483', 'งกงดวดว ดดววดยดบดบขด', 'open', 3, 2, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 07:19:32', '2025-06-03 07:19:32', NULL, NULL),
(9, 'แจ้งปัญหาจาก ยกยดดว ดววดยดยด', '0924836284', 'ยกดอกดก ดดจจดจดยดยพยด', 'open', 3, 2, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 07:58:42', '2025-06-03 07:58:42', NULL, NULL),
(10, 'แจ้งปัญหาจาก ยดวงดวด ดยดวบด', '0928475938', 'ยำำยยำยำ กวกกยบกลแบอ', 'open', 3, 2, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 08:03:23', '2025-06-03 08:03:23', NULL, NULL),
(11, 'แจ้งปัญหาจาก ยไไยยำ กนกสกยยก', '0938449274', 'กววกวกวด ดสอยอจอจขกขไบวพ', 'open', 3, 2, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 08:15:48', '2025-06-03 08:15:48', NULL, NULL),
(12, 'แจ้งปัญหาจาก กยดยดยด ดยดบบดด', '0937482937', 'งดวดดยจอ้นพ พวยพบดขขเ', 'open', 3, 2, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 08:23:02', '2025-06-03 08:23:02', NULL, NULL),
(13, 'แจ้งปัญหาจาก วดดวดย้วิยอ', '0926748283', 'ำบบดเจเ ออจดจขำ', 'open', 3, 2, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 08:27:28', '2025-06-03 08:27:28', NULL, NULL),
(14, 'แจ้งปัญหาจาก วดดวดย้วิยอ', '0926748283', 'ำบบดเจเ ออจดจขำ', 'open', 3, 2, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 08:32:09', '2025-06-03 08:32:09', NULL, NULL),
(15, 'แจ้งปัญหาจาก ยดยดดบด จพยพยดยเ', '0982736473', 'วแยจ้จเจพจนพยเยเ', 'open', 3, 2, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 09:05:26', '2025-06-03 09:05:26', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ticket_assignees`
--

CREATE TABLE `ticket_assignees` (
  `ticket_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_updates`
--

CREATE TABLE `ticket_updates` (
  `ticket_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `old_status` enum('open','in_progress','resolved','closed','pending_requester') DEFAULT NULL,
  `new_status` enum('open','in_progress','resolved','closed','pending_requester') DEFAULT NULL,
  `update_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` enum('admin','staff','requester') NOT NULL DEFAULT 'requester',
  `phone` varchar(15) DEFAULT NULL,
  `line_user_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `email`, `full_name`, `role`, `phone`, `line_user_id`, `created_at`, `updated_at`) VALUES
(1, 'admin123', '$2y$10$DYgdDyUDNQgVuDQQpXRrAuiNephxYjKg52FipHYorgzieEcIOlB0G', 'admin123@gmail.com', 'System Administrator', 'admin', NULL, NULL, '2025-06-02 22:40:02', '2025-06-07 09:25:20'),
(2, 'kaikai', '$2y$10$65cD9v7MmgiCasZWwDUaPO2GK/DIGlY3.oqIT3Ji75hVGatxJVwlK', 'puripat@gmail.com', 'พวพวพย พยวพวพ', 'staff', NULL, 'U60449bf42bab12fc40fc3085b48b0263', '2025-06-03 07:17:26', '2025-06-07 08:46:17'),
(51, 'Puripat15', '$2y$10$65cD9v7MmgiCasZWwDUaPO2GK/DIGlY3.oqIT3Ji75hVGatxJVwlK', 'puripat115@gmail.com', 'Puripat Lakornthai', 'staff', NULL, NULL, '2025-06-07 05:27:10', '2025-06-07 07:49:51'),
(55, 'admin123admin123', '$2b$10$5h4BHUt0nMTCrs4BS1G6w.lY00fn8ToZC2YnmbKDG3boIUVV260PG', 'admin123admin123@gmail.com', 'admin123admin123', 'admin', NULL, NULL, '2025-06-07 07:50:18', '2025-06-07 09:24:14'),
(57, 'admin123admin123admin123', '$2b$10$lReei5c7S9TiNQ6.yhAMNO67rcQ.ILanuqWp4CM9m7qkKeXgVr0A6', 'admin1@gmail.com', 'admin123admin123admin123', 'requester', NULL, NULL, '2025-06-07 08:46:58', '2025-06-07 08:46:58'),
(58, 'kaikaikaikaikaikai', '$2b$10$59Bjci7zjA/v/86BX6O4GudneBN9HUoCQxelm8cnikEFppQJxTium', 'kaikaikaikakaikaii@gmail.com', 'kaikaikaikaikaikai', 'requester', NULL, NULL, '2025-06-07 08:55:33', '2025-06-07 08:55:33'),
(59, 'admin1kaikaikaikai', '$2b$10$HN62sqKccx5VKn7YnyEiqerh2rOZqrYDkxPpGuj3uyAk9JCDTM73W', 'admin1kaikaikaikai@gmail.com', 'admin1kaikaikaikai', 'requester', NULL, NULL, '2025-06-07 08:55:54', '2025-06-07 08:55:54'),
(60, 'admin1adm', '$2b$10$0VFCp8G37mJmmAl81LEKZO7WAcKUdO.NzXx9j86auO/sOBfJotg2q', 'admin1adm@gmail.com', 'admin1admadmin1adm', 'requester', NULL, NULL, '2025-06-07 08:56:19', '2025-06-07 08:56:19'),
(61, 'admin1admadmin1adm', '$2b$10$bBXQkNr346u2z5gny79k0uwgYVS6fwoC6sfd.f.pbBd6NhGBuSWjO', 'admadmin1adm@gmail.com', 'admin1admadmin1admadmin1adm', 'requester', NULL, NULL, '2025-06-07 08:56:33', '2025-06-07 08:56:33'),
(62, 'adadmin1admmin1adm', '$2b$10$/oNb9u4r4h09sE4gBJlBGeYfao7EnkPyTZaUo3oXgu6z62r8Yz1Ny', 'padmin1admat@gmail.com', 'admin1admadmin1adm', 'requester', NULL, NULL, '2025-06-07 08:56:50', '2025-06-07 08:56:50'),
(63, 'Puadmin1adm', '$2b$10$lYt318wF/NVQl95FGIws4ej66bTmWJZisp1sLJR9MXmNYR8OyUGQq', 'admadmin1admadm@gmail.com', 'admin1admadmin1admadmin1adm', 'requester', NULL, NULL, '2025-06-07 08:57:04', '2025-06-07 08:57:04'),
(64, 'aadmin1admin1adm', '$2b$10$D3kM.PT0z6oCIVV5B6VI/uzSMQEIVSpT57DdOil62KWDMheZzdi2i', 'aadmin1admdmin1adm@gmail.com', 'admin1admadmin1adm', 'requester', NULL, NULL, '2025-06-07 08:57:18', '2025-06-07 08:57:18'),
(65, 'aadmin1admm', '$2b$10$a3tC4W2yZKtpE9WPRIvRmupGNJRTDX64eV6/idQ614TENksvOEbRS', 'admin1admn123@gmail.com', 'admin1admadmin1adm', 'requester', NULL, NULL, '2025-06-07 08:57:33', '2025-06-07 08:57:33'),
(66, 'admin1admdm', '$2b$10$Z0kcYbmHSK3vu5KZZl.eOu2XOr.3akN8pX.Y38psmPp7Tuw4xU3ZC', 'padmin1admpat@gmail.com', 'admin1admadmin1admadmin1adm', 'requester', NULL, NULL, '2025-06-07 08:57:45', '2025-06-07 08:57:45'),
(67, 'PuripatPuuripatPuripatat', '$2b$10$4Ky6212jtfUUMK9CNEZfSORCit47H8WcRxJMy51sVwd54NmXdRRUe', 'admuripatPuripat3@gmail.com', 'uripatPuripaturipatPuripat', 'admin', NULL, NULL, '2025-06-07 08:58:48', '2025-06-07 09:57:25'),
(68, 'uripatPuripaturipatPuripat', '$2b$10$WY6r4p81RwllUeUOsHZvNeu7VC7JcUxy6cSbh3SYptyN1jHWTktcy', 'puripuripatPuripattipat@gmail.com', 'admin1admadmin1adm', 'staff', NULL, NULL, '2025-06-07 08:59:14', '2025-06-07 09:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `session_id` int(11) NOT NULL,
  `line_user_id` varchar(255) NOT NULL,
  `step` varchar(100) DEFAULT 'idle',
  `data` text DEFAULT NULL,
  `retry_count` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`session_id`, `line_user_id`, `step`, `data`, `retry_count`, `updated_at`, `created_at`) VALUES
(154, 'U60449bf42bab12fc40fc3085b48b0263', 'ask_name', '{}', 0, '2025-06-06 14:14:50', '2025-06-06 14:14:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`attachment_id`),
  ADD KEY `fk_attachment_ticket` (`ticket_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_id`),
  ADD KEY `idx_tickets_status` (`status`),
  ADD KEY `idx_tickets_requester_id` (`requester_id`);

--
-- Indexes for table `ticket_assignees`
--
ALTER TABLE `ticket_assignees`
  ADD PRIMARY KEY (`ticket_id`,`staff_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `ticket_updates`
--
ALTER TABLE `ticket_updates`
  ADD PRIMARY KEY (`update_id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `line_user_id` (`line_user_id`),
  ADD UNIQUE KEY `ux_users_phone` (`phone`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD UNIQUE KEY `unique_line_user` (`line_user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attachments`
--
ALTER TABLE `attachments`
  MODIFY `attachment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `ticket_updates`
--
ALTER TABLE `ticket_updates`
  MODIFY `update_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `fk_attachment_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `ticket_assignees`
--
ALTER TABLE `ticket_assignees`
  ADD CONSTRAINT `ticket_assignees_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_assignees_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket_updates`
--
ALTER TABLE `ticket_updates`
  ADD CONSTRAINT `ticket_updates_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_updates_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

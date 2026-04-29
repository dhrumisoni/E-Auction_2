-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2025 at 09:38 AM
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
-- Database: `eauction`
--

-- --------------------------------------------------------

--
-- Table structure for table `bids`
--

CREATE TABLE `bids` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `status` enum('Active','Requested','Completed','Rejected') NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image1_url` varchar(255) NOT NULL,
  `image2_url` varchar(255) NOT NULL,
  `image3_url` varchar(255) NOT NULL,
  `image4_url` varchar(255) NOT NULL,
  `price` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bids_logs`
--

CREATE TABLE `bids_logs` (
  `id` int(11) NOT NULL,
  `bid_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `price` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Cars'),
(2, 'Bikes'),
(3, 'Art'),
(4, 'Jwellery'),
(5, 'Electronics'),
(6, 'Furniture'),
(7, 'Collectibles'),
(8, 'Real State');

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `state_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `state_id`) VALUES
(1, 'Addis Ababa', 149),
(2, 'Adama', 147),
(3, 'Jimma', 147),
(4, 'Dire Dawa', 149),
(5, 'Mekelle', 148),
(6, 'Bahir Dar', 146),
(7, 'Gondar', 146),
(8, 'Awash', 150),
(9, 'Jijiga', 151),
(10, 'Los Angeles', 193),
(11, 'San Francisco', 193),
(12, 'San Diego', 193),
(13, 'Sacramento', 193),
(14, 'San Jose', 193),
(15, 'Houston', 231),
(16, 'Dallas', 231),
(17, 'Austin', 231),
(18, 'San Antonio', 231),
(19, 'Fort Worth', 231),
(20, 'New York City', 220),
(21, 'Buffalo', 220),
(22, 'Rochester', 220),
(23, 'Albany', 220),
(24, 'Syracuse', 220),
(25, 'Miami', 197),
(26, 'Orlando', 197),
(27, 'Tampa', 197),
(28, 'Jacksonville', 197),
(29, 'Fort Lauderdale', 197),
(30, 'Chicago', 201),
(31, 'Aurora', 201),
(32, 'Naperville', 201),
(33, 'Springfield', 201),
(34, 'Peoria', 201),
(35, 'Mumbai', 324),
(36, 'Pune', 324),
(37, 'Nagpur', 324),
(38, 'Nashik', 324),
(39, 'Aurangabad', 324),
(40, 'Lucknow', 325),
(41, 'Kanpur', 325),
(42, 'Varanasi', 325),
(43, 'Agra', 325),
(44, 'Prayagraj', 325),
(45, 'Chennai', 326),
(46, 'Coimbatore', 326),
(47, 'Madurai', 326),
(48, 'Tiruchirappalli', 326),
(49, 'Salem', 326),
(50, 'Bengaluru', 327),
(51, 'Mysuru', 327),
(52, 'Mangaluru', 327),
(53, 'Hubballi-Dharwad', 327),
(54, 'Belagavi', 327),
(55, 'Kolkata', 328),
(56, 'Howrah', 328),
(57, 'Durgapur', 328),
(58, 'Siliguri', 328),
(59, 'Asansol', 328),
(60, 'Munich', 372),
(61, 'Nuremberg', 372),
(62, 'Augsburg', 372),
(63, 'Regensburg', 372),
(64, 'Ingolstadt', 372),
(65, 'Berlin', 373),
(66, 'Hamburg', 374),
(67, 'Frankfurt am Main', 375),
(68, 'Wiesbaden', 375),
(69, 'Kassel', 375),
(70, 'Dresden', 376),
(71, 'Leipzig', 376),
(72, 'Chemnitz', 376),
(73, 'São Paulo', 257),
(74, 'Campinas', 257),
(75, 'Santos', 257),
(76, 'Ribeirão Preto', 257),
(77, 'Sorocaba', 257),
(78, 'Rio de Janeiro', 258),
(79, 'Niterói', 258),
(80, 'Nova Iguaçu', 258),
(81, 'Duque de Caxias', 258),
(82, 'São Gonçalo', 258),
(83, 'Salvador', 259),
(84, 'Feira de Santana', 259),
(85, 'Vitória da Conquista', 259),
(86, 'Ilhéus', 259),
(87, 'Itabuna', 259),
(88, 'Belo Horizonte', 260),
(89, 'Uberlândia', 260),
(90, 'Juiz de Fora', 260),
(91, 'Contagem', 260),
(92, 'Montes Claros', 260),
(93, 'Curitiba', 261),
(94, 'Londrina', 261),
(95, 'Maringá', 261),
(96, 'Ponta Grossa', 261),
(97, 'Cascavel', 261),
(98, 'Ahmedabad', 329),
(99, 'Surat', 329),
(100, 'Vadodara', 329),
(101, 'Rajkot', 329),
(102, 'Bhavnagar', 329),
(103, 'Ludhiana', 330),
(104, 'Amritsar', 330),
(105, 'Jalandhar', 330),
(106, 'Patiala', 330),
(107, 'Bathinda', 330),
(108, 'Dehradun', 331),
(109, 'Haridwar', 331),
(110, 'Rishikesh', 331),
(111, 'Roorkee', 331),
(112, 'Haldwani', 331),
(113, 'Patna', 332),
(114, 'Gaya', 332),
(115, 'Bhagalpur', 332),
(116, 'Muzaffarpur', 332),
(117, 'Purnia', 332);

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `subregion_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `subregion_id`) VALUES
(1, 'Algeria', 1),
(2, 'Egypt', 1),
(3, 'Libya', 1),
(4, 'Morocco', 1),
(5, 'Sudan', 1),
(6, 'Tunisia', 1),
(7, 'Western Sahara', 1),
(8, 'Angola', 2),
(9, 'Cameroon', 2),
(10, 'Central African Republic', 2),
(11, 'Chad', 2),
(12, 'Congo', 2),
(13, 'DR Congo', 2),
(14, 'Equatorial Guinea', 2),
(15, 'Gabon', 2),
(16, 'Sao Tome and Principe', 2),
(17, 'Benin', 3),
(18, 'Burkina Faso', 3),
(19, 'Cape Verde', 3),
(20, 'Cote d\'Ivoire', 3),
(21, 'Gambia', 3),
(22, 'Ghana', 3),
(23, 'Guinea', 3),
(24, 'Guinea-Bissau', 3),
(25, 'Liberia', 3),
(26, 'Mali', 3),
(27, 'Mauritania', 3),
(28, 'Niger', 3),
(29, 'Nigeria', 3),
(30, 'Senegal', 3),
(31, 'Sierra Leone', 3),
(32, 'Togo', 3),
(33, 'Burundi', 4),
(34, 'Comoros', 4),
(35, 'Djibouti', 4),
(36, 'Eritrea', 4),
(37, 'Ethiopia', 4),
(38, 'Kenya', 4),
(39, 'Madagascar', 4),
(40, 'Malawi', 4),
(41, 'Mauritius', 4),
(42, 'Mozambique', 4),
(43, 'Rwanda', 4),
(44, 'Seychelles', 4),
(45, 'Somalia', 4),
(46, 'South Sudan', 4),
(47, 'Tanzania', 4),
(48, 'Uganda', 4),
(49, 'Zambia', 4),
(50, 'Zimbabwe', 4),
(51, 'Botswana', 5),
(52, 'Eswatini', 5),
(53, 'Lesotho', 5),
(54, 'Namibia', 5),
(55, 'South Africa', 5),
(56, 'Canada', 6),
(57, 'United States', 6),
(58, 'Greenland', 6),
(59, 'Bermuda', 6),
(60, 'Saint Pierre and Miquelon', 6),
(61, 'Antigua and Barbuda', 7),
(62, 'Bahamas', 7),
(63, 'Barbados', 7),
(64, 'Cuba', 7),
(65, 'Dominica', 7),
(66, 'Dominican Republic', 7),
(67, 'Grenada', 7),
(68, 'Haiti', 7),
(69, 'Jamaica', 7),
(70, 'Saint Kitts and Nevis', 7),
(71, 'Saint Lucia', 7),
(72, 'Saint Vincent and the Grenadines', 7),
(73, 'Trinidad and Tobago', 7),
(74, 'Argentina', 8),
(75, 'Bolivia', 8),
(76, 'Brazil', 8),
(77, 'Chile', 8),
(78, 'Colombia', 8),
(79, 'Ecuador', 8),
(80, 'Guyana', 8),
(81, 'Paraguay', 8),
(82, 'Peru', 8),
(83, 'Suriname', 8),
(84, 'Uruguay', 8),
(85, 'Venezuela', 8),
(86, 'Belize', 9),
(87, 'Costa Rica', 9),
(88, 'El Salvador', 9),
(89, 'Guatemala', 9),
(90, 'Honduras', 9),
(91, 'Mexico', 9),
(92, 'Nicaragua', 9),
(93, 'Panama', 9),
(94, 'Kazakhstan', 10),
(95, 'Kyrgyzstan', 10),
(96, 'Tajikistan', 10),
(97, 'Turkmenistan', 10),
(98, 'Uzbekistan', 10),
(99, 'Armenia', 11),
(100, 'Azerbaijan', 11),
(101, 'Bahrain', 11),
(102, 'Cyprus', 11),
(103, 'Georgia', 11),
(104, 'Iraq', 11),
(105, 'Israel', 11),
(106, 'Jordan', 11),
(107, 'Kuwait', 11),
(108, 'Lebanon', 11),
(109, 'Oman', 11),
(110, 'Palestine', 11),
(111, 'Qatar', 11),
(112, 'Saudi Arabia', 11),
(113, 'Syria', 11),
(114, 'Turkey', 11),
(115, 'United Arab Emirates', 11),
(116, 'Yemen', 11),
(117, 'China', 12),
(118, 'Hong Kong', 12),
(119, 'Macau', 12),
(120, 'Mongolia', 12),
(121, 'North Korea', 12),
(122, 'South Korea', 12),
(123, 'Japan', 12),
(124, 'Taiwan', 12),
(125, 'Brunei', 13),
(126, 'Cambodia', 13),
(127, 'East Timor', 13),
(128, 'Indonesia', 13),
(129, 'Laos', 13),
(130, 'Malaysia', 13),
(131, 'Myanmar', 13),
(132, 'Philippines', 13),
(133, 'Singapore', 13),
(134, 'Thailand', 13),
(135, 'Vietnam', 13),
(136, 'Afghanistan', 14),
(137, 'Bangladesh', 14),
(138, 'Bhutan', 14),
(139, 'India', 14),
(140, 'Iran', 14),
(141, 'Maldives', 14),
(142, 'Nepal', 14),
(143, 'Pakistan', 14),
(144, 'Sri Lanka', 14),
(145, 'Belarus', 15),
(146, 'Bulgaria', 15),
(147, 'Czech Republic', 15),
(148, 'Hungary', 15),
(149, 'Poland', 15),
(150, 'Moldova', 15),
(151, 'Romania', 15),
(152, 'Russia', 15),
(153, 'Slovakia', 15),
(154, 'Ukraine', 15),
(155, 'Denmark', 16),
(156, 'Estonia', 16),
(157, 'Finland', 16),
(158, 'Iceland', 16),
(159, 'Ireland', 16),
(160, 'Latvia', 16),
(161, 'Lithuania', 16),
(162, 'Norway', 16),
(163, 'Sweden', 16),
(164, 'United Kingdom', 16),
(165, 'Albania', 17),
(166, 'Andorra', 17),
(167, 'Bosnia and Herzegovina', 17),
(168, 'Croatia', 17),
(169, 'Greece', 17),
(170, 'Italy', 17),
(171, 'Malta', 17),
(172, 'Montenegro', 17),
(173, 'North Macedonia', 17),
(174, 'Portugal', 17),
(175, 'San Marino', 17),
(176, 'Serbia', 17),
(177, 'Slovenia', 17),
(178, 'Spain', 17),
(179, 'Vatican City', 17),
(180, 'Austria', 18),
(181, 'Belgium', 18),
(182, 'France', 18),
(183, 'Germany', 18),
(184, 'Liechtenstein', 18),
(185, 'Luxembourg', 18),
(186, 'Monaco', 18),
(187, 'Netherlands', 18),
(188, 'Switzerland', 18),
(189, 'Australia', 19),
(190, 'New Zealand', 19),
(191, 'Fiji', 20),
(192, 'Papua New Guinea', 20),
(193, 'Solomon Islands', 20),
(194, 'Vanuatu', 20),
(195, 'Kiribati', 21),
(196, 'Marshall Islands', 21),
(197, 'Micronesia', 21),
(198, 'Nauru', 21),
(199, 'Palau', 21),
(200, 'Samoa', 22),
(201, 'Tonga', 22),
(202, 'Tuvalu', 22);

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regions`
--

INSERT INTO `regions` (`id`, `name`) VALUES
(1, 'Africa'),
(2, 'Americas'),
(3, 'Asia'),
(4, 'Europe'),
(5, 'Oceania'),
(6, 'Polar');

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `country_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `name`, `country_id`) VALUES
(1, 'Adrar', 1),
(2, 'Chlef', 1),
(3, 'Laghouat', 1),
(4, 'Oum El Bouaghi', 1),
(5, 'Batna', 1),
(6, 'Béjaïa', 1),
(7, 'Biskra', 1),
(8, 'Béchar', 1),
(9, 'Blida', 1),
(10, 'Bouira', 1),
(11, 'Tamanrasset', 1),
(12, 'Tébessa', 1),
(13, 'Tlemcen', 1),
(14, 'Tiaret', 1),
(15, 'Tizi Ouzou', 1),
(16, 'Algiers', 1),
(17, 'Djelfa', 1),
(18, 'Jijel', 1),
(19, 'Sétif', 1),
(20, 'Saïda', 1),
(21, 'Skikda', 1),
(22, 'Sidi Bel Abbès', 1),
(23, 'Annaba', 1),
(24, 'Guelma', 1),
(25, 'Constantine', 1),
(26, 'Médéa', 1),
(27, 'Mostaganem', 1),
(28, 'M’Sila', 1),
(29, 'Mascara', 1),
(30, 'Ouargla', 1),
(31, 'Oran', 1),
(32, 'El Bayadh', 1),
(33, 'Illizi', 1),
(34, 'Bordj Bou Arréridj', 1),
(35, 'Boumerdès', 1),
(36, 'El Tarf', 1),
(37, 'Tindouf', 1),
(38, 'Tissemsilt', 1),
(39, 'El Oued', 1),
(40, 'Khenchela', 1),
(41, 'Souk Ahras', 1),
(42, 'Tipaza', 1),
(43, 'Mila', 1),
(44, 'Aïn Defla', 1),
(45, 'Naâma', 1),
(46, 'Aïn Témouchent', 1),
(47, 'Ghardaïa', 1),
(48, 'Relizane', 1),
(49, 'Cairo', 2),
(50, 'Giza', 2),
(51, 'Alexandria', 2),
(52, 'Beheira', 2),
(53, 'Beni Suef', 2),
(54, 'Faiyum', 2),
(55, 'Gharbia', 2),
(56, 'Ismailia', 2),
(57, 'Kafr El Sheikh', 2),
(58, 'Matruh', 2),
(59, 'Monufia', 2),
(60, 'Minya', 2),
(61, 'Qena', 2),
(62, 'Suez', 2),
(63, 'Luxor', 2),
(64, 'Aswan', 2),
(65, 'Asyut', 2),
(66, 'Damietta', 2),
(67, 'Dakahlia', 2),
(68, 'Sharqia', 2),
(69, 'Sohag', 2),
(70, 'North Sinai', 2),
(71, 'South Sinai', 2),
(72, 'New Valley', 2),
(73, 'Red Sea', 2),
(74, 'Tripoli', 3),
(75, 'Benghazi', 3),
(76, 'Misrata', 3),
(77, 'Zawiya', 3),
(78, 'Derna', 3),
(79, 'Sirt', 3),
(80, 'Al Jabal al Akhdar', 3),
(81, 'Al Kufrah', 3),
(82, 'Rabat-Salé-Kénitra', 4),
(83, 'Casablanca-Settat', 4),
(84, 'Fès-Meknès', 4),
(85, 'Marrakesh-Safi', 4),
(86, 'Tanger-Tetouan-Al Hoceima', 4),
(87, 'Souss-Massa', 4),
(88, 'Oriental', 4),
(89, 'Béni Mellal-Khénifra', 4),
(90, 'Drâa-Tafilalet', 4),
(91, 'Khartoum', 5),
(92, 'North Kordofan', 5),
(93, 'South Darfur', 5),
(94, 'West Darfur', 5),
(95, 'Blue Nile', 5),
(96, 'White Nile', 5),
(97, 'Tunis', 6),
(98, 'Ariana', 6),
(99, 'Ben Arous', 6),
(100, 'Sfax', 6),
(101, 'Laayoune Region', 7),
(102, 'Luanda', 8),
(103, 'Benguela', 8),
(104, 'Huíla', 8),
(105, 'Bié', 8),
(106, 'Centre', 9),
(107, 'Littoral', 9),
(108, 'West', 9),
(109, 'Bangui', 10),
(110, 'Ouham', 10),
(111, 'N\'Djamena', 11),
(112, 'Mayo-Kebbi', 11),
(113, 'Brazzaville', 12),
(114, 'Pointe-Noire', 12),
(115, 'Kinshasa', 13),
(116, 'Kongo Central', 13),
(117, 'Haut-Katanga', 13),
(118, 'Malabo', 14),
(119, 'Estuaire', 15),
(120, 'Sâo Tomé', 16),
(121, 'Atlantique', 17),
(122, 'Littoral', 17),
(123, 'Centre', 18),
(124, 'Santiago', 19),
(125, 'Abidjan', 20),
(126, 'Banjul', 21),
(127, 'Greater Accra', 22),
(128, 'Ashanti', 22),
(129, 'Conakry', 23),
(130, 'Bissau', 24),
(131, 'Montserrado', 25),
(132, 'Bamako', 26),
(133, 'Nouakchott', 27),
(134, 'Niamey', 28),
(135, 'Lagos', 29),
(136, 'Kano', 29),
(137, 'Rivers', 29),
(138, 'Kaduna', 29),
(139, 'Dakar', 30),
(140, 'Western Area', 31),
(141, 'Lomé', 32),
(142, 'Bujumbura', 33),
(143, 'Ngazidja', 34),
(144, 'Djibouti', 35),
(145, 'Maekel', 36),
(146, 'Amhara', 37),
(147, 'Oromia', 37),
(148, 'Tigray', 37),
(149, 'Addis Ababa', 37),
(150, 'Afar', 37),
(151, 'Somali', 37),
(152, 'Nairobi County', 38),
(153, 'Mombasa County', 38),
(154, 'Antananarivo', 39),
(155, 'Lilongwe', 40),
(156, 'Port Louis', 41),
(157, 'Maputo', 42),
(158, 'Kigali', 43),
(159, 'Greater Victoria', 44),
(160, 'Mogadishu', 45),
(161, 'Juba', 46),
(162, 'Dar es Salaam', 47),
(163, 'Mwanza', 47),
(164, 'Kampala', 48),
(165, 'Lusaka', 49),
(166, 'Harare', 50),
(167, 'Gaborone', 51),
(168, 'Hhohho', 52),
(169, 'Maseru', 53),
(170, 'Khomas', 54),
(171, 'Gauteng', 55),
(172, 'Western Cape', 55),
(173, 'KwaZulu-Natal', 55),
(174, 'Eastern Cape', 55),
(175, 'Limpopo', 55),
(176, 'Ontario', 56),
(177, 'Quebec', 56),
(178, 'British Columbia', 56),
(179, 'Alberta', 56),
(180, 'Manitoba', 56),
(181, 'Saskatchewan', 56),
(182, 'Nova Scotia', 56),
(183, 'New Brunswick', 56),
(184, 'Newfoundland and Labrador', 56),
(185, 'Prince Edward Island', 56),
(186, 'Northwest Territories', 56),
(187, 'Yukon', 56),
(188, 'Nunavut', 56),
(189, 'Alabama', 57),
(190, 'Alaska', 57),
(191, 'Arizona', 57),
(192, 'Arkansas', 57),
(193, 'California', 57),
(194, 'Colorado', 57),
(195, 'Connecticut', 57),
(196, 'Delaware', 57),
(197, 'Florida', 57),
(198, 'Georgia', 57),
(199, 'Hawaii', 57),
(200, 'Idaho', 57),
(201, 'Illinois', 57),
(202, 'Indiana', 57),
(203, 'Iowa', 57),
(204, 'Kansas', 57),
(205, 'Kentucky', 57),
(206, 'Louisiana', 57),
(207, 'Maine', 57),
(208, 'Maryland', 57),
(209, 'Massachusetts', 57),
(210, 'Michigan', 57),
(211, 'Minnesota', 57),
(212, 'Mississippi', 57),
(213, 'Missouri', 57),
(214, 'Montana', 57),
(215, 'Nebraska', 57),
(216, 'Nevada', 57),
(217, 'New Hampshire', 57),
(218, 'New Jersey', 57),
(219, 'New Mexico', 57),
(220, 'New York', 57),
(221, 'North Carolina', 57),
(222, 'North Dakota', 57),
(223, 'Ohio', 57),
(224, 'Oklahoma', 57),
(225, 'Oregon', 57),
(226, 'Pennsylvania', 57),
(227, 'Rhode Island', 57),
(228, 'South Carolina', 57),
(229, 'South Dakota', 57),
(230, 'Tennessee', 57),
(231, 'Texas', 57),
(232, 'Utah', 57),
(233, 'Vermont', 57),
(234, 'Virginia', 57),
(235, 'Washington', 57),
(236, 'West Virginia', 57),
(237, 'Wisconsin', 57),
(238, 'Wyoming', 57),
(239, 'District of Columbia', 57),
(240, 'Bermuda - (territory)', 59),
(241, 'Saint Pierre and Miquelon - (territory)', 60),
(242, 'Antigua and Barbuda - (parish-level)', 61),
(243, 'Bahamas - (districts)', 62),
(244, 'Barbados - (parish)', 63),
(245, 'Cuba - (provinces)', 64),
(246, 'Dominica - (parishes)', 65),
(247, 'Dominican Republic - (provinces)', 66),
(248, 'Grenada - (parish)', 67),
(249, 'Haiti - (departments)', 68),
(250, 'Jamaica - (parishes)', 69),
(251, 'Saint Kitts and Nevis - (parish)', 70),
(252, 'Saint Lucia - (districts)', 71),
(253, 'Saint Vincent and the Grenadines - (parish)', 72),
(254, 'Trinidad and Tobago - (regions)', 73),
(255, 'Buenos Aires Province', 74),
(256, 'Santa Cruz', 75),
(257, 'São Paulo', 76),
(258, 'Rio de Janeiro', 76),
(259, 'Bahia', 76),
(260, 'Minas Gerais', 76),
(261, 'Paraná', 76),
(262, 'Santiago Metropolitan', 77),
(263, 'Bogotá DC', 78),
(264, 'Pichincha', 79),
(265, 'Georgetown', 80),
(266, 'Asunción', 81),
(267, 'Lima', 82),
(268, 'Paramaribo', 83),
(269, 'Montevideo', 84),
(270, 'Caracas', 85),
(271, 'Belize - (districts)', 86),
(272, 'San José', 87),
(273, 'San Salvador', 88),
(274, 'Guatemala City', 89),
(275, 'Tegucigalpa', 90),
(276, 'Mexico City', 91),
(277, 'Managua', 92),
(278, 'Panama City', 93),
(279, 'Almaty Region', 94),
(280, 'Chuy Region', 95),
(281, 'Sughd', 96),
(282, 'Lebap', 97),
(283, 'Tashkent Region', 98),
(284, 'Yerevan', 99),
(285, 'Baku', 100),
(286, 'Manama', 101),
(287, 'Nicosia', 102),
(288, 'Tbilisi', 103),
(289, 'Baghdad', 104),
(290, 'Tel Aviv District', 105),
(291, 'Amman', 106),
(292, 'Kuwait Governorate', 107),
(293, 'Beirut Governorate', 108),
(294, 'Muscat', 109),
(295, 'Ramallah and al-Bireh', 110),
(296, 'Doha', 111),
(297, 'Riyadh', 112),
(298, 'Damascus', 113),
(299, 'Istanbul', 114),
(300, 'Abu Dhabi', 115),
(301, 'Sana\'a Governorate', 116),
(302, 'Beijing Municipality', 117),
(303, 'Hong Kong', 118),
(304, 'Macau', 119),
(305, 'Ulaanbaatar', 120),
(306, 'Pyongyang', 121),
(307, 'Seoul', 122),
(308, 'Tokyo Metropolis', 123),
(309, 'Taipei', 124),
(310, 'Brunei-Muara', 125),
(311, 'Phnom Penh', 126),
(312, 'Dili', 127),
(313, 'Jakarta', 128),
(314, 'Vientiane Prefecture', 129),
(315, 'Kuala Lumpur', 130),
(316, 'Naypyidaw', 131),
(317, 'Manila', 132),
(318, 'Singapore', 133),
(319, 'Bangkok', 134),
(320, 'Hanoi', 135),
(321, 'Kabul', 136),
(322, 'Dhaka', 137),
(323, 'Thimphu', 138),
(324, 'Maharashtra', 139),
(325, 'Uttar Pradesh', 139),
(326, 'Tamil Nadu', 139),
(327, 'Karnataka', 139),
(328, 'West Bengal', 139),
(329, 'Tehran Province', 140),
(330, 'Maldives - (atolls)', 141),
(331, 'Bagmati Province', 142),
(332, 'Punjab', 139),
(333, 'Western Province', 144),
(334, 'Minsk Region', 145),
(335, 'Sofia', 146),
(336, 'Prague', 147),
(337, 'Budapest', 148),
(338, 'Mazovia', 149),
(339, 'Moldova - Chisinau', 150),
(340, 'Bucharest', 151),
(341, 'Moscow', 152),
(342, 'Bratislava Region', 153),
(343, 'Kyiv', 154),
(344, 'Copenhagen', 155),
(345, 'Harju County', 156),
(346, 'Uusimaa', 157),
(347, 'Reykjavík', 158),
(348, 'Leinster', 159),
(349, 'Riga Region', 160),
(350, 'Vilnius County', 161),
(351, 'Oslo', 162),
(352, 'Stockholm County', 163),
(353, 'England - (regions)', 164),
(354, 'Tirana', 165),
(355, 'Andorra la Vella', 166),
(356, 'Sarajevo Canton', 167),
(357, 'Zagreb', 168),
(358, 'Attica', 169),
(359, 'Lombardy', 170),
(360, 'Valletta', 171),
(361, 'Montenegro - Podgorica', 172),
(362, 'North Macedonia - Skopje', 173),
(363, 'Lisbon', 174),
(364, 'San Marino - (municipality)', 175),
(365, 'Belgrade', 176),
(366, 'Ljubljana', 177),
(367, 'Andalusia', 178),
(368, 'Vatican City - (state)', 179),
(369, 'Vienna', 180),
(370, 'Flanders', 181),
(371, 'Île-de-France', 182),
(372, 'Bavaria', 183),
(373, 'Liechtenstein - (municipality)', 184),
(374, 'Luxembourg - (district)', 185),
(375, 'Monaco - (principality)', 186),
(376, 'North Holland', 187),
(377, 'Canton Zurich', 188),
(378, 'New South Wales', 189),
(379, 'Auckland', 190),
(380, 'Suva', 191),
(381, 'Port Moresby', 192),
(382, 'Honiara', 193),
(383, 'Port Vila', 194),
(384, 'Kiribati(islands)', 195),
(385, 'Majuro', 196),
(386, 'Pohnpei', 197),
(387, 'Yaren', 198),
(388, 'Melekeok', 199),
(389, 'Apia', 200),
(390, 'Nukuʻalofa', 201),
(391, 'Funafuti', 202),
(392, 'Gujarat', 139);

-- --------------------------------------------------------

--
-- Table structure for table `subregions`
--

CREATE TABLE `subregions` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `region_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subregions`
--

INSERT INTO `subregions` (`id`, `name`, `region_id`) VALUES
(1, 'Northern Africa', 1),
(2, 'Middle Africa', 1),
(3, 'Western Africa', 1),
(4, 'Eastern Africa', 1),
(5, 'Southern Africa', 1),
(6, 'Northern America', 2),
(7, 'Caribbean', 2),
(8, 'South America', 2),
(9, 'Central America', 2),
(10, 'Central Asia', 3),
(11, 'Western Asia', 3),
(12, 'Eastern Asia', 3),
(13, 'South-Eastern Asia', 3),
(14, 'Southern Asia', 3),
(15, 'Eastern Europe', 4),
(16, 'Northern Europe', 4),
(17, 'Southern Europe', 4),
(18, 'Western Europe', 4),
(19, 'Australia and New Zealand', 5),
(20, 'Melanesia', 5),
(21, 'Micronesia', 5),
(22, 'Polynesia', 5);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `bid_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `number` bigint(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `document_type` varchar(25) NOT NULL,
  `status` enum('Approved','Rejected','Requested','Block') NOT NULL,
  `password` varchar(255) NOT NULL,
  `city_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_payments_for_bid`
--

CREATE TABLE `user_payments_for_bid` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bid_id` int(11) NOT NULL,
  `amount` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `winners`
--

CREATE TABLE `winners` (
  `id` int(11) NOT NULL,
  `bid_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bids`
--
ALTER TABLE `bids`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bids_logs`
--
ALTER TABLE `bids_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bid_id` (`bid_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `state_id` (`state_id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subregion_id` (`subregion_id`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `subregions`
--
ALTER TABLE `subregions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `region_id` (`region_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bid_id` (`bid_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `user_payments_for_bid`
--
ALTER TABLE `user_payments_for_bid`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `bid_id` (`bid_id`);

--
-- Indexes for table `winners`
--
ALTER TABLE `winners`
  ADD KEY `bid_id` (`bid_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bids`
--
ALTER TABLE `bids`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bids_logs`
--
ALTER TABLE `bids_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `regions`
--
ALTER TABLE `regions`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=393;

--
-- AUTO_INCREMENT for table `subregions`
--
ALTER TABLE `subregions`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_payments_for_bid`
--
ALTER TABLE `user_payments_for_bid`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bids_logs`
--
ALTER TABLE `bids_logs`
  ADD CONSTRAINT `bids_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bids_logs_ibfk_2` FOREIGN KEY (`bid_id`) REFERENCES `bids` (`id`);

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`);

--
-- Constraints for table `countries`
--
ALTER TABLE `countries`
  ADD CONSTRAINT `countries_ibfk_1` FOREIGN KEY (`subregion_id`) REFERENCES `subregions` (`id`);

--
-- Constraints for table `states`
--
ALTER TABLE `states`
  ADD CONSTRAINT `states_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`);

--
-- Constraints for table `subregions`
--
ALTER TABLE `subregions`
  ADD CONSTRAINT `subregions_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`bid_id`) REFERENCES `bids` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Constraints for table `user_payments_for_bid`
--
ALTER TABLE `user_payments_for_bid`
  ADD CONSTRAINT `user_payments_for_bid_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_payments_for_bid_ibfk_2` FOREIGN KEY (`bid_id`) REFERENCES `bids` (`id`);

--
-- Constraints for table `winners`
--
ALTER TABLE `winners`
  ADD CONSTRAINT `winners_ibfk_1` FOREIGN KEY (`bid_id`) REFERENCES `bids` (`id`),
  ADD CONSTRAINT `winners_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

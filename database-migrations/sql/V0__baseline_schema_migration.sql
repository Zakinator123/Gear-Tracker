-- MySQL dump 10.13  Distrib 5.7.23, for Linux (x86_64)
--
-- Host: mysql    Database: inventory
-- ------------------------------------------------------
-- Server version	5.7.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Create 'gearmaster' user used by application
--
create user '${GEAR_TRACKER_DB_USER}'@'%' identified by '${GEAR_TRACKER_DB_PASSWORD}';
GRANT ALL ON inventory.* to '${GEAR_TRACKER_DB_USER}'@'%';

--
-- Table structure for table `authenticator`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `authenticator` (
                                 `token` varchar(96) NOT NULL,
                                 `userid` int(11) DEFAULT NULL,
                                 `creation_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 PRIMARY KEY (`token`),
                                 UNIQUE KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `checkout`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checkout` (
                            `checkout_id` int(11) NOT NULL AUTO_INCREMENT,
                            `gear_uid` mediumint(9) DEFAULT NULL,
                            `checkout_notes` varchar(255) DEFAULT NULL,
                            `check_in_notes` varchar(255) DEFAULT NULL,
                            `date_checked_in` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            `date_due` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
                            `officer_out` varchar(100) DEFAULT NULL,
                            `officer_in` varchar(100) DEFAULT NULL,
                            `checkout_status` int(11) DEFAULT NULL,
                            `member_uid` int(11) DEFAULT NULL,
                            `member_name` varchar(100) DEFAULT NULL,
                            `date_checked_out` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (`checkout_id`),
                            KEY `gear_uid` (`gear_uid`),
                            CONSTRAINT `checkout_ibfk_1` FOREIGN KEY (`gear_uid`) REFERENCES `gear` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1887 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gear`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gear` (
                        `number` int(11) DEFAULT NULL,
                        `item` varchar(255) DEFAULT NULL,
                        `description` varchar(255) DEFAULT NULL,
                        `condition_level` int(11) DEFAULT NULL,
                        `status_level` int(11) DEFAULT NULL,
                        `notes` varchar(255) DEFAULT NULL,
                        `Image_url` varchar(255) DEFAULT NULL,
                        `uid` mediumint(9) NOT NULL AUTO_INCREMENT,
                        PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1519 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-16 23:50:10

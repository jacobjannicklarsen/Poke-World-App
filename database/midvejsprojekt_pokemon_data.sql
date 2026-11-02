-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: midvejsprojekt_pokemon
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `body_shape`
--

DROP TABLE IF EXISTS `body_shape`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `body_shape` (
  `body_shape_id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `number_of_legs` int DEFAULT NULL,
  `has_wings` tinyint(1) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`body_shape_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `body_shape`
--

LOCK TABLES `body_shape` WRITE;
/*!40000 ALTER TABLE `body_shape` DISABLE KEYS */;
INSERT INTO `body_shape` VALUES (1,'Quadruped',4,0,'Walks primarily on four legs'),(2,'Biped',2,0,'Walks primarily on two legs'),(3,'Winged',2,1,'Has wings'),(4,'Serpentine',0,0,'Long body with no legs'),(5,'Aquatic',0,0,'Body adapted primarily for swimming'),(6,'Insectoid',6,1,'Body structure similar to an insect'),(7,'Blob',0,0,'Body has no clearly defined limbs'),(8,'Humanoid',2,0,'Body structure resembles a human');
/*!40000 ALTER TABLE `body_shape` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gyms`
--

DROP TABLE IF EXISTS `gyms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gyms` (
  `gym_id` int NOT NULL,
  `gym_badge` varchar(50) DEFAULT NULL,
  `region` varchar(75) DEFAULT NULL,
  `trainer_id` int DEFAULT NULL,
  PRIMARY KEY (`gym_id`),
  KEY `trainer_id` (`trainer_id`),
  CONSTRAINT `gyms_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `trainer` (`trainer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gyms`
--

LOCK TABLES `gyms` WRITE;
/*!40000 ALTER TABLE `gyms` DISABLE KEYS */;
INSERT INTO `gyms` VALUES (1,'Boulder Badge','Kanto',3),(2,'Cascade Badge','Kanto',2),(3,'Thunder Badge','Kanto',7),(4,'Rainbow Badge','Kanto',8),(5,'Soul Badge','Kanto',9),(6,'Marsh Badge','Kanto',10),(7,'Volcano Badge','Kanto',11),(8,'Earth Badge','Kanto',12);
/*!40000 ALTER TABLE `gyms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moves`
--

DROP TABLE IF EXISTS `moves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `moves` (
  `move_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `power` int DEFAULT NULL,
  `accuracy` int DEFAULT '100',
  `move_type` varchar(45) NOT NULL,
  `catagory` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`move_id`),
  CONSTRAINT `moves_chk_1` CHECK ((`power` >= 0)),
  CONSTRAINT `moves_chk_2` CHECK ((`accuracy` between 0 and 100))
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moves`
--

LOCK TABLES `moves` WRITE;
/*!40000 ALTER TABLE `moves` DISABLE KEYS */;
INSERT INTO `moves` VALUES (1,'Pound',40,100,'Normal','Physical'),(2,'Karate Chop',50,100,'Fighting','Physical'),(3,'Double Slap',15,85,'Normal','Physical'),(4,'Comet Punch',18,85,'Normal','Physical'),(5,'Mega Punch',80,85,'Normal','Physical'),(6,'Pay Day',40,100,'Normal','Physical'),(7,'Fire Punch',75,100,'Fire','Physical'),(8,'Ice Punch',75,100,'Ice','Physical'),(9,'Thunder Punch',75,100,'Electric','Physical'),(10,'Scratch',40,100,'Normal','Physical'),(11,'Vise Grip',55,100,'Normal','Physical'),(12,'Guillotine',NULL,30,'Normal','Physical'),(13,'Razor Wind',80,100,'Normal','Special'),(14,'Swords Dance',NULL,NULL,'Normal','Status'),(15,'Cut',50,95,'Normal','Physical'),(16,'Gust',40,100,'Flying','Special'),(17,'Wing Attack',60,100,'Flying','Physical'),(18,'Whirlwind',NULL,NULL,'Normal','Status'),(19,'Fly',90,95,'Flying','Physical'),(20,'Bind',15,85,'Normal','Physical'),(21,'Slam',80,75,'Normal','Physical'),(22,'Vine Whip',45,100,'Grass','Physical'),(23,'Stomp',65,100,'Normal','Physical'),(24,'Double Kick',30,100,'Fighting','Physical'),(25,'Mega Kick',120,75,'Normal','Physical'),(26,'Jump Kick',100,95,'Fighting','Physical'),(27,'Rolling Kick',60,85,'Fighting','Physical'),(28,'Sand Attack',NULL,100,'Ground','Status'),(29,'Headbutt',70,100,'Normal','Physical'),(30,'Horn Attack',65,100,'Normal','Physical'),(31,'Fury Attack',15,85,'Normal','Physical'),(32,'Horn Drill',NULL,30,'Normal','Physical'),(33,'Tackle',40,100,'Normal','Physical'),(34,'Body Slam',85,100,'Normal','Physical'),(35,'Wrap',15,90,'Normal','Physical'),(36,'Take Down',90,85,'Normal','Physical'),(37,'Thrash',120,100,'Normal','Physical'),(38,'Double-Edge',120,100,'Normal','Physical'),(39,'Tail Whip',NULL,100,'Normal','Status'),(40,'Poison Sting',15,100,'Poison','Physical'),(41,'Twineedle',25,100,'Bug','Physical'),(42,'Pin Missile',25,95,'Bug','Physical'),(43,'Leer',NULL,100,'Normal','Status'),(44,'Bite',60,100,'Dark','Physical'),(45,'Growl',NULL,100,'Normal','Status'),(46,'Roar',NULL,NULL,'Normal','Status'),(47,'Sing',NULL,55,'Normal','Status'),(48,'Supersonic',NULL,55,'Normal','Status'),(49,'Sonic Boom',NULL,90,'Normal','Special'),(50,'Disable',NULL,100,'Normal','Status'),(51,'Acid',40,100,'Poison','Special'),(52,'Ember',40,100,'Fire','Special'),(53,'Flamethrower',90,100,'Fire','Special'),(54,'Mist',NULL,NULL,'Ice','Status'),(55,'Water Gun',40,100,'Water','Special'),(56,'Hydro Pump',110,80,'Water','Special'),(57,'Surf',90,100,'Water','Special'),(58,'Ice Beam',90,100,'Ice','Special'),(59,'Blizzard',110,70,'Ice','Special'),(60,'Psybeam',65,100,'Psychic','Special'),(61,'Bubble Beam',65,100,'Water','Special'),(62,'Aurora Beam',65,100,'Ice','Special'),(63,'Hyper Beam',150,90,'Normal','Special'),(64,'Peck',35,100,'Flying','Physical'),(65,'Drill Peck',80,100,'Flying','Physical'),(66,'Submission',80,80,'Fighting','Physical'),(67,'Low Kick',NULL,100,'Fighting','Physical'),(68,'Counter',NULL,100,'Fighting','Physical'),(69,'Seismic Toss',NULL,100,'Fighting','Physical'),(70,'Strength',80,100,'Normal','Physical'),(71,'Absorb',20,100,'Grass','Special'),(72,'Mega Drain',40,100,'Grass','Special'),(73,'Leech Seed',NULL,90,'Grass','Status'),(74,'Growth',NULL,NULL,'Normal','Status'),(75,'Razor Leaf',55,95,'Grass','Physical'),(76,'Solar Beam',120,100,'Grass','Special'),(77,'Poison Powder',NULL,75,'Poison','Status'),(78,'Stun Spore',NULL,75,'Grass','Status'),(79,'Sleep Powder',NULL,75,'Grass','Status'),(80,'Petal Dance',120,100,'Grass','Special'),(81,'String Shot',NULL,95,'Bug','Status'),(82,'Dragon Rage',NULL,100,'Dragon','Special'),(83,'Fire Spin',35,85,'Fire','Special'),(84,'Thunder Shock',40,100,'Electric','Special'),(85,'Thunderbolt',90,100,'Electric','Special'),(86,'Thunder Wave',NULL,90,'Electric','Status'),(87,'Thunder',110,70,'Electric','Special'),(88,'Rock Throw',50,90,'Rock','Physical'),(89,'Earthquake',100,100,'Ground','Physical'),(90,'Fissure',NULL,30,'Ground','Physical'),(91,'Dig',80,100,'Ground','Physical'),(92,'Toxic',NULL,90,'Poison','Status'),(93,'Confusion',50,100,'Psychic','Special'),(94,'Psychic',90,100,'Psychic','Special'),(95,'Hypnosis',NULL,60,'Psychic','Status'),(96,'Meditate',NULL,NULL,'Psychic','Status'),(97,'Agility',NULL,NULL,'Psychic','Status'),(98,'Quick Attack',40,100,'Normal','Physical'),(99,'Rage',20,100,'Normal','Physical'),(100,'Teleport',NULL,NULL,'Psychic','Status'),(101,'Night Shade',NULL,100,'Ghost','Special'),(102,'Mimic',NULL,NULL,'Normal','Status'),(103,'Screech',NULL,85,'Normal','Status'),(104,'Double Team',NULL,NULL,'Normal','Status'),(105,'Recover',NULL,NULL,'Normal','Status'),(106,'Harden',NULL,NULL,'Normal','Status'),(107,'Minimize',NULL,NULL,'Normal','Status'),(108,'Smokescreen',NULL,100,'Normal','Status'),(109,'Confuse Ray',NULL,100,'Ghost','Status'),(110,'Withdraw',NULL,NULL,'Water','Status'),(111,'Defense Curl',NULL,NULL,'Normal','Status'),(112,'Barrier',NULL,NULL,'Psychic','Status'),(113,'Light Screen',NULL,NULL,'Psychic','Status'),(114,'Haze',NULL,NULL,'Ice','Status'),(115,'Reflect',NULL,NULL,'Psychic','Status'),(116,'Focus Energy',NULL,NULL,'Normal','Status'),(117,'Bide',NULL,NULL,'Normal','Physical'),(118,'Metronome',NULL,NULL,'Normal','Status'),(119,'Mirror Move',NULL,NULL,'Flying','Status'),(120,'Self-Destruct',200,100,'Normal','Physical'),(121,'Egg Bomb',100,75,'Normal','Physical'),(122,'Lick',30,100,'Ghost','Physical'),(123,'Smog',30,70,'Poison','Special'),(124,'Sludge',65,100,'Poison','Special'),(125,'Bone Club',65,85,'Ground','Physical'),(126,'Fire Blast',110,85,'Fire','Special'),(127,'Waterfall',80,100,'Water','Physical'),(128,'Clamp',35,85,'Water','Physical'),(129,'Swift',60,NULL,'Normal','Special'),(130,'Skull Bash',130,100,'Normal','Physical'),(131,'Spike Cannon',20,100,'Normal','Physical'),(132,'Constrict',10,100,'Normal','Physical'),(133,'Amnesia',NULL,NULL,'Psychic','Status'),(134,'Kinesis',NULL,80,'Psychic','Status'),(135,'Soft-Boiled',NULL,NULL,'Normal','Status'),(136,'High Jump Kick',130,90,'Fighting','Physical'),(137,'Glare',NULL,100,'Normal','Status'),(138,'Dream Eater',100,100,'Psychic','Special'),(139,'Poison Gas',NULL,90,'Poison','Status'),(140,'Barrage',15,85,'Normal','Physical'),(141,'Leech Life',80,100,'Bug','Physical'),(142,'Lovely Kiss',NULL,75,'Normal','Status'),(143,'Sky Attack',140,90,'Flying','Physical'),(144,'Transform',NULL,NULL,'Normal','Status'),(145,'Bubble',40,100,'Water','Special'),(146,'Dizzy Punch',70,100,'Normal','Physical'),(147,'Spore',NULL,100,'Grass','Status'),(148,'Flash',NULL,100,'Normal','Status'),(149,'Psywave',NULL,100,'Psychic','Special'),(150,'Splash',NULL,NULL,'Normal','Status'),(151,'Acid Armor',NULL,NULL,'Poison','Status'),(152,'Crabhammer',100,90,'Water','Physical'),(153,'Explosion',250,100,'Normal','Physical'),(154,'Fury Swipes',18,80,'Normal','Physical'),(155,'Bonemerang',50,90,'Ground','Physical'),(156,'Rest',NULL,NULL,'Psychic','Status'),(157,'Rock Slide',75,90,'Rock','Physical'),(158,'Hyper Fang',80,90,'Normal','Physical'),(159,'Sharpen',NULL,NULL,'Normal','Status'),(160,'Conversion',NULL,NULL,'Normal','Status'),(161,'Tri Attack',80,100,'Normal','Special'),(162,'Super Fang',NULL,90,'Normal','Physical'),(163,'Slash',70,100,'Normal','Physical'),(164,'Substitute',NULL,NULL,'Normal','Status'),(165,'Struggle',50,NULL,'Normal','Physical');
/*!40000 ALTER TABLE `moves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pokemon`
--

DROP TABLE IF EXISTS `pokemon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pokemon` (
  `pokedex_number` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `speed` int DEFAULT NULL,
  `special_defence` int DEFAULT NULL,
  `special_attack` int DEFAULT NULL,
  `defence` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `primary_type` varchar(45) DEFAULT NULL,
  `secondary_type` varchar(45) DEFAULT NULL,
  `body_shape_id` int DEFAULT NULL,
  PRIMARY KEY (`pokedex_number`),
  KEY `body_shape_id` (`body_shape_id`),
  CONSTRAINT `pokemon_ibfk_1` FOREIGN KEY (`body_shape_id`) REFERENCES `body_shape` (`body_shape_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pokemon`
--

LOCK TABLES `pokemon` WRITE;
/*!40000 ALTER TABLE `pokemon` DISABLE KEYS */;
INSERT INTO `pokemon` VALUES (1,'Bulbasaur',45,65,65,49,49,45,'Grass','Poison',1),(2,'Ivysaur',60,80,80,63,62,60,'Grass','Poison',1),(3,'Venusaur',80,100,100,83,82,80,'Grass','Poison',1),(4,'Charmander',65,50,60,43,52,39,'Fire',NULL,2),(5,'Charmeleon',80,65,80,58,64,58,'Fire',NULL,2),(6,'Charizard',100,85,109,78,84,78,'Fire','Flying',3),(7,'Squirtle',43,64,50,65,48,44,'Water',NULL,2),(8,'Wartortle',58,80,65,80,63,59,'Water',NULL,2),(9,'Blastoise',78,105,85,100,83,79,'Water',NULL,2),(10,'Caterpie',45,20,20,35,30,45,'Bug',NULL,6),(11,'Metapod',30,25,25,55,20,50,'Bug',NULL,6),(12,'Butterfree',70,80,90,50,45,60,'Bug','Flying',6),(13,'Weedle',50,20,20,30,35,40,'Bug','Poison',6),(14,'Kakuna',35,25,25,50,25,45,'Bug','Poison',6),(15,'Beedrill',75,80,45,40,90,65,'Bug','Poison',6),(16,'Pidgey',56,35,35,40,45,40,'Normal','Flying',3),(17,'Pidgeotto',71,50,50,55,60,63,'Normal','Flying',3),(18,'Pidgeot',101,70,70,75,80,83,'Normal','Flying',3),(19,'Rattata',72,35,25,35,56,30,'Normal',NULL,1),(20,'Raticate',97,70,50,60,81,55,'Normal',NULL,1),(21,'Spearow',70,31,31,30,60,40,'Normal','Flying',3),(22,'Fearow',100,61,61,65,90,65,'Normal','Flying',3),(23,'Ekans',55,54,40,44,60,35,'Poison',NULL,4),(24,'Arbok',80,79,65,69,85,60,'Poison',NULL,4),(25,'Pikachu',90,50,50,40,55,35,'Electric',NULL,2),(26,'Raichu',110,80,90,55,90,60,'Electric',NULL,2),(27,'Sandshrew',40,30,20,85,75,50,'Ground',NULL,2),(28,'Sandslash',65,55,45,110,100,75,'Ground',NULL,2),(29,'Nidoran-f',41,40,40,52,47,55,'Poison',NULL,1),(30,'Nidorina',56,55,55,67,62,70,'Poison',NULL,1),(31,'Nidoqueen',76,85,75,87,92,90,'Poison','Ground',2),(32,'Nidoran-m',50,40,40,40,57,46,'Poison',NULL,1),(33,'Nidorino',65,55,55,57,72,61,'Poison',NULL,1),(34,'Nidoking',85,75,85,77,102,81,'Poison','Ground',2),(35,'Clefairy',35,65,60,48,45,70,'Fairy',NULL,2),(36,'Clefable',60,90,95,73,70,95,'Fairy',NULL,2),(37,'Vulpix',65,65,50,40,41,38,'Fire',NULL,1),(38,'Ninetales',100,100,81,75,76,73,'Fire',NULL,1),(39,'Jigglypuff',20,25,45,20,45,115,'Normal','Fairy',2),(40,'Wigglytuff',45,50,85,45,70,140,'Normal','Fairy',2),(41,'Zubat',55,40,30,35,45,40,'Poison','Flying',3),(42,'Golbat',90,75,65,70,80,75,'Poison','Flying',3),(43,'Oddish',30,65,75,55,50,45,'Grass','Poison',2),(44,'Gloom',40,75,85,70,65,60,'Grass','Poison',2),(45,'Vileplume',50,90,110,85,80,75,'Grass','Poison',2),(46,'Paras',25,55,45,55,70,35,'Bug','Grass',6),(47,'Parasect',30,80,60,80,95,60,'Bug','Grass',6),(48,'Venonat',45,55,40,50,55,60,'Bug','Poison',6),(49,'Venomoth',90,75,90,60,65,70,'Bug','Poison',6),(50,'Diglett',95,45,35,25,55,10,'Ground',NULL,7),(51,'Dugtrio',120,70,50,50,80,35,'Ground',NULL,7),(52,'Meowth',90,40,40,35,45,40,'Normal',NULL,1),(53,'Persian',115,65,65,60,70,65,'Normal',NULL,1),(54,'Psyduck',55,50,65,48,52,50,'Water',NULL,2),(55,'Golduck',85,80,95,78,82,80,'Water',NULL,2),(56,'Mankey',70,45,35,35,80,40,'Fighting',NULL,2),(57,'Primeape',95,70,60,60,105,65,'Fighting',NULL,2),(58,'Growlithe',60,50,70,45,70,55,'Fire',NULL,1),(59,'Arcanine',95,80,100,80,110,90,'Fire',NULL,1),(60,'Poliwag',90,40,40,40,50,40,'Water',NULL,5),(61,'Poliwhirl',90,50,50,65,65,65,'Water',NULL,2),(62,'Poliwrath',70,90,70,95,95,90,'Water','Fighting',2),(63,'Abra',90,55,105,15,20,25,'Psychic',NULL,8),(64,'Kadabra',105,70,120,30,35,40,'Psychic',NULL,8),(65,'Alakazam',120,95,135,45,50,55,'Psychic',NULL,8),(66,'Machop',35,35,35,50,80,70,'Fighting',NULL,8),(67,'Machoke',45,60,50,70,100,80,'Fighting',NULL,8),(68,'Machamp',55,85,65,80,130,90,'Fighting',NULL,8),(69,'Bellsprout',40,30,70,35,75,50,'Grass','Poison',2),(70,'Weepinbell',55,45,85,50,90,65,'Grass','Poison',2),(71,'Victreebel',70,70,100,65,105,80,'Grass','Poison',2),(72,'Tentacool',70,100,50,35,40,40,'Water','Poison',5),(73,'Tentacruel',100,120,80,65,70,80,'Water','Poison',5),(74,'Geodude',20,30,30,100,80,40,'Rock','Ground',8),(75,'Graveler',35,45,45,115,95,55,'Rock','Ground',8),(76,'Golem',45,65,55,130,120,80,'Rock','Ground',8),(77,'Ponyta',90,65,65,55,85,50,'Fire',NULL,1),(78,'Rapidash',105,80,80,70,100,65,'Fire',NULL,1),(79,'Slowpoke',15,40,40,65,65,90,'Water','Psychic',1),(80,'Slowbro',30,80,100,110,75,95,'Water','Psychic',2),(81,'Magnemite',45,55,95,70,35,25,'Electric','Steel',7),(82,'Magneton',70,70,120,95,60,50,'Electric','Steel',7),(83,'Farfetchd',60,62,58,55,65,52,'Normal','Flying',3),(84,'Doduo',75,35,35,45,85,35,'Normal','Flying',2),(85,'Dodrio',100,60,60,70,110,60,'Normal','Flying',2),(86,'Seel',45,70,45,55,45,65,'Water',NULL,5),(87,'Dewgong',70,95,70,80,70,90,'Water','Ice',5),(88,'Grimer',25,50,40,50,80,80,'Poison',NULL,7),(89,'Muk',50,100,65,75,105,105,'Poison',NULL,7),(90,'Shellder',40,25,45,100,65,30,'Water',NULL,5),(91,'Cloyster',70,45,85,180,95,50,'Water','Ice',5),(92,'Gastly',80,35,100,30,35,30,'Ghost','Poison',7),(93,'Haunter',95,55,115,45,50,45,'Ghost','Poison',8),(94,'Gengar',110,75,130,60,65,60,'Ghost','Poison',8),(95,'Onix',70,45,30,160,45,35,'Rock','Ground',4),(96,'Drowzee',42,90,43,45,48,60,'Psychic',NULL,8),(97,'Hypno',67,115,73,70,73,85,'Psychic',NULL,8),(98,'Krabby',50,25,25,90,105,30,'Water',NULL,6),(99,'Kingler',75,50,50,115,130,55,'Water',NULL,6),(100,'Voltorb',100,55,55,50,30,40,'Electric',NULL,7),(101,'Electrode',140,80,80,70,50,60,'Electric',NULL,7),(102,'Exeggcute',40,45,60,80,40,60,'Grass','Psychic',7),(103,'Exeggutor',55,65,125,85,95,95,'Grass','Psychic',2),(104,'Cubone',35,50,40,95,50,50,'Ground',NULL,2),(105,'Marowak',45,80,50,110,80,60,'Ground',NULL,2),(106,'Hitmonlee',87,110,35,53,120,50,'Fighting',NULL,8),(107,'Hitmonchan',76,110,35,79,105,50,'Fighting',NULL,8),(108,'Lickitung',30,75,60,75,55,90,'Normal',NULL,2),(109,'Koffing',35,45,60,95,65,40,'Poison',NULL,7),(110,'Weezing',60,70,85,120,90,65,'Poison',NULL,7),(111,'Rhyhorn',25,30,30,95,85,80,'Ground','Rock',1),(112,'Rhydon',40,45,45,120,130,105,'Ground','Rock',2),(113,'Chansey',50,105,35,5,5,250,'Normal',NULL,2),(114,'Tangela',60,40,100,115,55,65,'Grass',NULL,7),(115,'Kangaskhan',90,80,40,80,95,105,'Normal',NULL,2),(116,'Horsea',60,25,70,70,40,30,'Water',NULL,5),(117,'Seadra',85,45,95,95,65,55,'Water',NULL,5),(118,'Goldeen',63,50,35,60,67,45,'Water',NULL,5),(119,'Seaking',68,80,65,65,92,80,'Water',NULL,5),(120,'Staryu',85,55,70,55,45,30,'Water',NULL,5),(121,'Starmie',115,85,100,85,75,60,'Water','Psychic',5),(122,'Mr-mime',90,120,100,65,45,40,'Psychic','Fairy',8),(123,'Scyther',105,80,55,80,110,70,'Bug','Flying',6),(124,'Jynx',95,95,115,35,50,65,'Ice','Psychic',8),(125,'Electabuzz',105,85,95,57,83,65,'Electric',NULL,8),(126,'Magmar',93,85,100,57,95,65,'Fire',NULL,8),(127,'Pinsir',85,70,55,100,125,65,'Bug',NULL,6),(128,'Tauros',110,70,40,95,100,75,'Normal',NULL,1),(129,'Magikarp',80,20,15,55,10,20,'Water',NULL,5),(130,'Gyarados',81,100,60,79,125,95,'Water','Flying',4),(131,'Lapras',60,95,85,80,85,130,'Water','Ice',5),(132,'Ditto',48,48,48,48,48,48,'Normal',NULL,7),(133,'Eevee',55,65,45,50,55,55,'Normal',NULL,1),(134,'Vaporeon',65,95,110,60,65,130,'Water',NULL,1),(135,'Jolteon',130,95,110,60,65,65,'Electric',NULL,1),(136,'Flareon',65,110,95,60,130,65,'Fire',NULL,1),(137,'Porygon',40,75,85,70,60,65,'Normal',NULL,7),(138,'Omanyte',35,55,90,100,40,35,'Rock','Water',5),(139,'Omastar',55,70,115,125,60,70,'Rock','Water',5),(140,'Kabuto',55,45,55,90,80,30,'Rock','Water',5),(141,'Kabutops',80,70,65,105,115,60,'Rock','Water',2),(142,'Aerodactyl',130,75,60,65,105,80,'Rock','Flying',3),(143,'Snorlax',30,110,65,65,110,160,'Normal',NULL,2),(144,'Articuno',85,125,95,100,85,90,'Ice','Flying',3),(145,'Zapdos',100,90,125,85,90,90,'Electric','Flying',3),(146,'Moltres',90,85,125,90,100,90,'Fire','Flying',3),(147,'Dratini',50,50,50,45,64,41,'Dragon',NULL,4),(148,'Dragonair',70,70,70,65,84,61,'Dragon',NULL,4),(149,'Dragonite',80,100,100,95,134,91,'Dragon','Flying',3),(150,'Mewtwo',130,90,154,90,110,106,'Psychic',NULL,8),(151,'Mew',100,100,100,100,100,100,'Psychic',NULL,2);
/*!40000 ALTER TABLE `pokemon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pokemon_moves`
--

DROP TABLE IF EXISTS `pokemon_moves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pokemon_moves` (
  `pokedex_number` int NOT NULL,
  `move_id` int NOT NULL,
  PRIMARY KEY (`pokedex_number`,`move_id`),
  KEY `move_id` (`move_id`),
  CONSTRAINT `pokemon_moves_ibfk_1` FOREIGN KEY (`pokedex_number`) REFERENCES `pokemon` (`pokedex_number`),
  CONSTRAINT `pokemon_moves_ibfk_2` FOREIGN KEY (`move_id`) REFERENCES `moves` (`move_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pokemon_moves`
--

LOCK TABLES `pokemon_moves` WRITE;
/*!40000 ALTER TABLE `pokemon_moves` DISABLE KEYS */;
INSERT INTO `pokemon_moves` VALUES (35,1),(39,1),(88,1),(96,1),(56,2),(57,2),(66,2),(67,2),(35,3),(39,3),(60,3),(107,4),(115,4),(52,6),(107,7),(126,7),(107,8),(124,8),(107,9),(125,9),(4,10),(27,10),(29,10),(46,10),(50,10),(52,10),(54,10),(56,10),(140,10),(98,11),(127,11),(98,12),(3,14),(6,14),(15,14),(28,14),(71,14),(83,14),(99,14),(123,14),(127,14),(141,14),(83,15),(16,16),(16,17),(17,17),(42,17),(123,17),(142,17),(17,19),(18,19),(22,19),(114,20),(95,21),(108,21),(114,21),(148,21),(1,22),(69,22),(114,22),(77,23),(78,23),(99,23),(103,23),(108,23),(111,23),(29,24),(30,24),(32,24),(33,24),(106,24),(135,24),(106,26),(106,27),(16,28),(17,28),(27,28),(50,28),(51,28),(133,28),(79,29),(86,29),(104,29),(32,30),(33,30),(111,30),(118,30),(138,30),(21,31),(84,31),(111,31),(119,31),(112,32),(119,32),(1,33),(7,33),(10,33),(11,33),(19,33),(48,33),(74,33),(90,33),(100,33),(109,33),(120,33),(129,33),(133,33),(2,34),(3,34),(9,34),(20,34),(24,34),(26,34),(30,34),(31,34),(33,34),(36,34),(38,34),(40,34),(59,34),(61,34),(68,34),(76,34),(85,34),(87,34),(89,34),(112,34),(115,34),(128,34),(131,34),(136,34),(143,34),(149,34),(23,35),(69,35),(70,35),(72,35),(108,35),(147,35),(59,36),(78,36),(57,37),(105,37),(18,38),(22,38),(19,39),(29,39),(37,39),(77,39),(111,39),(118,39),(13,40),(14,40),(23,40),(30,40),(33,40),(15,41),(15,42),(135,42),(21,43),(32,43),(58,43),(66,43),(98,43),(104,43),(117,43),(138,43),(147,43),(7,44),(8,44),(23,44),(30,44),(41,44),(42,44),(52,44),(58,44),(115,44),(133,44),(142,44),(4,45),(21,45),(29,45),(84,45),(86,45),(104,45),(58,46),(35,47),(39,47),(40,47),(131,47),(41,48),(48,48),(72,48),(81,48),(90,48),(118,48),(81,49),(100,49),(48,50),(54,50),(79,50),(88,50),(96,50),(24,51),(44,51),(70,51),(72,51),(4,52),(5,52),(37,52),(58,52),(77,52),(5,53),(6,53),(38,53),(59,53),(126,53),(136,53),(146,53),(144,54),(7,55),(8,55),(54,55),(60,55),(61,55),(79,55),(116,55),(120,55),(138,55),(55,56),(73,56),(117,56),(130,56),(139,56),(141,56),(9,57),(55,57),(62,57),(73,57),(80,57),(87,57),(121,57),(131,57),(134,57),(139,57),(141,57),(8,58),(9,58),(31,58),(55,58),(87,58),(113,58),(117,58),(134,58),(144,58),(20,59),(34,59),(36,59),(40,59),(73,59),(91,59),(119,59),(124,59),(128,59),(131,59),(139,59),(144,59),(149,59),(12,60),(49,60),(137,60),(53,61),(61,61),(72,61),(86,62),(99,63),(128,63),(130,63),(142,63),(149,63),(21,64),(32,64),(83,64),(84,64),(118,64),(22,65),(84,65),(85,65),(145,65),(62,66),(67,66),(68,66),(56,67),(66,67),(67,67),(26,69),(57,69),(63,69),(67,69),(97,69),(113,69),(127,69),(43,71),(140,71),(12,72),(44,72),(47,72),(1,73),(2,73),(102,73),(69,74),(2,75),(3,75),(70,75),(71,75),(45,76),(43,77),(69,77),(43,78),(45,78),(46,78),(49,78),(71,78),(1,79),(2,79),(3,79),(12,79),(43,79),(44,79),(45,79),(49,79),(70,79),(71,79),(103,79),(114,79),(44,80),(45,80),(10,81),(11,81),(13,81),(14,81),(130,82),(148,82),(77,83),(146,83),(25,84),(81,84),(25,85),(26,85),(31,85),(34,85),(36,85),(53,85),(82,85),(94,85),(101,85),(110,85),(121,85),(125,85),(130,85),(135,85),(145,85),(149,85),(25,86),(26,86),(36,86),(40,86),(63,86),(64,86),(65,86),(81,86),(82,86),(97,86),(113,86),(135,86),(147,86),(148,86),(145,87),(74,88),(75,88),(95,88),(6,89),(9,89),(24,89),(28,89),(31,89),(34,89),(51,89),(62,89),(68,89),(75,89),(76,89),(95,89),(105,89),(112,89),(115,89),(128,89),(143,89),(5,91),(27,91),(50,91),(12,93),(48,93),(79,93),(96,93),(122,93),(49,94),(63,94),(64,94),(65,94),(80,94),(97,94),(103,94),(121,94),(122,94),(124,94),(125,94),(150,94),(151,94),(60,95),(61,95),(62,95),(92,95),(93,95),(94,95),(96,95),(97,95),(102,95),(15,97),(18,97),(22,97),(78,97),(83,97),(85,97),(116,97),(117,97),(144,97),(145,97),(147,97),(148,97),(16,98),(17,98),(18,98),(19,98),(25,98),(37,98),(123,98),(125,98),(133,98),(63,100),(92,101),(93,101),(94,101),(53,103),(82,103),(95,103),(100,103),(64,105),(65,105),(120,105),(121,105),(137,105),(150,105),(11,106),(14,106),(75,106),(120,106),(140,106),(109,108),(116,108),(37,109),(38,109),(41,109),(42,109),(92,109),(126,109),(7,110),(8,110),(80,110),(90,110),(138,110),(39,111),(74,111),(73,112),(122,112),(150,112),(101,113),(122,113),(42,114),(110,114),(65,115),(102,115),(66,116),(35,118),(151,118),(74,120),(75,120),(100,120),(92,122),(93,122),(108,122),(109,123),(126,123),(136,123),(88,124),(89,124),(109,124),(110,124),(104,125),(38,126),(59,126),(78,126),(136,126),(146,126),(119,127),(90,128),(91,128),(82,129),(101,129),(91,131),(139,131),(55,133),(80,133),(143,133),(150,133),(64,134),(113,135),(151,135),(106,136),(23,137),(24,137),(93,138),(88,139),(102,140),(41,141),(46,141),(47,141),(124,142),(142,143),(146,143),(132,144),(151,144),(60,145),(98,145),(116,145),(46,147),(47,147),(129,150),(89,151),(134,151),(99,152),(76,153),(89,153),(91,153),(94,153),(101,153),(103,153),(110,153),(54,154),(56,154),(105,155),(86,156),(87,156),(134,156),(143,156),(28,157),(34,157),(51,157),(57,157),(68,157),(76,157),(105,157),(112,157),(19,158),(20,158),(137,160),(85,161),(137,161),(20,162),(4,163),(5,163),(6,163),(27,163),(28,163),(47,163),(50,163),(51,163),(52,163),(53,163),(123,163),(127,163),(140,163),(141,163);
/*!40000 ALTER TABLE `pokemon_moves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainer`
--

DROP TABLE IF EXISTS `trainer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainer` (
  `trainer_id` int NOT NULL AUTO_INCREMENT,
  `trainer_name` varchar(50) NOT NULL,
  `age` int DEFAULT NULL,
  `hometown` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`trainer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainer`
--

LOCK TABLES `trainer` WRITE;
/*!40000 ALTER TABLE `trainer` DISABLE KEYS */;
INSERT INTO `trainer` VALUES (1,'Ash',10,'Pallet Town'),(2,'Misty',10,'Cerulean City'),(3,'Brock',15,'Pewter City'),(4,'Gary',10,'Pallet Town'),(5,'Jessie',20,'Unknown'),(6,'James',20,'Unknown'),(7,'Lt. Surge',40,'Vermilion City'),(8,'Erika',20,'Celadon City'),(9,'Koga',40,'Fuchsia City'),(10,'Sabrina',21,'Saffron City'),(11,'Blaine',58,'Cinnabar Island'),(12,'Giovanni',40,'Viridian City');
/*!40000 ALTER TABLE `trainer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainer_pokemon`
--

DROP TABLE IF EXISTS `trainer_pokemon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainer_pokemon` (
  `trainer_id` int NOT NULL,
  `pokedex_number` int NOT NULL,
  PRIMARY KEY (`trainer_id`,`pokedex_number`),
  KEY `pokedex_number` (`pokedex_number`),
  CONSTRAINT `trainer_pokemon_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `trainer` (`trainer_id`),
  CONSTRAINT `trainer_pokemon_ibfk_2` FOREIGN KEY (`pokedex_number`) REFERENCES `pokemon` (`pokedex_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainer_pokemon`
--

LOCK TABLES `trainer_pokemon` WRITE;
/*!40000 ALTER TABLE `trainer_pokemon` DISABLE KEYS */;
INSERT INTO `trainer_pokemon` VALUES (1,1),(1,6),(4,9),(1,12),(5,24),(1,25),(4,25),(3,41),(5,52),(6,52),(2,54),(4,59),(3,74),(3,95),(6,110),(2,118),(2,120),(2,121),(4,133),(1,143);
/*!40000 ALTER TABLE `trainer_pokemon` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-27 15:46:47

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : ven. 21 mars 2025 à 14:04
-- Version du serveur : 8.0.41
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `maxi_loc`
--

-- --------------------------------------------------------

--
-- Structure de la table `Charge`
--

CREATE TABLE `Charge` (
  `id_charge` int NOT NULL,
  `date_paiement` datetime NOT NULL,
  `montant` int NOT NULL,
  `id_type_charge` int NOT NULL,
  `id_propriete` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Plateforme`
--

CREATE TABLE `Plateforme` (
  `id_plateforme` int NOT NULL,
  `nom` varchar(25) DEFAULT NULL,
  `site_web` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Plateforme_propriete`
--

CREATE TABLE `Plateforme_propriete` (
  `id_propriete` int NOT NULL,
  `id_plateforme` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Propriete`
--

CREATE TABLE `Propriete` (
  `id_propriete` int NOT NULL,
  `nom` varchar(25) NOT NULL,
  `adresse` varchar(100) NOT NULL,
  `ville` varchar(50) NOT NULL,
  `pays` varchar(50) NOT NULL,
  `capacite` int NOT NULL,
  `superficie` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `id_utilisateur` int NOT NULL,
  `id_type_propriete` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Reservation`
--

CREATE TABLE `Reservation` (
  `id_reservation` int NOT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `prix_total` int DEFAULT NULL,
  `id_statut_reservation` int NOT NULL,
  `id_propriete` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Statut_reservation`
--

CREATE TABLE `Statut_reservation` (
  `id_statut_reservation` int NOT NULL,
  `libelle` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Type_charge`
--

CREATE TABLE `Type_charge` (
  `id_type_charge` int NOT NULL,
  `libelle` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Type_propriete`
--

CREATE TABLE `Type_propriete` (
  `id_type_propriete` int NOT NULL,
  `libelle` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Utilisateur`
--

CREATE TABLE `Utilisateur` (
  `id_utilisateur` int NOT NULL,
  `nom` varchar(20) NOT NULL,
  `prenom` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mot_de_passe` varchar(255) DEFAULT NULL,
  `telephone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Charge`
--
ALTER TABLE `Charge`
  ADD PRIMARY KEY (`id_charge`),
  ADD KEY `id_type_charge` (`id_type_charge`),
  ADD KEY `id_propriete` (`id_propriete`);

--
-- Index pour la table `Plateforme`
--
ALTER TABLE `Plateforme`
  ADD PRIMARY KEY (`id_plateforme`);

--
-- Index pour la table `Plateforme_propriete`
--
ALTER TABLE `Plateforme_propriete`
  ADD PRIMARY KEY (`id_propriete`,`id_plateforme`),
  ADD KEY `id_plateforme` (`id_plateforme`);

--
-- Index pour la table `Propriete`
--
ALTER TABLE `Propriete`
  ADD PRIMARY KEY (`id_propriete`),
  ADD KEY `id_utilisateur` (`id_utilisateur`),
  ADD KEY `id_type_propriete` (`id_type_propriete`);

--
-- Index pour la table `Reservation`
--
ALTER TABLE `Reservation`
  ADD PRIMARY KEY (`id_reservation`),
  ADD KEY `id_statut_reservation` (`id_statut_reservation`),
  ADD KEY `id_propriete` (`id_propriete`);

--
-- Index pour la table `Statut_reservation`
--
ALTER TABLE `Statut_reservation`
  ADD PRIMARY KEY (`id_statut_reservation`);

--
-- Index pour la table `Type_charge`
--
ALTER TABLE `Type_charge`
  ADD PRIMARY KEY (`id_type_charge`);

--
-- Index pour la table `Type_propriete`
--
ALTER TABLE `Type_propriete`
  ADD PRIMARY KEY (`id_type_propriete`);

--
-- Index pour la table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD PRIMARY KEY (`id_utilisateur`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Charge`
--
ALTER TABLE `Charge`
  ADD CONSTRAINT `Charge_ibfk_1` FOREIGN KEY (`id_type_charge`) REFERENCES `Type_charge` (`id_type_charge`),
  ADD CONSTRAINT `Charge_ibfk_2` FOREIGN KEY (`id_propriete`) REFERENCES `Propriete` (`id_propriete`);

--
-- Contraintes pour la table `Plateforme_propriete`
--
ALTER TABLE `Plateforme_propriete`
  ADD CONSTRAINT `Plateforme_propriete_ibfk_1` FOREIGN KEY (`id_propriete`) REFERENCES `Propriete` (`id_propriete`),
  ADD CONSTRAINT `Plateforme_propriete_ibfk_2` FOREIGN KEY (`id_plateforme`) REFERENCES `Plateforme` (`id_plateforme`);

--
-- Contraintes pour la table `Propriete`
--
ALTER TABLE `Propriete`
  ADD CONSTRAINT `Propriete_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur` (`id_utilisateur`),
  ADD CONSTRAINT `Propriete_ibfk_2` FOREIGN KEY (`id_type_propriete`) REFERENCES `Type_propriete` (`id_type_propriete`);

--
-- Contraintes pour la table `Reservation`
--
ALTER TABLE `Reservation`
  ADD CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`id_statut_reservation`) REFERENCES `Statut_reservation` (`id_statut_reservation`),
  ADD CONSTRAINT `Reservation_ibfk_2` FOREIGN KEY (`id_propriete`) REFERENCES `Propriete` (`id_propriete`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

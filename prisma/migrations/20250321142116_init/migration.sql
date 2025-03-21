-- CreateTable
CREATE TABLE `Charge` (
    `id_charge` INTEGER NOT NULL AUTO_INCREMENT,
    `date_paiement` DATETIME(3) NOT NULL,
    `montant` INTEGER NOT NULL,
    `id_type_charge` INTEGER NOT NULL,
    `id_propriete` INTEGER NOT NULL,

    PRIMARY KEY (`id_charge`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plateforme` (
    `id_plateforme` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,
    `site_web` VARCHAR(191) NULL,

    PRIMARY KEY (`id_plateforme`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Propriete` (
    `id_propriete` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `id_type_propriete` INTEGER NOT NULL,

    PRIMARY KEY (`id_propriete`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeCharge` (
    `id_type_charge` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,

    PRIMARY KEY (`id_type_charge`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypePropriete` (
    `id_type_propriete` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,

    PRIMARY KEY (`id_type_propriete`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id_client` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,
    `prenom` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,

    PRIMARY KEY (`id_client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contrat` (
    `id_contrat` INTEGER NOT NULL AUTO_INCREMENT,
    `date_debut` DATETIME(3) NOT NULL,
    `date_fin` DATETIME(3) NOT NULL,
    `montant_loyer` INTEGER NOT NULL,
    `id_propriete` INTEGER NOT NULL,
    `id_client` INTEGER NOT NULL,

    PRIMARY KEY (`id_contrat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paiement` (
    `id_paiement` INTEGER NOT NULL AUTO_INCREMENT,
    `date_paiement` DATETIME(3) NOT NULL,
    `montant` INTEGER NOT NULL,
    `id_contrat` INTEGER NOT NULL,

    PRIMARY KEY (`id_paiement`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id_reservation` INTEGER NOT NULL AUTO_INCREMENT,
    `date_debut` DATETIME(3) NOT NULL,
    `date_fin` DATETIME(3) NOT NULL,
    `montant` INTEGER NOT NULL,
    `id_propriete` INTEGER NOT NULL,
    `id_client` INTEGER NOT NULL,
    `id_plateforme` INTEGER NOT NULL,

    PRIMARY KEY (`id_reservation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facture` (
    `id_facture` INTEGER NOT NULL AUTO_INCREMENT,
    `date_emission` DATETIME(3) NOT NULL,
    `montant` INTEGER NOT NULL,
    `id_client` INTEGER NOT NULL,

    PRIMARY KEY (`id_facture`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `nom` VARCHAR(25) NULL,
    `site_web` VARCHAR(255) NULL,

    PRIMARY KEY (`id_plateforme`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plateforme_propriete` (
    `id_propriete` INTEGER NOT NULL,
    `id_plateforme` INTEGER NOT NULL,

    PRIMARY KEY (`id_propriete`, `id_plateforme`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Propriete` (
    `id_propriete` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(25) NOT NULL,
    `adresse` VARCHAR(100) NOT NULL,
    `ville` VARCHAR(50) NOT NULL,
    `pays` VARCHAR(50) NOT NULL,
    `capacite` INTEGER NOT NULL,
    `superficie` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `id_utilisateur` INTEGER NOT NULL,
    `id_type_propriete` INTEGER NOT NULL,

    PRIMARY KEY (`id_propriete`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id_reservation` INTEGER NOT NULL AUTO_INCREMENT,
    `date_debut` DATETIME(3) NOT NULL,
    `date_fin` DATETIME(3) NOT NULL,
    `prix_total` INTEGER NULL,
    `id_statut_reservation` INTEGER NOT NULL,
    `id_propriete` INTEGER NOT NULL,

    PRIMARY KEY (`id_reservation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Statut_reservation` (
    `id_statut_reservation` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`id_statut_reservation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type_charge` (
    `id_type_charge` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id_type_charge`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type_propriete` (
    `id_type_propriete` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id_type_propriete`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Utilisateur` (
    `id_utilisateur` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(20) NOT NULL,
    `prenom` VARCHAR(20) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `mot_de_passe` VARCHAR(255) NULL,
    `telephone` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id_utilisateur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Charge` ADD CONSTRAINT `Charge_id_type_charge_fkey` FOREIGN KEY (`id_type_charge`) REFERENCES `Type_charge`(`id_type_charge`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Charge` ADD CONSTRAINT `Charge_id_propriete_fkey` FOREIGN KEY (`id_propriete`) REFERENCES `Propriete`(`id_propriete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plateforme_propriete` ADD CONSTRAINT `Plateforme_propriete_id_propriete_fkey` FOREIGN KEY (`id_propriete`) REFERENCES `Propriete`(`id_propriete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plateforme_propriete` ADD CONSTRAINT `Plateforme_propriete_id_plateforme_fkey` FOREIGN KEY (`id_plateforme`) REFERENCES `Plateforme`(`id_plateforme`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Propriete` ADD CONSTRAINT `Propriete_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Propriete` ADD CONSTRAINT `Propriete_id_type_propriete_fkey` FOREIGN KEY (`id_type_propriete`) REFERENCES `Type_propriete`(`id_type_propriete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_statut_reservation_fkey` FOREIGN KEY (`id_statut_reservation`) REFERENCES `Statut_reservation`(`id_statut_reservation`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_propriete_fkey` FOREIGN KEY (`id_propriete`) REFERENCES `Propriete`(`id_propriete`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `capacite` on the `Propriete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Charge` ADD COLUMN `description` VARCHAR(120) NULL;

-- AlterTable
ALTER TABLE `Propriete` DROP COLUMN `capacite`,
    ADD COLUMN `code_postal` VARCHAR(10) NULL,
    ADD COLUMN `nb_pieces` INTEGER NULL;

-- AlterTable
ALTER TABLE `Utilisateur` ADD COLUMN `date_naissance` DATETIME(3) NULL;

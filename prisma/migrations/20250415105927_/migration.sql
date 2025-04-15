/*
  Warnings:

  - Made the column `code_postal` on table `Propriete` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nb_pieces` on table `Propriete` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date_naissance` on table `Utilisateur` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Propriete` MODIFY `code_postal` VARCHAR(10) NOT NULL,
    MODIFY `nb_pieces` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Utilisateur` MODIFY `date_naissance` DATETIME(3) NOT NULL;

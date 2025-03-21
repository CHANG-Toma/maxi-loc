/*
  Warnings:

  - You are about to alter the column `telephone` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `nom` on the `Plateforme` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.

*/
-- AlterTable
ALTER TABLE `Client` MODIFY `nom` VARCHAR(255) NULL,
    MODIFY `prenom` VARCHAR(255) NULL,
    MODIFY `email` VARCHAR(255) NULL,
    MODIFY `telephone` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `Plateforme` MODIFY `nom` VARCHAR(25) NULL,
    MODIFY `site_web` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Propriete` MODIFY `nom` VARCHAR(255) NULL,
    MODIFY `adresse` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `TypeCharge` MODIFY `nom` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `TypePropriete` MODIFY `nom` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `Charge` ADD CONSTRAINT `Charge_id_type_charge_fkey` FOREIGN KEY (`id_type_charge`) REFERENCES `TypeCharge`(`id_type_charge`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Charge` ADD CONSTRAINT `Charge_id_propriete_fkey` FOREIGN KEY (`id_propriete`) REFERENCES `Propriete`(`id_propriete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Propriete` ADD CONSTRAINT `Propriete_id_type_propriete_fkey` FOREIGN KEY (`id_type_propriete`) REFERENCES `TypePropriete`(`id_type_propriete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contrat` ADD CONSTRAINT `Contrat_id_propriete_fkey` FOREIGN KEY (`id_propriete`) REFERENCES `Propriete`(`id_propriete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contrat` ADD CONSTRAINT `Contrat_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_id_contrat_fkey` FOREIGN KEY (`id_contrat`) REFERENCES `Contrat`(`id_contrat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_propriete_fkey` FOREIGN KEY (`id_propriete`) REFERENCES `Propriete`(`id_propriete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_plateforme_fkey` FOREIGN KEY (`id_plateforme`) REFERENCES `Plateforme`(`id_plateforme`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

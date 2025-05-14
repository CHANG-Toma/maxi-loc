"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Composant pour la page des CGU
export default function CGUPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 py-12">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className={`flex items-center gap-2 ${
              isDarkMode 
                ? "text-gray-400 hover:text-white hover:bg-gray-800" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className={`text-4xl font-bold mb-8 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Conditions Générales d'Utilisation
          </h1>

          <div className={`space-y-8 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 1 - Objet
              </h2>
              <p className="mb-4">
                Les présentes conditions générales d'utilisation (CGU) ont pour objet l'encadrement juridique des modalités de mise à disposition du site et des services par Maxiloc.
              </p>
              <p>
                Les CGU doivent être acceptées par tout Utilisateur souhaitant accéder au site. Elles constituent le contrat entre la Société et l'Utilisateur. L'accès au site par l'Utilisateur signifie son acceptation des présentes CGU.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 2 - Accès aux services
              </h2>
              <p className="mb-4">
                Le site permet à l'Utilisateur un accès aux services suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestion de biens immobiliers</li>
                <li>Suivi des locations</li>
                <li>Gestion des paiements</li>
                <li>Génération de documents</li>
                <li>Tableaux de bord et statistiques</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 3 - Inscription et accès aux services
              </h2>
              <p className="mb-4">
                L'Utilisateur qui souhaite bénéficier des services du site doit s'inscrire en remplissant le formulaire d'inscription. L'Utilisateur s'engage à fournir des informations exactes et complètes.
              </p>
              <p>
                L'accès aux services est réservé aux Utilisateurs inscrits. L'Utilisateur est responsable de la confidentialité de son compte et de son mot de passe.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 4 - Obligations de l'Utilisateur
              </h2>
              <p className="mb-4">
                L'Utilisateur s'engage à :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fournir des informations exactes et à jour</li>
                <li>Respecter les lois et réglementations en vigueur</li>
                <li>Ne pas utiliser le service à des fins illégales</li>
                <li>Ne pas perturber le fonctionnement du service</li>
                <li>Ne pas tenter d'accéder aux données d'autres utilisateurs</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 5 - Propriété intellectuelle
              </h2>
              <p>
                Les contenus présents sur le site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, etc.) sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, du site et de son contenu est interdite sans autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 6 - Protection des données personnelles
              </h2>
              <p>
                Les données personnelles collectées sur le site sont traitées conformément à notre politique de confidentialité, accessible sur le site. L'Utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données personnelles.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 7 - Responsabilité
              </h2>
              <p className="mb-4">
                Maxiloc s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur le site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
              </p>
              <p>
                Maxiloc ne peut être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 8 - Modification des CGU
              </h2>
              <p>
                Maxiloc se réserve la possibilité de modifier les présentes CGU à tout moment. L'utilisateur est invité à les consulter de manière régulière. La dernière mise à jour des CGU a été effectuée le {new Date().toLocaleDateString()}.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 9 - Droit applicable et juridiction compétente
              </h2>
              <p>
                Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

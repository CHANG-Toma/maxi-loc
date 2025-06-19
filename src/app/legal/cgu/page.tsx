"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Composant pour la page des CGU
export default function CGUPage() {
  const [isDarkMode] = useState(true);
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
            Conditions Générales d&apos;Utilisation
          </h1>

          <div className={`space-y-8 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 1 - Objet
              </h2>
              <p className="mb-4">
                Les présentes conditions générales d&apos;utilisation (CGU) ont pour objet l&apos;encadrement juridique des modalités de mise à disposition du site et des services par Maxiloc.
              </p>
              <p>
                Les CGU doivent être acceptées par tout Utilisateur souhaitant accéder au site. Elles constituent le contrat entre la Société et l&apos;Utilisateur. L&apos;accès au site par l&apos;Utilisateur signifie son acceptation des présentes CGU.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 2 - Accès aux services
              </h2>
              <p className="mb-4">
                Le site permet à l&apos;Utilisateur un accès aux services suivants :
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
                L&apos;Utilisateur qui souhaite bénéficier des services du site doit s&apos;inscrire en remplissant le formulaire d&apos;inscription. L&apos;Utilisateur s&apos;engage à fournir des informations exactes et complètes.
              </p>
              <p>
                L&apos;accès aux services est réservé aux Utilisateurs inscrits. L&apos;Utilisateur est responsable de la confidentialité de son compte et de son mot de passe.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 4 - Obligations de l&apos;Utilisateur
              </h2>
              <p className="mb-4">
                L&apos;Utilisateur s&apos;engage à :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fournir des informations exactes et à jour</li>
                <li>Respecter les lois et réglementations en vigueur</li>
                <li>Ne pas utiliser le service à des fins illégales</li>
                <li>Ne pas perturber le fonctionnement du service</li>
                <li>Ne pas tenter d&apos;accéder aux données d&apos;autres utilisateurs</li>
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
                Les données personnelles collectées sur le site sont traitées conformément à notre politique de confidentialité, accessible sur le site. L&apos;Utilisateur dispose d&apos;un droit d&apos;accès, de rectification et de suppression de ses données personnelles.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 7 - Responsabilité
              </h2>
              <p className="mb-4">
                Maxiloc s&apos;efforce d&apos;assurer au mieux de ses possibilités l&apos;exactitude et la mise à jour des informations diffusées sur le site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
              </p>
              <p>
                L&apos;Utilisateur s&apos;engage à ne pas utiliser le Site à des fins illégales ou interdites par les présentes CGU, ni à tenter d&apos;obtenir un accès non autorisé à d&apos;autres systèmes ou réseaux connectés au Site.
              </p>
              <p>
                L&apos;Utilisateur reconnaît que l&apos;utilisation du Site se fait à ses propres risques. MaxiLoc ne saurait être tenu responsable des dommages directs ou indirects, y compris mais sans s&apos;y limiter, la perte de profits, de données ou d&apos;autres pertes intangibles, résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le Site.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 8 - Modification des CGU
              </h2>
              <p>
                Maxiloc se réserve la possibilité de modifier les présentes CGU à tout moment. L&apos;utilisateur est invité à les consulter de manière régulière. La dernière mise à jour des CGU a été effectuée le {new Date().toLocaleDateString()}.
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

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Article 10 - L&#39;application est en cours de développement
              </h2>
              <p>
                L&#39;application est en cours de développement
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

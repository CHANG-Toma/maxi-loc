"use client"

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Composant pour la page des mentions légales
export default function MentionsLegales() {
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
            Mentions Légales
          </h1>

          <div className={`space-y-8 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Éditeur du site
              </h2>
              <div className="space-y-2">
                <p><strong>Raison sociale :</strong> ...</p>
                <p><strong>Forme juridique :</strong> ...</p>
                <p><strong>Capital social :</strong> ...</p>
                <p><strong>Siège social :</strong> ...</p>
                <p><strong>SIRET :</strong> ...</p>
                <p><strong>RCS :</strong> ...</p>
                <p><strong>N° TVA intracommunautaire :</strong> ...</p>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Contact
              </h2>
              <div className="space-y-2">
                <p><strong>Email :</strong> ...</p>
                <p><strong>Téléphone :</strong> ...</p>
                <p><strong>Directeur de la publication :</strong> ...</p>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Hébergement
              </h2>
              <div className="space-y-2">
                <p><strong>Hébergeur :</strong> ...</p>
                <p><strong>Adresse :</strong> ...</p>
                <p><strong>Site web :</strong> ...</p>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Activité
              </h2>
              <p>
                Maxiloc est une plateforme de gestion locative qui propose des services de gestion immobilière en ligne, incluant la gestion des biens, le suivi des locations, la gestion des paiements et la génération de documents.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Propriété intellectuelle
              </h2>
              <p>
                L'ensemble des éléments constituant le site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, etc.) sont la propriété exclusive de Maxiloc ou de ses partenaires. Toute reproduction ou représentation, totale ou partielle, du site et de son contenu est interdite sans autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Protection des données personnelles
              </h2>
              <p>
                Les données personnelles collectées sur le site sont traitées conformément à notre politique de confidentialité, accessible sur le site. Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Cookies
              </h2>
              <p>
                Le site utilise des cookies pour améliorer votre expérience de navigation. Pour plus d'informations sur l'utilisation des cookies, veuillez consulter notre politique de cookies.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Dernière mise à jour
              </h2>
              <p>
                Les présentes mentions légales ont été mises à jour le {new Date().toLocaleDateString()}.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
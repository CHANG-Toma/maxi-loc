"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PolitiqueConfidentialite() {
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
            Politique de Confidentialité
          </h1>

          <div className={`space-y-8 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Introduction
              </h2>
              <p className="mb-4">
                La présente politique de confidentialité décrit comment Maxiloc collecte, utilise et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
              </p>
              <p>
                Nous nous engageons à respecter la vie privée de nos utilisateurs et à traiter leurs données personnelles de manière transparente et sécurisée.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Responsable du traitement
              </h2>
              <div className="space-y-2">
                <p><strong>Identité :</strong> ...</p>
                <p><strong>Adresse :</strong> ...</p>
                <p><strong>Email :</strong> ...</p>
                <p><strong>Téléphone :</strong> ...</p>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Données collectées
              </h2>
              <p className="mb-4">Nous collectons les données suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Données d'identification (nom, prénom, email)</li>
                <li>Données de connexion (logs)</li>
                <li>Données relatives aux biens immobiliers</li>
                <li>Données de paiement (traitées de manière sécurisée)</li>
                <li>Données de communication</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Finalités du traitement
              </h2>
              <p className="mb-4">Vos données sont collectées pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gérer votre compte utilisateur</li>
                <li>Fournir nos services de gestion locative</li>
                <li>Traiter les paiements</li>
                <li>Générer les documents nécessaires</li>
                <li>Améliorer nos services</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Base légale du traitement
              </h2>
              <p className="mb-4">Le traitement de vos données est fondé sur :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>L'exécution du contrat de services</li>
                <li>Votre consentement</li>
                <li>Le respect d'obligations légales</li>
                <li>Notre intérêt légitime</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Destinataires des données
              </h2>
              <p className="mb-4">Vos données peuvent être partagées avec :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nos prestataires de services</li>
                <li>Les autorités compétentes sur demande</li>
                <li>Les propriétaires/locataires concernés</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Durée de conservation
              </h2>
              <p>
                Vos données sont conservées pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, et au minimum pendant la durée légale de conservation applicable.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Vos droits
              </h2>
              <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition</li>
                <li>Droit de retirer votre consentement</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Sécurité des données
              </h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre toute perte, accès non autorisé, divulgation, altération ou destruction.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Cookies
              </h2>
              <p>
                Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies ou être informé quand un cookie est envoyé.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Modifications
              </h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. La dernière mise à jour a été effectuée le {new Date().toLocaleDateString()}.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Contact
              </h2>
              <p>
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter à l'adresse suivante : ...
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

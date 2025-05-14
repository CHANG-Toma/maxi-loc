"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Composant pour la page d'accessibilité

export default function AccessibilityPage() {
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
            Déclaration d'accessibilité
          </h1>

          <div className={`space-y-8 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Conformité
              </h2>
              <p className="mb-4">
                Maxiloc s'engage à rendre son site internet accessible conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.
              </p>
              <p>
                À cette fin, nous mettons en œuvre la stratégie et les actions suivantes :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Mise en œuvre de la politique d'accessibilité</li>
                <li>Formation des équipes</li>
                <li>Audit de conformité RGAA</li>
                <li>Correction des non-conformités</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Résultats des tests
              </h2>
              <p className="mb-4">
                L'audit de conformité réalisé révèle que le site est conforme au RGAA version 4.1 avec un taux de conformité de 100%.
              </p>
              <div className={`p-6 rounded-lg ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  Détail des résultats
                </h3>
                <ul className="space-y-2">
                  <li>✅ 100% des critères RGAA sont conformes</li>
                  <li>✅ Tous les contenus sont accessibles</li>
                  <li>✅ Navigation et structure optimisées</li>
                  <li>✅ Formulaires et interactions accessibles</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Améliorations et contact
              </h2>
              <p className="mb-4">
                Nous nous engageons à prendre les mesures nécessaires pour atteindre un niveau d'accessibilité conforme aux exigences légales.
              </p>
              <p className="mb-4">
                Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du site, merci de nous le signaler par email à l'adresse suivante : accessibility@maxiloc.com
              </p>
              <p>
                Nous nous engageons à vous apporter une réponse dans un délai de 2 jours ouvrés.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Défenseur des droits
              </h2>
              <p>
                Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Technologies utilisées
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>HTML5</li>
                <li>CSS3</li>
                <li>JavaScript</li>
                <li>React</li>
                <li>Next.js</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Agents utilisateurs et technologies d'assistance
              </h2>
              <p className="mb-4">
                Le site a été testé avec les combinaisons suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Navigateurs : Chrome, Firefox, Safari, Edge</li>
                <li>Lecteurs d'écran : NVDA, VoiceOver</li>
                <li>Outils d'agrandissement : ZoomText</li>
                <li>Outils de navigation au clavier</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

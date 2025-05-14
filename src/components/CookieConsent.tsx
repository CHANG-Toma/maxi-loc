import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CookieConsentProps {
  isDarkMode: boolean;
}

// Composant pour afficher la politique de cookies
export function CookieConsent({ isDarkMode }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  // On affiche le composant si l'utilisateur n'a pas encore accepté les cookies
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  // On accepte les cookies
  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  // On refuse les cookies
  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setIsVisible(false);
  };

  // On affiche le composant CookieConsent
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          } shadow-lg border-t ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  Politique de cookies
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site.
                  En continuant à naviguer, vous acceptez notre utilisation des cookies.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  className={`${
                    isDarkMode
                      ? "text-gray-400 hover:text-white border-gray-700"
                      : "text-gray-600 hover:text-gray-900 border-gray-300"
                  }`}
                >
                  Refuser
                </Button>
                <Button
                  onClick={handleAccept}
                  className="bg-primary hover:bg-primary/90"
                >
                  Accepter
                </Button>
              </div>
              <button
                onClick={handleDecline}
                className={`absolute top-4 right-4 p-1 rounded-full ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
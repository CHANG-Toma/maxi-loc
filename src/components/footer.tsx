import Link from "next/link";

interface FooterProps {
  isDarkMode: boolean;
}

export function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`relative py-12 ${isDarkMode ? "bg-black/50" : "bg-white/70"} backdrop-blur-xl`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Maxiloc
            </h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
              Votre partenaire de confiance pour la gestion locative intelligente.
            </p>
          </div>

          {/* Contact */}
          <div className="">
            <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Contact
            </h4>
            <ul className="space-y-2">
              <li className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Email: contact@maxiloc.com
              </li>
              <li className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Tél: +33 1 23 45 67 89
              </li>
            </ul>
          </div>
        </div>

        {/* Mentions légales et accessibilité */}
        <div className={`mt-12 pt-8 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/legal/mentions-legales" className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                Mentions légales
              </Link>
              <Link href="/legal/politique-confidentialite" className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                Politique de confidentialité
              </Link>
              <Link href="/legal/cgu" className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                CGU
              </Link>
            </div>
            <div className="flex justify-center md:justify-end">
              <Link href="/legal/accessibilite" className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                Accessibilité : conforme
              </Link>
            </div>
          </div>
          <p className={`text-center mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            © {new Date().getFullYear()} Maxiloc. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
} 
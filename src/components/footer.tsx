"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { NavigationService } from "@/services/navigationService";

const Footer = () => {
  const currentYear = NavigationService.getCurrentYear();
  const footerLinks = NavigationService.getFooterLinks();
  const socialLinks = NavigationService.getSocialLinks();

  // Définition des styles pour l'animation
  const styles = `
    .highlight-section {
      animation: pulse-highlight 1.5s ease-out;
    }

    @keyframes pulse-highlight {
      0% {
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4);
      }
      50% {
        box-shadow: 0 0 0 20px rgba(56, 189, 248, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
      }
    }
  `;

  useEffect(() => {
    // Injecter les styles dans le document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      // Nettoyer les styles à la destruction du composant
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <footer className="relative mt-20 border-primary/10 bg-black/90 backdrop-blur-xl">
      {/* Effet de grille futuriste */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px)] bg-[size:30px] bg-[position:center] opacity-20" />
      
      <div className="container mx-auto px-4 py-12">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text"
            >
              Logo ici
            </motion.div>
            <p className="text-gray-400 text-sm">
              Propulsez votre gestion locative vers le futur avec notre plateforme innovante.
            </p>
          </div>

          {/* Liens */}
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="text-white font-semibold">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name} className="relative w-full z-10">
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                      onClick={(e) => NavigationService.handleInternalLink(e, link.href)}
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Barre sociale */}
        <div className="mt-12 pt-8 border-t border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-4">
              {socialLinks.map(({ icon, href, label }) => {
                const Icon = icon === 'Facebook' ? Facebook :
                           icon === 'Twitter' ? Twitter :
                           icon === 'Instagram' ? Instagram :
                           Mail;
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group p-2 hover:scale-110"
                    onClick={(e) => NavigationService.handleInternalLink(e, href)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{label}</span>
                  </a>
                );
              })}
            </div>
            <p className="text-gray-400 text-sm">
              © {currentYear} MaxiLoc. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

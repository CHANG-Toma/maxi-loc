"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, ExternalLink } from "lucide-react";
import { Button } from "./button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Légal",
      links: [
        { name: "Mentions Légales", href: "/legal/mentions-legales" },
        { name: "Politique de Confidentialité", href: "/legal/privacy" },
        { name: "Politique des Cookies", href: "/legal/cookies" },
        { name: "Conformité RGPD", href: "/legal/rgpd" },
        { name: "Déclaration CNIL", href: "/legal/cnil" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { name: "À Propos", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Blog", href: "/blog" },
        { name: "Carrières", href: "/careers" },
      ],
    },
  ];

  const socialLinks = [
    { Icon: Facebook, href: "#", label: "Facebook" },
    { Icon: Twitter, href: "#", label: "Twitter" },
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Mail, href: "mailto:toma11chang@gmail.com", label: "Email" },
  ];

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
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-1 group"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Newsletter</h3>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="bg-white/5 border border-primary/10 rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10"
              >
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Barre sociale */}
        <div className="mt-12 pt-8 border-t border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{label}</span>
                </motion.a>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              © {currentYear} VotreEntreprise. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>

      {/* Effet de lueur */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
};

export default Footer;

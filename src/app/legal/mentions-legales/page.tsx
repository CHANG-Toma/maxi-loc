"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MentionsLegales() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8 text-gray-400 hover:text-white cursor-pointer"
          >
            ← Retour
          </Button>
        </motion.div>

        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">
            Mentions Légales
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400">
              [Votre contenu des mentions légales ici]
            </p>
            
            {/* Ajoutez plus de contenu selon vos besoins */}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
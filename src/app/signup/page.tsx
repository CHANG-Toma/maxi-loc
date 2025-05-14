"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { createUtilisateur } from "../../lib/utilisateur";
import { Checkbox } from "../../components/ui/checkbox";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [cguAccepted, setCguAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    if (!cguAccepted) {
      setMessage("Vous devez accepter les CGU pour continuer");
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await createUtilisateur({
        email: formData.email,
        mot_de_passe: formData.password,
        nom: formData.lastName,
        prenom: formData.firstName,
        telephone: formData.phone
      });

      // Si l'insertion est réussi alors on renvoie ou pas le bon chemin
      if (result.success) {
        setMessage('Utilisateur créé avec succès ! 🎉');
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phone: ""
        });
        router.push("/login");
      } else {
        if (result.details) {
          // Gestion des erreurs de validation
          const validationErrors: Record<string, string> = {};
          result.details.forEach((error: any) => {
            const field = error.path[0];
            validationErrors[field] = error.message;
          });
          setErrors(validationErrors);
        } else {
          setMessage(result.error || 'Erreur lors de la création.');
        }
      }
    } catch (error) {
      setMessage('Une erreur est survenue lors de la création du compte.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ quand l'utilisateur modifie sa valeur
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Créer un compte
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {message && (
              <div className={`p-3 rounded-md ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prénom
                </label>
                <div className="mt-1">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`bg-white ${errors.prenom ? 'border-red-500' : ''}`}
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom
                </label>
                <div className="mt-1">
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`bg-white ${errors.nom ? 'border-red-500' : ''}`}
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-white ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Téléphone
              </label>
              <div className="mt-1">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`bg-white ${errors.telephone ? 'border-red-500' : ''}`}
                />
                {errors.telephone && (
                  <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-white ${errors.mot_de_passe ? 'border-red-500' : ''}`}
                />
                {errors.mot_de_passe && (
                  <p className="mt-1 text-sm text-red-600">{errors.mot_de_passe}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="cgu"
                checked={cguAccepted}
                onCheckedChange={(checked) => setCguAccepted(checked as boolean)}
                className="border-gray-400 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 hover:border-gray-900"
              />
              <label
                htmlFor="cgu"
                className="text-sm text-gray-900"
              >
                En cochant cette case vous acceptez nos CGU
              </label>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Création en cours...' : "S'inscrire"}
              </Button>
            </div>

          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Déjà un compte ?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

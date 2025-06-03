"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { login } from "../../lib/auth";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null); // Référence pour le reCAPTCHA
  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
  });
  // État pour la visibilité du mot de passe
  const [showPassword, setShowPassword] = useState(false);
  // État pour le message d'erreur
  const [message, setMessage] = useState("");
  // État pour les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  // État pour le chargement
  const [isLoading, setIsLoading] = useState(false);
  // État pour l'acceptation des CGU
  const [cguAccepted, setCguAccepted] = useState(false);

  // État pour le nombre de tentatives
  const [loginAttempts, setLoginAttempts] = useState(0);
  // État pour le blocage du compte
  const [isBlocked, setIsBlocked] = useState(false);
  // État pour le temps de blocage
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  // État pour le reCAPTCHA token
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  // Max 5 tentatives si non c'est bloqué pour 15 minutes :)
  const MAX_ATTEMPTS = 5;
  const BLOCK_DURATION = 15 * 60; // 15 minutes en secondes

  useEffect(() => {
    // Récupérer les tentatives stockées
    const storedAttempts = localStorage.getItem('loginAttempts');
    const lastAttemptTime = localStorage.getItem('lastAttemptTime');
    
    if (storedAttempts) {
      // Récupérer les tentatives stockées
      setLoginAttempts(parseInt(storedAttempts));
    }
    
    // Si le temps de blocage est écoulé
    if (lastAttemptTime) {
      const timeSinceLastAttempt = Math.floor((Date.now() - parseInt(lastAttemptTime)) / 1000);
      if (timeSinceLastAttempt < BLOCK_DURATION) {
        setIsBlocked(true);
        setBlockTimeRemaining(BLOCK_DURATION - timeSinceLastAttempt);
      } else {
        // Réinitialiser si le temps de blocage est écoulé
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastAttemptTime');
        setLoginAttempts(0);
        setIsBlocked(false);
      }
    }
  }, []);

  // Gestion du blocage du compte si trop de tentatives
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked && blockTimeRemaining > 0) {
      timer = setInterval(() => {
        // Décrémenter le temps de blocage
        setBlockTimeRemaining(prev => {
          // Si le temps de blocage est écoulé
          if (prev <= 1) {
            setIsBlocked(false);
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lastAttemptTime');
            setLoginAttempts(0);
            return 0;
          }
          // Décrémenter le temps de blocage
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBlocked, blockTimeRemaining]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (isBlocked) {
      // Afficher le message d'erreur si le compte est bloqué
      setMessage(`Compte temporairement bloqué. Veuillez réessayer dans ${Math.ceil(blockTimeRemaining / 60)} minutes.`);
      return;
    }

    // Si le reCAPTCHA n'est pas validé alors on affiche le message d'erreur
    if (!recaptchaToken) {
      setMessage("Veuillez valider le reCAPTCHA avant de continuer.");
      return;
    }

    setIsLoading(true);

    // On tente de se connecter avec les informations de l'utilisateur
    try {
      const result = await login({
        ...formData,
        recaptchaToken // On envoie le token du reCAPTCHA
      });

      if (result.success) {
        // Réinitialiser les tentatives en cas de succès
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastAttemptTime');
        setLoginAttempts(0);
        setMessage("Connexion réussie !");
        router.push("/dashboard");
      } else {
        // Incrémenter le nombre de tentatives
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());
        localStorage.setItem('lastAttemptTime', Date.now().toString());

        // Gestion des erreurs de validation
        if (newAttempts >= MAX_ATTEMPTS) {
          setIsBlocked(true);
          setBlockTimeRemaining(BLOCK_DURATION);
          setMessage(`Trop de tentatives échouées. Compte bloqué pour ${BLOCK_DURATION / 60} minutes.`);
        } else {
          // Si il y a des erreurs de validation
          if (result.details) {
            const validationErrors: Record<string, string> = {};

            // Ajouter les erreurs de validation dans le tableau d'erreurs pour pouvoir les afficher
            result.details.forEach((error: any) => {
              const field = error.path[0];
              validationErrors[field] = error.message;
            });
            setErrors(validationErrors);
          } else {
            // Si il n'y a pas d'erreurs de validation et que le compte n'est pas bloqué alors on affiche le message d'erreur
            setMessage(result.error || `Erreur lors de la connexion. Il vous reste ${MAX_ATTEMPTS - newAttempts} tentative(s).`);
          }
        }
      }
    } catch (error) {
      setMessage("Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
      // Réinitialiser le reCAPTCHA après chaque tentative
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ quand l'utilisateur modifie sa valeur
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gestion du changement du reCAPTCHA pour pouvoir valider la connexion
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
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
          Connexion
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
              <div
                className={`p-3 rounded-md ${
                  message.includes("réussie")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

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
                  className={`bg-white ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="mot_de_passe"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <Input
                  id="mot_de_passe"
                  name="mot_de_passe"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  className={`bg-white ${
                    errors.mot_de_passe ? "border-red-500" : ""
                  }`}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </div>
                {errors.mot_de_passe && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mot_de_passe}
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  href="/forgotpassword"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            {/* On affiche le reCAPTCHA pour pouvoir valider la connexion */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                onChange={handleRecaptchaChange}
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading || !recaptchaToken}
                className={`w-full bg-secondary text-gray-900 hover:bg-secondary/90 border border-gray-300 ${
                  (isLoading || !recaptchaToken) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
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
                  Pas encore de compte ?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                onClick={() => router.push("/signup")}
                className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Créer un compte
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

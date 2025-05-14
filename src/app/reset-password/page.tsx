"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { resetPassword } from "../../lib/auth";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Regex pour valider le mot de passe pour la réinitialisation du mot de passe et etre en accord avec l'owasp
  const validatePassword = (pass: string): string[] => {
    const errors: string[] = [];
    if (pass.length < 12) { // Minimum 12 caractères
      errors.push("Le mot de passe doit contenir au moins 12 caractères");
    }
    if (!/[A-Z]/.test(pass)) { // Au moins une majuscule
      errors.push("Le mot de passe doit contenir au moins une majuscule");
    }
    if (!/[a-z]/.test(pass)) { // Au moins une minuscule
      errors.push("Le mot de passe doit contenir au moins une minuscule");
    }
    if (!/[0-9]/.test(pass)) { // Au moins un chiffre
      errors.push("Le mot de passe doit contenir au moins un chiffre");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) { // Au moins un caractère spécial
      errors.push("Le mot de passe doit contenir au moins un caractère spécial");
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setValidationErrors([]);

    // Validation du mot de passe
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setValidationErrors(passwordErrors);
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setValidationErrors(["Les mots de passe ne correspondent pas"]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(token, formData.password);
      if (result.success) {
        setMessage("Mot de passe réinitialisé avec succès !");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setMessage(result.error || "Erreur lors de la réinitialisation.");
      }
    } catch {
      setMessage("Erreur lors de la réinitialisation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/login")}
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
          Réinitialisation du mot de passe
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
                  message.includes("succès")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {validationErrors.length > 0 && (
              <div className="p-3 rounded-md bg-red-100 text-red-700">
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nouveau mot de passe
              </label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white text-gray-900 placeholder-gray-500"
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
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmer le mot de passe
              </label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-white text-gray-900 placeholder-gray-500"
                />
                <div
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-secondary text-gray-900 hover:bg-secondary/90 border border-gray-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 
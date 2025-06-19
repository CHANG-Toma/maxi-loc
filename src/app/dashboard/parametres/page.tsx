"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  User,
  Lock,
  Bell,
  Globe,
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  ParametreService,
  ProfileData,
  PasswordData,
  Feedback,
} from "@/services/parametreService";
import { useSession } from "@/components/providers/SessionProvider";

// Force dynamic rendering to prevent prerendering issues with Prisma
export const dynamic = "force-dynamic";

// Fonctionnalités de la page de paramètres :
// - Afficher les informations du profil de l'utilisateur
// - Modifier les informations du profil de l'utilisateur
// - Changer le mot de passe de l'utilisateur
// - Gérer les notifications de l'utilisateur
// - Gérer les préférences de l'utilisateur
// - Gérer la facturation de l'utilisateur


export default function SettingsPage() {
  // useSession pour charger les données de l'utilisateur
  const { user, loading } = useSession();

  // État pour les données du profil
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // État pour suivre les modifications
  const [modifiedFields, setModifiedFields] = useState<Record<string, string>>({});

  // État pour les messages de feedback
  const [feedback, setFeedback] = useState<Feedback>({
    type: null,
    message: "",
  });

  // État pour le formulaire de changement de mot de passe
  const [passwordForm, setPasswordForm] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // État pour le feedback du changement de mot de passe
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>({
    type: null,
    message: "",
  });

  // État pour la visibilité des mots de passe
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // État pour les notifications
  const [notifications, setNotifications] = useState({
    newBookings: true,
    payments: true,
    messages: true,
    systemUpdates: true,
  });

  // Mettre à jour le profil avec les données de l'utilisateur une fois chargées
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.prenom || "",
        lastName: user.nom || "",
        email: user.email || "",
        phone: user.telephone || "",
      });
    }
  }, [user]);

  if (loading) return <div>Chargement...</div>;
  if (!user) return <div>Session invalide, veuillez vous reconnecter</div>;

  // Fonction pour mettre à jour un champ
  const handleFieldChange = (field: string, value: string) => {
    setModifiedFields((prev) => ({ ...prev, [field]: value }));
    setFeedback({ type: null, message: "" });
  };

  // Fonction pour sauvegarder toutes les modifications
  const handleSave = async () => {
    try {
      const result = await ParametreService.updateProfile(modifiedFields);
      if (result.success) {
        setProfile((prev) => ({ ...prev, ...modifiedFields }));
        setModifiedFields({});
        setFeedback({
          type: "success",
          message: result.message || "Votre profil a été mis à jour avec succès",
        });
      } else {
        // Afficher le message d'erreur
        setFeedback({
          type: "error",
          message: result.error || "Une erreur est survenue lors de la sauvegarde",
        });
      }
    } 
    // Afficher le message d'erreur
    catch (error) {
      console.error("Erreur lors de la sauvegarde du profil:", error);
      setFeedback({
        type: "error",
        message: "Une erreur inattendue est survenue. Veuillez réessayer.",
      });
    }
  };

  // Handle switch toggle
  const handleSwitchToggle = (name: string) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
  };

  // Fonction pour basculer la visibilité d'un mot de passe
  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Fonction pour gérer le changement de mot de passe
  const handlePasswordChange = async () => {
    try {
      const result = await ParametreService.updatePassword(passwordForm);

      if (result.success) {
        setPasswordFeedback({
          type: "success",
          message:
            result.message || "Votre mot de passe a été mis à jour avec succès",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordFeedback({
          type: "error",
          message:
            result.error ||
            "Une erreur est survenue lors de la mise à jour du mot de passe",
        });
      }
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      setPasswordFeedback({
        type: "error",
        message: "Une erreur inattendue est survenue. Veuillez réessayer.",
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const feedbackVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="container mx-auto px-4 py-8 max-w-5xl"
    >
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <div className="h-8 w-[2px] bg-gray-300"></div>
        <p className="text-gray-600">
          Gérez vos préférences et informations personnelles
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-gray-900 p-1 rounded-lg border border-gray-700 shadow-sm">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 mr-2" />
            Préférences
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Facturation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Informations personnelles
                </h2>
                <p className="text-gray-400 mt-1">
                  Modifiez vos informations de profil
                </p>
              </div>
              <Button
                onClick={handleSave}
                className="bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                disabled={Object.keys(modifiedFields).length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {feedback.type && (
                <motion.div
                  variants={feedbackVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                    feedback.type === "success"
                      ? "bg-green-900/50 text-green-300 border border-green-700"
                      : "bg-red-900/50 text-red-300 border border-red-700"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  {feedback.message}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Prénom
                </label>
                <Input
                  type="text"
                  value={modifiedFields.firstName || profile.firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                  className="w-full bg-white text-gray-900 transition-all border-gray-200 focus:ring-2 focus:ring-primary/20"
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Nom
                </label>
                <Input
                  type="text"
                  value={modifiedFields.lastName || profile.lastName}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value)
                  }
                  className="w-full bg-white text-gray-900 transition-all border-gray-200 focus:ring-2 focus:ring-primary/20"
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <Input
                  type="email"
                  value={modifiedFields.email || profile.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="w-full bg-white text-gray-900 transition-all border-gray-200 focus:ring-2 focus:ring-primary/20"
                  placeholder="votre.email@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Téléphone
                </label>
                <Input
                  type="tel"
                  value={modifiedFields.phone || profile.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  className="w-full bg-white text-gray-900 transition-all border-gray-200 focus:ring-2 focus:ring-primary/20"
                  placeholder="06 XX XX XX XX"
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Sécurité du compte
                </h2>
                <p className="text-gray-400 mt-1">
                  Gérez votre mot de passe et la sécurité de votre compte
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {passwordFeedback.type && (
                <motion.div
                  variants={feedbackVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                    passwordFeedback.type === "success"
                      ? "bg-green-900/50 text-green-300 border border-green-700"
                      : "bg-red-900/50 text-red-300 border border-red-700"
                  }`}
                >
                  {passwordFeedback.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  {passwordFeedback.message}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <Input
                    type={
                      passwordVisibility.currentPassword ? "text" : "password"
                    }
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full pr-10 bg-white text-gray-900 transition-all border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("currentPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {passwordVisibility.currentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Input
                    type={passwordVisibility.newPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full pr-10 bg-white text-gray-900 transition-all border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {passwordVisibility.newPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <Input
                    type={
                      passwordVisibility.confirmPassword ? "text" : "password"
                    }
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pr-10 bg-white text-gray-900 transition-all border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {passwordVisibility.confirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={handlePasswordChange}
                className="w-full bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                disabled={
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmPassword
                }
              >
                Mettre à jour le mot de passe
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Notifications
                </h2>
                <p className="text-gray-400 mt-1">
                  Gérez vos préférences de notification
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all group cursor-pointer">
                <div className="space-y-1">
                  <h3 className="font-medium text-white group-hover:text-primary transition-colors">
                    Nouvelles réservations
                  </h3>
                  <p className="text-sm text-gray-400">
                    Recevoir des notifications pour les nouvelles réservations
                  </p>
                </div>
                <div className="relative">
                  <Switch
                    checked={notifications.newBookings}
                    onCheckedChange={() => handleSwitchToggle("newBookings")}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600 h-6 w-11 cursor-pointer"
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                    {notifications.newBookings ? "Activé" : "Désactivé"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all group cursor-pointer">
                <div className="space-y-1">
                  <h3 className="font-medium text-white group-hover:text-primary transition-colors">
                    Paiements
                  </h3>
                  <p className="text-sm text-gray-400">
                    Recevoir des notifications pour les paiements
                  </p>
                </div>
                <div className="relative">
                  <Switch
                    checked={notifications.payments}
                    onCheckedChange={() => handleSwitchToggle("payments")}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600 h-6 w-11 cursor-pointer"
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                    {notifications.payments ? "Activé" : "Désactivé"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all group cursor-pointer">
                <div className="space-y-1">
                  <h3 className="font-medium text-white group-hover:text-primary transition-colors">
                    Messages
                  </h3>
                  <p className="text-sm text-gray-400">
                    Recevoir des notifications pour les nouveaux messages
                  </p>
                </div>
                <div className="relative">
                  <Switch
                    checked={notifications.messages}
                    onCheckedChange={() => handleSwitchToggle("messages")}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600 h-6 w-11 cursor-pointer"
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                    {notifications.messages ? "Activé" : "Désactivé"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all group cursor-pointer">
                <div className="space-y-1">
                  <h3 className="font-medium text-white group-hover:text-primary transition-colors">
                    Mises à jour système
                  </h3>
                  <p className="text-sm text-gray-400">
                    Recevoir des notifications pour les mises à jour système
                  </p>
                </div>
                <div className="relative">
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={() => handleSwitchToggle("systemUpdates")}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600 h-6 w-11 cursor-pointer"
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                    {notifications.systemUpdates ? "Activé" : "Désactivé"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="preferences">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Préférences
                </h2>
                <p className="text-gray-400 mt-1">
                  Personnalisez votre expérience
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center h-40 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
              <p className="text-gray-500">
                Cette section est en cours de développement
              </p>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="billing">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Facturation
                </h2>
                <p className="text-gray-400 mt-1">
                  Gérez vos informations de paiement
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center h-40 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
              <p className="text-gray-500">
                Cette section est en cours de développement
              </p>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

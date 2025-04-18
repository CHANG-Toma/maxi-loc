"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, User, Lock, Bell, Globe, CreditCard, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import DashboardLayout from "../layout";
import { ParametreService, ProfileData, PasswordData, Feedback } from "@/services/parametreService";

// Fonction utilitaire pour récupérer un cookie
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export default function SettingsPage() {
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
  const [feedback, setFeedback] = useState<Feedback>({ type: null, message: "" });

  // État pour le formulaire de changement de mot de passe
  const [passwordForm, setPasswordForm] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // État pour le feedback du changement de mot de passe
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>({ type: null, message: "" });

  // État pour suivre si l'utilisateur est connecté
  const [isLoading, setIsLoading] = useState(true);

  // État pour la visibilité des mots de passe
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Charger les données de l'utilisateur au montage du composant
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const sessionToken = getCookie("session");
        const result = await ParametreService.loadUserData(sessionToken);
        
        if (result.success && result.profile) {
          setProfile(result.profile);
        } else {
          setFeedback({
            type: "error",
            message: result.error || "Erreur lors du chargement des données"
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        setFeedback({
          type: "error",
          message: "Erreur lors du chargement de vos données. Veuillez rafraîchir la page."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Fonction pour mettre à jour un champ
  const handleFieldChange = (field: string, value: string) => {
    setModifiedFields(prev => ({ ...prev, [field]: value }));
    setFeedback({ type: null, message: "" });
  };

  // Fonction pour sauvegarder toutes les modifications
  const handleSave = async () => {
    try {
      const result = await ParametreService.updateProfile(modifiedFields);

      if (result.success) {
        setProfile(prev => ({ ...prev, ...modifiedFields }));
        setModifiedFields({});
        setFeedback({
          type: "success",
          message: result.message || "Votre profil a été mis à jour avec succès"
        });
      } else {
        setFeedback({
          type: "error",
          message: result.error || "Une erreur est survenue lors de la sauvegarde"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setFeedback({
        type: "error",
        message: "Une erreur inattendue est survenue. Veuillez réessayer."
      });
    }
  };

  // Add state for switch values
  const [notifications, setNotifications] = useState({
    newBookings: true,
    payments: true,
    messages: true,
    systemUpdates: true
  });

  // Handle switch toggle
  const handleSwitchToggle = (name: string) => {
    setNotifications(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  // Fonction pour basculer la visibilité d'un mot de passe
  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Fonction pour gérer le changement de mot de passe
  const handlePasswordChange = async () => {
    try {
      const result = await ParametreService.updatePassword(passwordForm);

      if (result.success) {
        setPasswordFeedback({
          type: "success",
          message: result.message || "Votre mot de passe a été mis à jour avec succès"
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setPasswordFeedback({
          type: "error",
          message: result.error || "Une erreur est survenue lors de la mise à jour du mot de passe"
        });
      }
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      setPasswordFeedback({
        type: "error",
        message: "Une erreur inattendue est survenue. Veuillez réessayer."
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Globe className="w-4 h-4 mr-2" />
              Préférences
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Facturation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
              
              {feedback.type && (
                <div className={`mb-4 p-4 rounded ${
                  feedback.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}>
                  {feedback.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Prénom
                  </label>
                  <Input
                    type="text"
                    value={modifiedFields.firstName || profile.firstName}
                    onChange={(e) => handleFieldChange("firstName", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nom
                  </label>
                  <Input
                    type="text"
                    value={modifiedFields.lastName || profile.lastName}
                    onChange={(e) => handleFieldChange("lastName", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={modifiedFields.email || profile.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Téléphone
                  </label>
                  <Input
                    type="tel"
                    value={modifiedFields.phone || profile.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} className="bg-primary text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>
              
              {passwordFeedback.type && (
                <div className={`mb-4 p-4 rounded ${
                  passwordFeedback.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}>
                  {passwordFeedback.message}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <Input
                      type={passwordVisibility.currentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("currentPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordVisibility.currentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={passwordVisibility.newPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordVisibility.newPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={passwordVisibility.confirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordVisibility.confirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={handlePasswordChange} className="bg-primary text-white">
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Préférences de notification</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Nouvelles réservations</h3>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour les nouvelles réservations</p>
                  </div>
                  <Switch
                    checked={notifications.newBookings}
                    onCheckedChange={() => handleSwitchToggle("newBookings")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Paiements</h3>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour les paiements</p>
                  </div>
                  <Switch
                    checked={notifications.payments}
                    onCheckedChange={() => handleSwitchToggle("payments")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Messages</h3>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour les nouveaux messages</p>
                  </div>
                  <Switch
                    checked={notifications.messages}
                    onCheckedChange={() => handleSwitchToggle("messages")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Mises à jour système</h3>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour les mises à jour système</p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={() => handleSwitchToggle("systemUpdates")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Préférences générales</h2>
              <p className="text-gray-500">Cette section est en cours de développement.</p>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Informations de facturation</h2>
              <p className="text-gray-500">Cette section est en cours de développement.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

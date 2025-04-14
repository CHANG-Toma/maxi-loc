"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, User, Lock, Bell, Globe, CreditCard, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import Dashboard from "../page";
import { updateProfile, updatePassword } from "@/lib/utilisateur";
import { validateSession } from "@/lib/session";

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
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // État pour suivre les modifications
  const [modifiedFields, setModifiedFields] = useState<Record<string, string>>({});

  // État pour les messages de feedback
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // État pour le formulaire de changement de mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // État pour le feedback du changement de mot de passe
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

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
        
        if (!sessionToken) {
          setIsLoading(false);
          return;
        }

        const user = await validateSession(sessionToken);
        if (!user) {
          setIsLoading(false);
          return;
        }

        setProfile({
          firstName: user.prenom,
          lastName: user.nom,
          email: user.email,
          phone: user.telephone || "",
        });
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
    // Réinitialiser le feedback quand l'utilisateur modifie un champ
    setFeedback({ type: null, message: "" });
  };

  // Fonction pour sauvegarder toutes les modifications
  const handleSave = async () => {
    try {
      // Ne garder que les champs qui ont été modifiés
      const modifiedData: Record<string, string> = {};
      Object.entries(modifiedFields).forEach(([key, value]) => {
        if (value !== profile[key as keyof typeof profile]) {
          modifiedData[key] = value;
        }
      });

      // Si aucun champ n'a été modifié, ne rien faire
      if (Object.keys(modifiedData).length === 0) {
        setFeedback({
          type: "error",
          message: "Aucune modification n'a été effectuée"
        });
        return;
      }

      // Mapper les noms de champs du frontend vers le backend
      const mappedData = {
        prenom: modifiedData.firstName,
        nom: modifiedData.lastName,
        email: modifiedData.email,
        telephone: modifiedData.phone
      };

      const result = await updateProfile("current", mappedData);

      if (result.success) {
        // Mettre à jour le profil avec les nouvelles valeurs
        setProfile(prev => ({ ...prev, ...modifiedData }));
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
      // Vérifier que les mots de passe correspondent
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordFeedback({
          type: "error",
          message: "Les mots de passe ne correspondent pas"
        });
        return;
      }

      // Vérifier que le nouveau mot de passe est différent de l'ancien
      if (passwordForm.newPassword === passwordForm.currentPassword) {
        setPasswordFeedback({
          type: "error",
          message: "Le nouveau mot de passe doit être différent de l'ancien"
        });
        return;
      }

      const result = await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );

      if (result.success) {
        setPasswordFeedback({
          type: "success",
          message: result.message || "Votre mot de passe a été mis à jour avec succès"
        });
        // Réinitialiser le formulaire
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
      <Dashboard>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px] text-gray-900">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> Sécurité
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Facturation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="space-y-6">
                {/* Message de feedback */}
                {feedback.type && (
                  <div className={`p-4 rounded-lg ${
                    feedback.type === "success" 
                      ? "bg-green-50 text-green-800" 
                      : "bg-red-50 text-red-800"
                  }`}>
                    {feedback.message}
                  </div>
                )}

                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="w-full sm:w-1/2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
                      Prénom
                    </label>
                    <Input
                      id="firstName"
                      value={modifiedFields.firstName !== undefined ? modifiedFields.firstName : profile.firstName}
                      onChange={(e) => handleFieldChange('firstName', e.target.value)}
                      className="text-gray-900 bg-white"
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
                      Nom
                    </label>
                    <Input
                      id="lastName"
                      value={modifiedFields.lastName !== undefined ? modifiedFields.lastName : profile.lastName}
                      onChange={(e) => handleFieldChange('lastName', e.target.value)}
                      className="text-gray-900 bg-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={modifiedFields.email !== undefined ? modifiedFields.email : profile.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="text-gray-900 bg-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                    Téléphone
                  </label>
                  <Input
                    id="phone"
                    value={modifiedFields.phone !== undefined ? modifiedFields.phone : profile.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className="text-gray-900 bg-white"
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleSave}
                    className="bg-primary text-gray-900 border hover:bg-primary/90 cursor-pointer"
                    disabled={Object.keys(modifiedFields).length === 0}
                  >
                    <Save className="w-4 h-4 mr-2" /> Enregistrer les modifications
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="security">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="space-y-6">
                {/* Message de feedback pour le mot de passe */}
                {passwordFeedback.type && (
                  <div className={`p-4 rounded-lg ${
                    passwordFeedback.type === "success" 
                      ? "bg-green-50 text-green-800" 
                      : "bg-red-50 text-red-800"
                  }`}>
                    {passwordFeedback.message}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-900 mb-1">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={passwordVisibility.currentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="text-gray-900 bg-white pr-10"
                      />
                      <button 
                        type="button"
                        onClick={() => togglePasswordVisibility('currentPassword')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                      >
                        {passwordVisibility.currentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-1">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={passwordVisibility.newPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="text-gray-900 bg-white pr-10"
                      />
                      <button 
                        type="button"
                        onClick={() => togglePasswordVisibility('newPassword')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                      >
                        {passwordVisibility.newPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-1">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={passwordVisibility.confirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="text-gray-900 bg-white pr-10"
                      />
                      <button 
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                      >
                        {passwordVisibility.confirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handlePasswordChange}
                      className="bg-primary text-gray-900 border hover:bg-primary/90 cursor-pointer"
                      disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    >
                      <Save className="w-4 h-4 mr-2" /> Mettre à jour le mot de passe
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Nouvelles réservations</h3>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour les nouvelles réservations</p>
                  </div>
                  <Switch 
                    checked={notifications.newBookings}
                    onCheckedChange={() => handleSwitchToggle('newBookings')}
                    className="bg-gray-200 data-[state=checked]:bg-green-500 transition-colors duration-200"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Paiements</h3>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour les nouveaux paiements</p>
                  </div>
                  <Switch 
                    checked={notifications.payments}
                    onCheckedChange={() => handleSwitchToggle('payments')}
                    className="bg-gray-200 data-[state=checked]:bg-green-500 transition-colors duration-200"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Messages</h3>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour les nouveaux messages</p>
                  </div>
                  <Switch 
                    checked={notifications.messages}
                    onCheckedChange={() => handleSwitchToggle('messages')}
                    className="bg-gray-200 data-[state=checked]:bg-green-500 transition-colors duration-200"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Mises à jour du système</h3>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour les mises à jour du système</p>
                  </div>
                  <Switch 
                    checked={notifications.systemUpdates}
                    onCheckedChange={() => handleSwitchToggle('systemUpdates')}
                    className="bg-gray-200 data-[state=checked]:bg-green-500 transition-colors duration-200"
                  />
                </div>
                
                <div className="pt-4">
                  <Button className="bg-primary text-gray-900 border hover:bg-primary/90 cursor-pointer">
                    <Save className="w-4 h-4 mr-2" /> Enregistrer les préférences
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="billing">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Plan actuel</h3>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">Plan Professionnel</p>
                        <p className="text-sm text-gray-500">49€ / mois</p>
                      </div>
                      <Button variant="outline">Changer de plan</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Méthode de paiement</h3>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                        <p className="text-sm text-gray-900">Visa se terminant par 4242</p>
                      </div>
                      <Button variant="outline">Modifier</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Historique de facturation</h3>
                  <div className="mt-2">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              01 Mars 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              49€
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Payé
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" className="text-gray-900 hover:text-gray-900/80">
                                Télécharger
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              01 Février 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              49€
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Payé
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" className="text-gray-900 hover:text-gray-900/80">
                                Télécharger
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
}

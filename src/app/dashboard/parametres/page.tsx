"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, User, Lock, Bell, Globe, CreditCard, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import Dashboard from "../page";

export default function SettingsPage() {
  // Récupérer les données du profil de l'utilisateur de la base de données ici
  const [profile, setProfile] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
  });

  // Fonction pour mettre à jour le profil de l'utilisateur
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
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

  // Ajoutez un état pour la visibilité des mots de passe
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Fonction pour basculer la visibilité d'un champ de mot de passe
  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

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
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="w-full sm:w-1/2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
                      Prénom
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      className="text-gray-900 bg-white"
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
                      Nom
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
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
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="text-gray-900 bg-white"
                  />
                </div>
                
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                    Téléphone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="text-gray-900 bg-white"
                  />
                </div>
                
                <div className="pt-4">
                  <Button className="bg-primary text-gray-900 border hover:bg-primary/90 cursor-pointer">
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
                <div className="relative">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-900 mb-1">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={passwordVisibility.currentPassword ? "text" : "password"}
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
                
                <div className="relative">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={passwordVisibility.newPassword ? "text" : "password"}
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
                
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={passwordVisibility.confirmPassword ? "text" : "password"}
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
                  <Button className="bg-primary text-gray-900 border hover:bg-primary/90 cursor-pointer">
                    <Save className="w-4 h-4 mr-2" /> Mettre à jour le mot de passe
                  </Button>
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

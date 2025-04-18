import { updateProfile, updatePassword } from "@/lib/utilisateur";
import { validateSession } from "@/lib/session";

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Feedback {
  type: "success" | "error" | null;
  message: string;
}

export class ParametreService {
  static async loadUserData(sessionToken: string | undefined): Promise<{
    success: boolean;
    profile?: ProfileData;
    error?: string;
    message?: string;
  }> {
    try {
      if (!sessionToken) {
        return {
          success: false,
          error: "Session invalide"
        };
      }

      const user = await validateSession(sessionToken);
      if (!user) {
        return {
          success: false,
          error: "Session expirée"
        };
      }

      return {
        success: true,
        profile: {
          firstName: user.prenom,
          lastName: user.nom,
          email: user.email,
          phone: user.telephone || ""
        },
        message: "Données utilisateur chargées avec succès"
      };
    } catch (error) {
      console.error("Erreur lors du chargement des données utilisateur:", error);
      return {
        success: false,
        error: "Erreur lors du chargement des données utilisateur"
      };
    }
  }

  static async updateProfile(modifiedData: Record<string, string>): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      // Ne garder que les champs qui ont été modifiés
      const dataToUpdate: Record<string, string> = {};
      Object.entries(modifiedData).forEach(([key, value]) => {
        if (value) {
          dataToUpdate[key] = value;
        }
      });

      // Si aucun champ n'a été modifié, ne rien faire
      if (Object.keys(dataToUpdate).length === 0) {
        return {
          success: false,
          error: "Aucune modification n'a été effectuée"
        };
      }

      // Mapper les noms de champs du frontend vers le backend
      const mappedData = {
        prenom: dataToUpdate.firstName,
        nom: dataToUpdate.lastName,
        email: dataToUpdate.email,
        telephone: dataToUpdate.phone
      };

      const result = await updateProfile("current", mappedData);

      if (result.success) {
        return {
          success: true,
          message: "Profil mis à jour avec succès"
        };
      } else {
        return {
          success: false,
          error: result.error || "Erreur lors de la mise à jour du profil"
        };
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      return {
        success: false,
        error: "Erreur lors de la mise à jour du profil"
      };
    }
  }

  static async updatePassword(passwordData: PasswordData): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      // Vérifier que les mots de passe correspondent
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return {
          success: false,
          error: "Les mots de passe ne correspondent pas"
        };
      }

      // Vérifier que le nouveau mot de passe est différent de l'ancien
      if (passwordData.newPassword === passwordData.currentPassword) {
        return {
          success: false,
          error: "Le nouveau mot de passe doit être différent de l'ancien"
        };
      }

      const result = await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );

      if (result.success) {
        return {
          success: true,
          message: "Mot de passe mis à jour avec succès"
        };
      } else {
        return {
          success: false,
          error: result.error || "Erreur lors de la mise à jour du mot de passe"
        };
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      return {
        success: false,
        error: "Erreur lors de la mise à jour du mot de passe"
      };
    }
  }
} 
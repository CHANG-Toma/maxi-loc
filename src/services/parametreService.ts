import { getParametres, updateParametre } from "@/lib/parametre";

export interface Parametre {
  id_parametre: number;
  cle: string;
  valeur: string;
  description: string;
}

export interface ParametreFormData {
  cle: string;
  valeur: string;
  description: string;
}

export class ParametreService {
  static async loadParametres() {
    try {
      const result = await getParametres();
      
      if (result.success && result.parametres) {
        return { success: true, parametres: result.parametres };
      } else {
        return { success: false, error: result.error || "Erreur lors du chargement des paramètres" };
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
      return { success: false, error: "Une erreur est survenue lors du chargement des paramètres" };
    }
  }

  static async handleUpdate(id: number, formData: ParametreFormData) {
    try {
      const result = await updateParametre(id, formData);
      
      if (result.success) {
        return { 
          success: true, 
          message: "Paramètre mis à jour avec succès",
          parametre: result.parametre
        };
      } else {
        return { 
          success: false, 
          error: result.error || "Erreur lors de la mise à jour du paramètre"
        };
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paramètre:", error);
      return { 
        success: false, 
        error: "Une erreur est survenue lors de la mise à jour du paramètre"
      };
    }
  }
} 
import { getProprietes, createPropriete, updatePropriete, deletePropriete } from "@/lib/propriete";

export interface TypePropriete {
  id_type_propriete: number;
  libelle: string;
}

export interface Plateforme {
  id_plateforme: number;
  nom: string | null;
  site_web: string | null;
}

export interface ProprietePlateforme {
  id_propriete: number;
  id_plateforme: number;
  plateforme: Plateforme;
}

export interface Propriete {
  id_propriete: number;
  nom: string;
  adresse: string;
  typePropriete: {
    id_type_propriete: number;
    libelle: string;
  };
  nb_pieces: number;
  superficie: number;
  plateformes: Array<{
    id_propriete: number;
    id_plateforme: number;
    plateforme: {
      nom: string | null;
      id_plateforme: number;
      site_web: string | null;
    };
  }>;
  ville: string;
  pays: string;
  code_postal: string | null;
  description: string | null;
}

export interface ProprieteFormData {
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
  code_postal: string;
  nb_pieces: string;
  superficie: string;
  description: string;
  typePropriete: string;
}

interface CreateProprieteData {
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
  code_postal?: string;
  nb_pieces: number;
  superficie: number;
  description?: string;
  id_type_propriete: number;
}

export class ProprieteService {
  static async loadProprietes() {
    try {
      const result = await getProprietes();
      
      if (result.success && result.proprietes) {
        return { success: true, proprietes: result.proprietes };
      } else if (result.error === "Vous devez être connecté pour voir vos propriétés") {
        return { success: true, proprietes: [] };
      } else {
        return { success: false, error: result.error || "Erreur lors du chargement des propriétés" };
      }
    } catch (error) {
      console.error("Erreur lors du chargement des propriétés:", error);
      return { success: false, error: "Une erreur est survenue lors du chargement des propriétés" };
    }
  }

  static async handleDelete(id: number) {
    try {
      const result = await deletePropriete(id);
      if (result.success) {
        return { success: true, message: "Propriété supprimée avec succès" };
      } else {
        return { success: false, error: result.error || "Erreur lors de la suppression" };
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      return { success: false, error: "Une erreur est survenue lors de la suppression" };
    }
  }

  static async handleSubmit(formData: ProprieteFormData, editingProperty: Propriete | null) {
    try {
      // Convertir les valeurs numériques
      const nb_pieces = parseInt(formData.nb_pieces);
      const superficie = parseInt(formData.superficie);
      const id_type_propriete = parseInt(formData.typePropriete);

      if (isNaN(nb_pieces) || isNaN(superficie) || isNaN(id_type_propriete)) {
        return { success: false, error: "Veuillez entrer des valeurs numériques valides" };
      }

      // Préparer les données
      const propertyData: CreateProprieteData = {
        nom: formData.nom.trim(),
        adresse: formData.adresse.trim(),
        ville: formData.ville.trim(),
        pays: formData.pays.trim(),
        nb_pieces,
        superficie,
        id_type_propriete
      };

      // Ajouter les champs optionnels s'ils sont présents
      if (formData.code_postal.trim()) {
        propertyData.code_postal = formData.code_postal.trim();
      }
      if (formData.description.trim()) {
        propertyData.description = formData.description.trim();
      }

      let result;
      if (editingProperty) {
        result = await updatePropriete(editingProperty.id_propriete, propertyData);
      } else {
        result = await createPropriete(propertyData);
      }

      if (result.success) {
        return { 
          success: true, 
          message: editingProperty ? "Propriété modifiée avec succès" : "Propriété créée avec succès" 
        };
      } else {
        let errorMessage = result.error || `Erreur lors de la ${editingProperty ? 'modification' : 'création'} de la propriété`;
        if (result.details) {
          errorMessage = `${errorMessage}\n${result.details}`;
        }
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error(`Erreur lors de la ${editingProperty ? 'modification' : 'création'} de la propriété:`, error);
      return { 
        success: false, 
        error: `Une erreur est survenue lors de la ${editingProperty ? 'modification' : 'création'} de la propriété. Veuillez réessayer.` 
      };
    }
  }

  static async getTypesPropriete(): Promise<{ success: boolean; types?: TypePropriete[]; error?: string }> {
    try {
      const types = await db.typePropriete.findMany();
      return { success: true, types };
    } catch (error) {
      console.error("Erreur lors de la récupération des types de propriété:", error);
      return { 
        success: false, 
        error: "Erreur lors de la récupération des types de propriété" 
      };
    }
  }

  static async getPlateformes(): Promise<{ success: boolean; plateformes?: Plateforme[]; error?: string }> {
    try {
      const plateformes = await db.plateforme.findMany();
      return { success: true, plateformes };
    } catch (error) {
      console.error("Erreur lors de la récupération des plateformes:", error);
      return { 
        success: false, 
        error: "Erreur lors de la récupération des plateformes" 
      };
    }
  }
} 
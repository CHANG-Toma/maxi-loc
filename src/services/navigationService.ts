export class NavigationService {
  static scrollToElement(elementId: string) {
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
      
      // Animation visuelle
      targetElement.classList.add('highlight-section');
      setTimeout(() => {
        targetElement.classList.remove('highlight-section');
      }, 1500);
    }
  }

  static handleInternalLink(e: React.MouseEvent, href: string) {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      this.scrollToElement(targetId);
    }
  }

  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  static getNavigationItems() {
    return [
      { icon: 'Home', label: "Accueil", path: "/dashboard" },
      { icon: 'Building2', label: "Propriétés", path: "/dashboard/proprietes" },
      { icon: 'CreditCard', label: "Charges", path: "/dashboard/charges" },
      { icon: 'Calendar', label: "Réservations", path: "/dashboard/reservations" },
      { icon: 'BarChart3', label: "Rapports", path: "/dashboard/rapports" },
      { icon: 'Settings', label: "Paramètres", path: "/dashboard/parametres" },
    ];
  }

  static getFooterLinks() {
    return [
      {
        title: "Légal",
        links: [
          { name: "Mentions Légales", href: "/legal/mentions-legales" },
          { name: "Politique de Confidentialité", href: "/legal/privacy" },
          { name: "Politique des Cookies", href: "/legal/cookies" },
          { name: "Conformité RGPD", href: "/legal/rgpd" },
          { name: "Déclaration CNIL", href: "/legal/cnil" },
        ],
      },
      {
        title: "Entreprise",
        links: [
          { name: "Accueil", href: "#hero" },
          { name: "Fonctionnalités", href: "#features" },
          { name: "Services", href: "#dashboard" },
          { name: "Contact", href: "#contact" },
        ],
      },
    ];
  }

  static getSocialLinks() {
    return [
      { icon: 'Facebook', href: "https://www.facebook.com", label: "Facebook" },
      { icon: 'Twitter', href: "https://www.twitter.com", label: "Twitter" },
      { icon: 'Instagram', href: "https://www.instagram.com", label: "Instagram" },
      { icon: 'Mail', href: "mailto:toma11chang@gmail.com", label: "Email" },
    ];
  }
} 
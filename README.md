<!-- Titre et description du projet -->
## Titre et description

Maxi Loc

Maxi Loc est une application web de gestion immobilière conçue pour optimiser la rentabilité des investissements locatifs. Cette plateforme permet aux propriétaires et investisseurs de suivre, analyser et maximiser les performances de leurs biens immobiliers en location.

Notre solution offre une vision claire de la rentabilité de chaque bien, avec des outils d'analyse financière, de suivi des loyers, et de gestion des dépenses, le tout dans une interface moderne et intuitive.

## Fonctionnalités principales

- Tableau de bord personnalisé avec vue d'ensemble de tous vos biens
- Calcul automatique de la rentabilité et du cash flow
- Suivi des loyers et des charges
- Gestion des contrats de location
- Planification des travaux et de la maintenance
- Rapports financiers détaillés et exportables

## Technologies utilisées

- Frontend: React.js, Next.js, Tailwind CSS
- Backend: Node.js
- Base de données: MySQL
- Déploiement: Vercel

## Logique utilisées
- services : Logique métier (getUser, newUser, ...)
- app : agit comme la view (MVC)
- lib : agit comme un controleur (MVC)

## Auteurs et contributeurs

- **CHANG Toma** - [GitHub](https://github.com/CHANG-Toma)

## Licence

Ce projet est sous licence [MIT](LICENSE) - voir le fichier LICENSE pour plus de détails.


## LOGIQUE UTILISÉE

# Sécurisation du formulaire de connexion avec Google reCAPTCHA

Pour protéger l’application contre les attaques automatisées (brute force, bots, DDoS), le formulaire de connexion utilise Google reCAPTCHA v2.

Logique d’intégration :

Affichage du reCAPTCHA :
- Le composant reCAPTCHA s’affiche sur le formulaire de connexion. L’utilisateur doit le valider pour activer le bouton de connexion.

- Récupération du token :
Après validation, un token reCAPTCHA est généré côté client.

Vérification côté serveur :
- Lors de la soumission du formulaire, le token est envoyé au backend, qui le vérifie auprès de l’API Google reCAPTCHA grâce à la clé secrète.

Connexion autorisée ou refusée :
- Si le token est valide, la connexion se poursuit. Sinon, elle est refusée.

Variables d’environnement nécessaires :
- NEXT_PUBLIC_RECAPTCHA_SITE_KEY (clé publique, frontend)
- RECAPTCHA_SECRET_KEY (clé secrète, backend)

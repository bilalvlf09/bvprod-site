# BVProd — Notes de handoff

## C'est quoi
Site vitrine BVProd (agence Wix Studio, Paris), construit en HTML/CSS/JS simple (pas de framework) à partir de 12 maquettes figées (`.dc.html`, desktop+mobile) fournies dans `../handoff/`. Chaque maquette a été fusionnée en une seule page responsive.

## État actuel
- **6 pages en prod** : `index.html`, `services.html`, `realisations.html`, `a-propos.html`, `contact.html`, `mentions-legales.html`
- **CSS partagé** : `css/style.css` (variables, boutons glass, nav, footer, animations, grilles, responsive)
- **JS partagé** : `js/main.js` (menu mobile, reveal/cascade au scroll, tilt 3D, boutons glass + effet magnétique, carrousels, formulaire → Formspree, respect de `prefers-reduced-motion`)
- **Déployé** : [bvprod-site.vercel.app](https://bvprod-site.vercel.app) et domaine `bv-prod.fr` (DNS chez OVH, propagé)
- **Dépôt GitHub** : `github.com/bilalvlf09/bvprod-site` (branche `main`), push testé et fonctionnel

## Décisions à connaître (ne pas re-demander)
- **Domaine** : toutes les URLs (canonical, OG, JSON-LD, sitemap) utilisent `bv-prod.fr`, mais le nom de marque affiché dans les textes reste **"BVProd"** (pas de tiret).
- **Formspree** : ID `mojoyvrv`, branché sur le formulaire de contact (`contact.html`) ET le formulaire de devis (`services.html#devis-target`). Testé avec un vrai envoi réussi (200 OK).
- **Assets images** : convention de nom `site-{nom}-phone-crop.png` pour les mockups téléphone dans le carrousel "Diverses réalisations" (`realisations.html`). Ces images doivent être **recadrées pile au bord du téléphone** (aucune marge blanche), avec les coins arrondis remplis en gris foncé `(40,40,40)` pour matcher les mockups existants — voir méthode Python/PIL utilisée dans l'historique (flood-fill depuis les 4 coins).
- **Réseaux sociaux** (Instagram/LinkedIn sur Contact) : pas d'URL réelle fournie, laissés non cliquables volontairement.
- **Bouton "Télécharger mon CV"** (À propos) : remplacé par un lien LinkedIn réel.

## Contraintes d'environnement (important)
- **Pas de Node/npm/vercel CLI/gh CLI** dans cet environnement de dev — le déploiement se fait via push Git (déclenche auto-redeploy Vercel), jamais de build local.
- **Serveur de preview local** : utiliser `ruby -run -e httpd <dossier> -p 5500` (pas `python3 -m http.server`, qui plante dans le sandbox de cet environnement). Voir `../handoff/.claude/launch.json`.
- Le dossier servi en preview doit être **hors de `~/Desktop`** (macOS TCC bloque l'accès sandboxé à Desktop) — copier le site dans le scratchpad de session avant de lancer `preview_start`.
- **Bugs connus de l'outil de preview** (pas du code) : `preview_screenshot` ignore parfois la position de scroll (reste en haut) ; `window.innerWidth` peut retourner une valeur périmée après un resize — utiliser `document.documentElement.clientWidth` à la place pour les vérifs d'overflow.

## Style de collaboration (feedback appris pendant le projet)
- Bilal envoie souvent des captures d'écran (voix-to-texte parfois approximative) pour signaler des bugs visuels précis — toujours vérifier objectivement (mesurer via JS, pas deviner) avant de conclure qu'un problème n'existe pas ou est résolu.
- Ne jamais faire de changement de design non demandé ; en cas d'ambiguïté sur la portée d'une demande, poser une question de clarification plutôt que deviner.
- Toujours committer + pousser sur `main` après une correction validée (Bilal attend le déploiement Vercel automatique pour vérifier en direct).
- Fichiers image/texte que Bilal "envoie" dans le chat ne sont PAS automatiquement sauvegardés sur son disque — s'ils doivent devenir des assets du site, il faut soit qu'il les dépose lui-même dans `assets/`, soit chercher les captures d'écran macOS auto-sauvegardées (nommées `Capture d'écran YYYY-MM-DD à HH.MM.SS.png`, souvent dans le dossier parent du projet) et les identifier par l'heure affichée à l'écran du mockup.

## Pour reprendre le travail
Aucune tâche en attente au moment de la rédaction de cette note. Le site est stable et déployé. Pour toute nouvelle demande, tester dans le navigateur (preview local) avant de pousser, comme d'habitude.

# BVProd — Notes de handoff

> ## ⚠️ RÈGLE À NE JAMAIS OUBLIER : remplacer une image
>
> Les fichiers de `/assets/` sont servis avec un cache navigateur d'**un an en `immutable`**
> (voir `vercel.json`). C'est ce qui rend le site rapide, mais ça a une contrepartie stricte :
>
> **Pour remplacer une image existante, il FAUT changer son nom de fichier.**
> Exemple : `site-dkor-phone-crop.webp` → `site-dkor-phone-crop-v2.webp`, puis mettre à jour le `src`.
>
> Si on écrase une image en gardant le même nom, les visiteurs déjà venus continueront de voir
> l'ancienne version **jusqu'à un an**, et un rechargement forcé (Cmd+Maj+R) ne suffira même pas :
> le mot-clé `immutable` dit explicitement au navigateur de ne pas revalider, même au reload.
> Seule une navigation privée ou un vidage manuel du cache montrerait la nouvelle version.
>
> - **Ajouter** une nouvelle image : aucun problème, rien à faire.
> - **Remplacer** une image : renommer le fichier (ou en dernier recours ajouter `?v=2` au `src`).
>
> ## ⚠️ RÈGLE À NE JAMAIS OUBLIER : modifier le CSS ou le JS
>
> `css/style.css` et `js/main.js` sont **aussi** en cache immutable d'un an, et référencés
> dans les 6 pages HTML avec un numéro de version :
>
> ```html
> <link rel="stylesheet" href="/css/style.css?v=20260811">
> <script src="/js/main.js?v=20260811"></script>
> ```
>
> **Après CHAQUE modification de `style.css` ou de `main.js`, il FAUT incrémenter ce `?v=`
> dans les 6 fichiers HTML**, sinon les visiteurs déjà venus garderont l'ancienne version.
> Une seule commande suffit, en remplaçant la date par celle du jour :
>
> ```bash
> cd ~/Desktop/"BVPROD CLAUDE CODE"/bvprod-site && sed -i '' 's/?v=[0-9]\{8\}/?v=20260812/g' *.html
> ```
>
> C'est ce versionnage qui permet de servir le CSS et le JS depuis le cache sans aucun
> aller-retour réseau, et donc d'avoir un changement de page quasi instantané.
> Sans lui, chaque clic dans le menu imposait 2 allers-retours bloquants avant le
> moindre pixel affiché.

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

## Pipeline images (optimisation perf, août 2026)
- **Toutes les images de contenu sont en WebP** dans `assets/`. Les originaux non compressés sont conservés dans `assets-originaux/` (gitignoré, ~101 Mo) et restent dans l'historique git.
- **Règle de dimensionnement** : résolution du fichier = largeur d'affichage CSS réelle **× 3** (couvre les écrans 2x et 3x), jamais d'agrandissement au-delà de l'original. Ne pas livrer d'image à 3000 px pour un affichage à 360 px.
- **Qualité** : WebP q94 par défaut, validé image par image (PSNR ≥ 40 dB, SSIM ≥ 0,994, plus contrôle visuel à taille réelle). Les images qui échouent au seuil sont encodées en **WebP sans perte** plutôt que dégradées : `omnisoin-phone`, `polesante-phone`, `site-lesassocies-phone-crop`, `site-compagnyarena`, `site-dataplus`. `portrait.jpeg` est resté en JPEG d'origine (le WebP était plus lourd).
- **Restés hors pipeline volontairement** : `logo-bvprod.png` (favicon, le PNG est requis) et `og-image.jpg` (partage social, les scrapers gèrent mal le WebP).
- **⚠️ Cache d'un an sur `/assets/*`** (`immutable`, voir `vercel.json`). Pour **remplacer** une image existante, il faut **changer son nom de fichier** (ou ajouter `?v=2` dans le `src`), sinon les visiteurs déjà venus continueront de voir l'ancienne version pendant un an. Ajouter une nouvelle image ne pose aucun problème.
- `css/` et `js/` sont volontairement **exclus** de ce cache long : ils gardent le même nom à chaque déploiement et doivent être revalidés à chaque visite.
- **`loading="lazy"` partout sauf** : les logos de nav, le téléphone du hero (`index.html`) et le portrait (`a-propos.html`), qui sont visibles sans défiler et portent `fetchpriority="high"`.
- Toute nouvelle `<img>` doit porter `width`, `height` (dimensions intrinsèques réelles, pour éviter le décalage de mise en page) et `decoding="async"`.

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

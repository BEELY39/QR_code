/**
 * Configuration de production (build par défaut).
 * `googleClientId` est public par nature (servi à toute page qui affiche le bouton Google) ;
 * le secret client Google n'est jamais utilisé par le site.
 */
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.qrcode-craft.fr',
  googleClientId: '984838546224-vnk721eak0da8nhvvht54jhdtkoq8cce.apps.googleusercontent.com',
};

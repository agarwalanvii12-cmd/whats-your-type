// Public config. This file is served to every visitor, so NO SECRETS here.
//
// aiEndpoint: where core/ai.js asks for the AI comment.
//  - On Vercel, the proxy lives on the same site, so '/api/comment' just works.
//  - On GitHub Pages, paste your full Vercel URL below, e.g.
//    'https://whats-your-type.vercel.app/api/comment'
//  - null = use the built-in template comment.
const VERCEL_URL = 'https://whats-your-type-ochre.vercel.app';

window.WYT_CONFIG = {
  aiEndpoint: location.hostname.endsWith('vercel.app')
    ? '/api/comment'
    : VERCEL_URL ? VERCEL_URL + '/api/comment' : null,
};

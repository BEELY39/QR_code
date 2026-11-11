import { LANDING_FAQ_IDS, selectFaqItems } from './faq.constant';

describe('selectFaqItems (catégorie 2 — résolution de la sélection FAQ)', () => {
  it('rend exactement les 6 questions de la maquette, dans son ordre', () => {
    const items = selectFaqItems(LANDING_FAQ_IDS);
    expect(items.length).toBe(6);
    expect(items.map((item) => item.id)).toEqual(LANDING_FAQ_IDS);
  });

  it('échoue de façon visible sur un identifiant inconnu', () => {
    expect(() => selectFaqItems(['faq-inexistante'])).toThrowError(/faq-inexistante/);
  });

  it('ne reconstruit pas de question absente de la sélection', () => {
    const items = selectFaqItems(['faq-free']);
    expect(items.length).toBe(1);
    expect(items[0].id).toBe('faq-free');
  });
});

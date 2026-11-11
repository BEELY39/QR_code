import { sparklineAreaPath, sparklinePath } from './sparkline-path';

describe('sparklinePath (catégorie 2 — logique de tracé)', () => {
  it('renvoie une chaîne vide pour une série vide', () => {
    expect(sparklinePath([], 100, 50)).toBe('');
    expect(sparklineAreaPath([], 100, 50)).toBe('');
  });

  it('trace un segment horizontal au milieu pour un point unique', () => {
    expect(sparklinePath([7], 100, 50)).toBe('M0 25 L100 25');
  });

  it('trace une ligne plate au milieu quand toutes les valeurs sont égales', () => {
    expect(sparklinePath([4, 4, 4], 100, 50)).toBe('M0 25 L50 25 L100 25');
  });

  it('place le minimum en bas et le maximum en haut, sans division par zéro', () => {
    expect(sparklinePath([0, 10], 100, 50)).toBe('M0 50 L100 0');
  });

  it('gère les valeurs négatives comme n\'importe quelle plage', () => {
    expect(sparklinePath([-10, 0, 10], 100, 50)).toBe('M0 50 L50 25 L100 0');
  });

  it('gère une série de deux points', () => {
    expect(sparklinePath([5, 5], 200, 10)).toBe('M0 5 L200 5');
  });

  it('ferme la surface sur le bas du viewBox', () => {
    expect(sparklineAreaPath([0, 10], 100, 50)).toBe('M0 50 L100 0 L100 50 L0 50 Z');
  });

  it('respecte une échelle fixe fournie par la maquette', () => {
    // y = hauteur - valeur, sur une échelle 0..56
    expect(sparklinePath([10, 16], 194, 56, { scale: { min: 0, max: 56 } })).toBe('M0 46 L194 40');
  });

  it('utilise les abscisses fournies quand elles sont données', () => {
    expect(sparklinePath([0, 10, 0], 100, 50, { xs: [0, 70, 100] })).toBe('M0 50 L70 0 L100 50');
  });
});

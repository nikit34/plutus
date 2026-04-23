const STORAGE_KEY = 'plutus_hero_variant';

export function getHeroVariant() {
  if (typeof window === 'undefined') return 'A';
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing === 'A' || existing === 'B') return existing;
    const assigned = Math.random() < 0.5 ? 'A' : 'B';
    window.localStorage.setItem(STORAGE_KEY, assigned);
    return assigned;
  } catch {
    return 'A';
  }
}

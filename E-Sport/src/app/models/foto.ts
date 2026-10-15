const FUOCHI: Record<string, string> = {
  'img/fortnite.png': '50% 12%',
  'img/R6.png': '62% 50%',
  'img/mortal.png': '50% 40%',
  'img/clashroyale.png': '50% 62%',
  'img/fifa.png': '50% 20%',
  'img/lol.png': '50% 50%',
  'img/rocket.png': '50% 15%',
  'img/street.png': '50% 22%',
};

export function fuoco(foto: string | null): string {
  return (foto && FUOCHI[foto]) || '50% 30%';
}

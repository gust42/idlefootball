import { Player } from '../types/game';

export function getRandomPlayers(availablePlayers: Player[], count: number): Player[] {
  const shuffled = [...availablePlayers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


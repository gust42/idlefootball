import { GameState, Match, Team } from "../types/game";

export function handlePlayMatch(newState: GameState, match: Match) {
  const calculatePassingAbility = (team: Team) => {
    return team.players.reduce((total, player) => {
      return total + player.skills.passing;
    }, 0);
  };

  const calculateAttackingAbility = (team: Team) => {
    return team.players.reduce((total, player) => {
      return total + player.skills.shooting;
    }, 0);
  };

  const calculateDefendingAbility = (team: Team) => {
    return team.players.reduce((total, player) => {
      return total + player.skills.defending;
    }, 0);
  };

  const homePassingAbility = calculatePassingAbility(match.homeTeam);
  const awayPassingAbility = calculatePassingAbility(match.awayTeam);

  const homeAttackingAbility = calculateAttackingAbility(match.homeTeam);
  const awayAttackingAbility = calculateAttackingAbility(match.awayTeam);

  const homeDefendingAbility = calculateDefendingAbility(match.homeTeam);
  const awayDefendingAbility = calculateDefendingAbility(match.awayTeam);

  let homeGoals = 0;
  let awayGoals = 0;

  for (let i = 0; i < 10; i++) {
    const homeAttackingChance = homePassingAbility / (homePassingAbility + awayPassingAbility) + Math.random() * 0.1;
    const awayAttackingChance = awayPassingAbility / (homePassingAbility + awayPassingAbility) + Math.random() * 0.1;

    if (homeAttackingChance > awayAttackingChance) {
      if (homeAttackingAbility > awayDefendingAbility && Math.random() < 0.1) {
        homeGoals++;
      }
    } else {
      if (awayAttackingAbility > homeDefendingAbility && Math.random() < 0.1) {
        awayGoals++;
      }
    }
  }

  match.homeGoals = homeGoals;
  match.awayGoals = awayGoals;

  if (homeGoals > awayGoals) {
    match.homeTeam.points += 3;
  } else if (homeGoals < awayGoals) {
    match.awayTeam.points += 3;
  } else {
    match.homeTeam.points += 1;
    match.awayTeam.points += 1;
  }

  return {
    ...newState,
  };
}

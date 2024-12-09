import { Player, GameState, Match, Team } from "../types/game";

export function handleTransferPlayer(newState: GameState, payload: Player) {
  if (payload && payload.id != null) {
    return {
      ...newState,
      players: [...newState.players, payload],
      availablePlayers: newState.availablePlayers.filter(
        (p) => p.id !== payload.id
      ),
      money: newState.money - payload.transferCost,
    };
  }
  return newState;
}

export function handleStartTraining(
  newState: GameState,
  payload: { playerId: number; stat: keyof Player["maxSkills"] }
) {
  return {
    ...newState,
    players: newState.players.map((player) =>
      player.id === payload.playerId
        ? {
            ...player,
            training: {
              stat: payload.stat,
              ticksRemaining: 10,
            },
          }
        : player
    ),
  };
}

export function handleUpdatePlayerPosition(
  newState: GameState,
  payload: { newPosition: string; player: Player }
) {
  const playerToUpdate = payload.player;
  if (playerToUpdate && playerToUpdate.id != null) {
    return {
      ...newState,
      currentTeam: [
        ...newState.currentTeam.filter(
          (p) => p.position !== payload.newPosition
        ),
        { ...playerToUpdate, position: payload.newPosition },
      ],
      players: newState.players.filter((p) => p.id !== playerToUpdate.id),
    };
  }
  return newState;
}

export function handleRemovePlayerPosition(
  newState: GameState,
  payload: { playerId: number }
) {
  const removedPlayer = newState.currentTeam.find(
    (p) => p.id === payload.playerId
  );
  if (removedPlayer) {
    return {
      ...newState,
      currentTeam: newState.currentTeam.filter(
        (p) => p.id !== payload.playerId
      ),
      players: [
        ...newState.players,
        { ...removedPlayer, position: undefined },
      ],
    };
  }
  return newState;
}

export function handleSwapPlayerPositions(
  newState: GameState,
  payload: { sourcePosition: string; destPosition: string }
) {
  return {
    ...newState,
    currentTeam: newState.currentTeam.map((player) => {
      if (player.position === payload.sourcePosition) {
        return { ...player, position: payload.destPosition };
      }
      if (player.position === payload.destPosition) {
        return { ...player, position: payload.sourcePosition };
      }
      return player;
    }),
  };
}

export function handlePlayMatch(newState: GameState, match: Match) {
  const calculateTeamStrength = (team: Team) => {
    return team.players.reduce((total, player) => {
      return total + player.skills.shooting + player.skills.passing + player.skills.defending + player.skills.workrate;
    }, 0);
  };

  const homeStrength = calculateTeamStrength(match.homeTeam) * 1.1; // Home advantage
  const awayStrength = calculateTeamStrength(match.awayTeam);
  const totalStrength = homeStrength + awayStrength;

  const homeGoals = Math.round((homeStrength / totalStrength) * 5 + Math.random() * 2);
  const awayGoals = Math.round((awayStrength / totalStrength) * 5 + Math.random() * 2);

  match.homeGoals = homeGoals;
  match.awayGoals = awayGoals;

  const updateTeamStats = (team: Team, goalsFor: number, goalsAgainst: number) => {
    team.goalsFor += goalsFor;
    team.goalsAgainst += goalsAgainst;
    if (goalsFor > goalsAgainst) {
      team.points += 3;
    } else if (goalsFor === goalsAgainst) {
      team.points += 1;
    }
  };

  updateTeamStats(match.homeTeam, homeGoals, awayGoals);
  updateTeamStats(match.awayTeam, awayGoals, homeGoals);

  return {
    ...newState,
    leagueTable: [...newState.leagueTable],
    schedule: newState.schedule.filter((m) => m !== match),
  };
}

export function handlePlayRound(newState: GameState) {
  const currentRound = newState.schedule[newState.currentRound];
  if (!currentRound) {
    return newState;
  }
  currentRound.matches.forEach((match) => {
    newState = handlePlayMatch(newState, match);
  });
  return {
    ...newState,
    currentRound: newState.currentRound + 1,
  };
}

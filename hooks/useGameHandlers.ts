import { Player, GameState, Match, Team } from "../types/game";
import { handlePlayMatch } from "./handlePlayMatch";

export function handleTransferPlayer(gameState: GameState, payload: Player) {
  if (payload && payload.id != null) {
    gameState.players =  [...gameState.players, payload];
    gameState.availablePlayers = gameState.availablePlayers.filter((p) => p.id !== payload.id);
    gameState.money = gameState.money - payload.transferCost;
  }
}

export function handleStartTraining(
  gameState: GameState,
  payload: { playerId: number; stat: keyof Player["maxSkills"] }
) {
  gameState.players = gameState.players.map((player) =>
      player.id === payload.playerId
        ? {
            ...player,
            training: {
              stat: payload.stat,
              ticksRemaining: 10,
            },
          }
        : player
    );
}

export function handleUpdatePlayerPosition(
  gameState: GameState,
  payload: { newPosition: string; player: Player }
) {
  const playerToUpdate = payload.player;
  if (playerToUpdate && playerToUpdate.id != null) {
    gameState.currentTeam = [
        ...gameState.currentTeam.filter(
          (p) => p.position !== payload.newPosition
        ),
        { ...playerToUpdate, position: payload.newPosition },
      ];
    gameState.players = gameState.players.filter((p) => p.id !== playerToUpdate.id);
  }
}

export function handleRemovePlayerPosition(
  gameState: GameState,
  payload: { playerId: number }
) {
  const removedPlayer = gameState.currentTeam.find(
    (p) => p.id === payload.playerId
  );
  if (removedPlayer) {
    gameState.currentTeam = gameState.currentTeam.filter(
        (p) => p.id !== payload.playerId
      );
    gameState.players = [
        ...gameState.players,
        { ...removedPlayer, position: undefined },
      ]
  }
}

export function handleSwapPlayerPositions(
  gameState: GameState,
  payload: { sourcePosition: string; destPosition: string }
) {
  gameState.currentTeam = gameState.currentTeam.map((player) => {
      if (player.position === payload.sourcePosition) {
        return { ...player, position: payload.destPosition };
      }
      if (player.position === payload.destPosition) {
        return { ...player, position: payload.sourcePosition };
      }
      return player;
    })
}

export function handlePlayRound(gameState: GameState) {
  const currentRound = gameState.schedule[gameState.currentRound];
  if (!currentRound) {
    return gameState;
  }
  currentRound.matches.forEach((match) => {
    handlePlayMatch(match);
  });

  gameState.currentRound = gameState.currentRound + 1;
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import { Player, GameMessage, Match } from "../types/game";
import { useGameState } from "./useGameState";
import {
  handleTransferPlayer,
  handleStartTraining,
  handleUpdatePlayerPosition,
  handleRemovePlayerPosition,
  handleSwapPlayerPositions,
  handlePlayMatch,
  handlePlayRound,
} from "./useGameHandlers";

export function useGameLoop() {
  const { gameState, setGameState } = useGameState();

  const previousGameStateRef = useRef<GameState | null>(null);

  const addMessage = useCallback((message: GameMessage) => {
    setGameState((prevState) => {
      let newState = { ...prevState };

      switch (message.type) {
        case "TRANSFER_PLAYER":
          newState = handleTransferPlayer(newState, message.payload as Player);
          break;
        case "START_TRAINING":
          newState = handleStartTraining(
            newState,
            message.payload as {
              playerId: number;
              stat: keyof Player["maxSkills"];
            }
          );
          break;
        case "UPDATE_PLAYER_POSITION":
          newState = handleUpdatePlayerPosition(
            newState,
            message.payload as { newPosition: string; player: Player }
          );
          break;
        case "REMOVE_PLAYER_POSITION":
          newState = handleRemovePlayerPosition(
            newState,
            message.payload as { playerId: number }
          );
          break;
        case "SWAP_PLAYER_POSITIONS":
          newState = handleSwapPlayerPositions(
            newState,
            message.payload as { sourcePosition: string; destPosition: string }
          );
          break;
        case "PLAY_MATCH":
          newState = handlePlayMatch(
            newState,
            message.payload as Match
          );
          break;
        case "PLAY_ROUND":
          newState = handlePlayRound(newState);
          break;
        default:
          break;
      }

      // Update the current team in the teams list
      newState.teams = newState.teams.map((team) =>
        team.id === 0 ? { ...team, players: newState.currentTeam } : team
      );

      return newState;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prevState) => {
        let newState = { ...prevState, tick: prevState.tick + 1 };

        newState.players = newState.players.map((player) => {
          if (player.training) {
            const newTicksRemaining = player.training.ticksRemaining - 1;
            if (newTicksRemaining <= 0) {
              const newSkills = {
                ...player.skills,
                [player.training.stat]: Math.min(
                  player.skills[player.training.stat] + 1,
                  player.maxSkills[player.training.stat]
                ),
              };
              return {
                ...player,
                skills: newSkills,
                training: null,
              };
            } else {
              return {
                ...player,
                training: {
                  ...player.training,
                  ticksRemaining: newTicksRemaining,
                },
              };
            }
          }
          return player;
        });

        if (newState.tick % 10 === 0) {
          newState = handlePlayRound(newState);
        }

        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (previousGameStateRef.current) {
      const previousGameState = previousGameStateRef.current;
      if (previousGameState.tick !== gameState.tick) {
        localStorage.setItem("gameState", JSON.stringify(gameState));
      }
    }
    previousGameStateRef.current = gameState;
  }, [gameState]);

  return { gameState, addMessage };
}

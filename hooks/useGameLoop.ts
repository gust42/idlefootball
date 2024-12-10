"use client";

import { useCallback, useEffect, useRef, createContext, useContext } from "react";
import { Player, GameMessage, Match, GameState } from "../types/game";
import { useGameState } from "./useGameState";
import {
  handleTransferPlayer,
  handleStartTraining,
  handleUpdatePlayerPosition,
  handleRemovePlayerPosition,
  handleSwapPlayerPositions,
  handlePlayRound,
} from "./useGameHandlers";
import { handlePlayMatch } from "./handlePlayMatch";

let animationFrameId: number | null = null;
let lastTick = 0;

// Hack for react 18
let lastRunTick = 0;

function startGameLoop(callback: (timestamp: number) => void) {
  if (animationFrameId === null) {
    const gameLoop = (timestamp: number) => {
      callback(timestamp);
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function stopGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

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

  const gameLoop = useCallback((timestamp: number) => {
    if (timestamp - lastTick >= 1000) {
      setGameState((prevState) => {
        let newState = { ...prevState, tick: prevState.tick + 1 };


        if (lastRunTick != newState.tick) {
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

        lastRunTick = newState.tick
        }
        return newState;
      });

      lastTick = timestamp;
    }
  }, []);

  useEffect(() => {
    startGameLoop(gameLoop);
  }, [gameLoop]);

  useEffect(() => {
    if (previousGameStateRef.current) {
      const previousGameState = previousGameStateRef.current;
      if (previousGameState.tick !== gameState.tick) {
        localStorage.setItem("gameState", JSON.stringify(gameState));
      }
    }
    previousGameStateRef.current = gameState;
  }, [gameState]);

  const gameLoopInstance = { gameState, addMessage };
  return gameLoopInstance;
}

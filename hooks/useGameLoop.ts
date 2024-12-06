"use client";

import { useState, useCallback, useEffect } from "react";
import { players } from "../data/playerData";
import { teamData, getAllTeamPlayers } from "../data/teamData";
import { Player, GameState, GameMessage } from "../types/game";

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = null; //localStorage.getItem("gameState");
    const teamPlayers = getAllTeamPlayers();
    const availablePlayers = players.filter(
      (player) =>
        !teamPlayers.some((tp) => {
          return tp?.id === player.id;
        })
    );

    return savedState
      ? JSON.parse(savedState)
      : {
          players: [],
          availablePlayers: availablePlayers,
          currentTeam: [],
          teams: teamData,
          tick: 0,
          money: 100000,
        };
  });

  const handleTransferPlayer = (newState: GameState, payload: Player) => {
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
  };

  const handleStartTraining = (
    newState: GameState,
    payload: { playerId: number; stat: keyof Player["maxSkills"] }
  ) => {
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
  };

  const handleUpdatePlayerPosition = (
    newState: GameState,
    payload: { newPosition: string; player: Player }
  ) => {
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
  };

  const handleRemovePlayerPosition = (
    newState: GameState,
    payload: { playerId: number }
  ) => {
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
  };

  const handleSwapPlayerPositions = (
    newState: GameState,
    payload: { sourcePosition: string; destPosition: string }
  ) => {
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
  };

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
      }

      console.log("New game state:", newState);
      return newState;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prevState) => {
        const newTick = prevState.tick + 1;
        const updatedPlayers = prevState.players.map((player) => {
          if (player.training && player.training.ticksRemaining > 0) {
            const newTicksRemaining = player.training.ticksRemaining - 1;
            if (newTicksRemaining === 0) {
              // Training completed
              return {
                ...player,
                skills: {
                  ...player.skills,
                  [player.training.stat]:
                    player.skills[player.training.stat] + 1,
                },
                training: null,
              };
            } else {
              // Continue training
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
        return { ...prevState, players: updatedPlayers, tick: newTick };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }, [gameState]);

  const getRandomPlayers = useCallback(
    (count: number): Player[] => {
      const shuffled = [...gameState.availablePlayers].sort(
        () => 0.5 - Math.random()
      );
      return shuffled.slice(0, count);
    },
    [gameState.availablePlayers]
  );

  return { gameState, addMessage, getRandomPlayers };
}

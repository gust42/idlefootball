"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { players } from "../data/playerData";
import { teamData, getAllTeamPlayers } from "../data/teamData";
import { Player, GameState, GameMessage, Match, Team } from "../types/game";
import { generateSchedule } from "../utils/scheduleGenerator";

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
          teams: [...teamData, { id: 0, name: "Current Team", players: [], points: 0, goalsFor: 0, goalsAgainst: 0 }],
          tick: 0,
          money: 100000,
          leagueTable: teamData,
          schedule: generateSchedule(teamData),
        };
  });

  const previousGameStateRef = useRef<GameState | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

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

  const handlePlayMatch = (newState: GameState, match: Match) => {
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
        case "PLAY_MATCH":
          newState = handlePlayMatch(
            newState,
            message.payload as Match
          );
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
        const newState = { ...prevState, tick: prevState.tick + 1 };

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

        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (previousGameStateRef.current) {
      const previousGameState = previousGameStateRef.current;
      if (previousGameState.tick !== gameState.tick) {
        //localStorage.setItem("gameState", JSON.stringify(gameState));
      }
    }
    previousGameStateRef.current = gameState;
  }, [gameState]);

  return { gameState, addMessage };
}

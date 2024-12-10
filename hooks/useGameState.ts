import { useState, useEffect, useRef } from "react";
import { players } from "../data/playerData";
import { teamData, getAllTeamPlayers } from "../data/teamData";
import { GameState } from "../types/game";
import { generateSchedule } from "../utils/scheduleGenerator";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = null// localStorage.getItem("gameState");
    const teamPlayers = getAllTeamPlayers();
    const availablePlayers = players.filter(
      (player) =>
        !teamPlayers.some((tp) => {
          return tp?.id === player.id;
        })
    );

    var teams = [{ id: 0, name: "Current Team", players: [], points: 0, goalsFor: 0, goalsAgainst: 0 }, ...teamData];

    return savedState
      ? JSON.parse(savedState)
      : {
          players: [],
          availablePlayers: availablePlayers,
          currentTeam: [],
          teams,
          tick: 0,
          money: 100000,
          leagueTable: teamData,
          schedule: generateSchedule(teams),
          currentRound: 0,
        };
  });

  const previousGameStateRef = useRef<GameState | null>(null);

  useEffect(() => {
    if (previousGameStateRef.current) {
      const previousGameState = previousGameStateRef.current;
      if (previousGameState.tick !== gameState.tick) {
        localStorage.setItem("gameState", JSON.stringify(gameState));
      }
    }
    previousGameStateRef.current = gameState;
  }, [gameState]);

    return { gameState, setGameState };
}

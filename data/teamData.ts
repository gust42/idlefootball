import { Team, Player } from "../types/game";
import { players } from "./playerData";

const createTeam = (id: number, name: string, playerIds: number[]): Team => ({
  id,
  name,
  players: playerIds.map((id) => players.find((p) => p.id === id)!),
  points: 0,
  goalsFor: 0,
  goalsAgainst: 0,
});

export const teamData: Team[] = [
  createTeam(1, "Red Dragons", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
  createTeam(2, "Blue Titans", [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]),
  createTeam(3, "Green Wolves", [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]),
  createTeam(4, "Yellow Eagles", [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]),
  createTeam(
    5,
    "Purple Panthers",
    [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]
  ),
  createTeam(6, "Orange Tigers", [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66]),
  createTeam(7, "Black Bears", [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77]),
  createTeam(8, "White Falcons", [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88]),
  createTeam(9, "Silver Sharks", [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]),
  createTeam(
    10,
    "Gold Lions",
    [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110]
  ),
];

export const getAllTeamPlayers = (): Player[] => {
  return teamData.flatMap((team) => team.players);
};

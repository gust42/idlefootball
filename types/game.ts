export interface Player {
  id: number;
  name: string;
  skills: {
    shooting: number;
    passing: number;
    defending: number;
    workrate: number;
  };
  maxSkills: {
    shooting: number;
    passing: number;
    defending: number;
    workrate: number;
  };
  preferredPositions: string[];
  position?: string | null;
  training?: {
    stat: keyof Player["maxSkills"];
    ticksRemaining: number;
  } | null;
  transferCost: number;
}

export interface Team {
  id: number;
  name: string;
  players: Player[];
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Match {
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
}

export interface Round {
  matches: Match[];
}

export interface GameState {
  players: Player[];
  availablePlayers: Player[];
  currentTeam: Player[];
  teams: Team[];
  tick: number;
  money: number;
  leagueTable: Team[];
  schedule: Round[];
  currentRound: number;
}

export interface GameMessage {
  type:
    | "ADD_PLAYER"
    | "START_TRAINING"
    | "TICK"
    | "TRANSFER_PLAYER"
    | "UPDATE_PLAYER_POSITION"
    | "REMOVE_PLAYER_POSITION"
    | "SWAP_PLAYER_POSITIONS"
    | "PLAY_ROUND"
    | "CHANGE_TEAM_NAME";
  payload: unknown;
}

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

export interface GameState {
  players: Player[];
  availablePlayers: Player[];
  currentTeam: Player[];
  teams: Team[];
  tick: number;
  money: number;
}

export interface GameMessage {
  type:
    | "ADD_PLAYER"
    | "START_TRAINING"
    | "TICK"
    | "TRANSFER_PLAYER"
    | "UPDATE_PLAYER_POSITION"
    | "REMOVE_PLAYER_POSITION"
    | "SWAP_PLAYER_POSITIONS";
  payload: unknown;
}

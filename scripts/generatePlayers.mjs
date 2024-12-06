import { writeFileSync } from "fs";
import { names } from "./names.mjs";
import { surnames } from "./surnames.mjs";

const generateRandomPlayer = (id) => {
  const positions = [
    "ST",
    "RW",
    "CM",
    "CAM",
    "LW",
    "LM",
    "RB",
    "CB",
    "CF",
    "CDM",
    "RM",
    "LB",
    "LWB",
    "RWB",
    "GK",
  ];

  const positionGroups = {
    attack: ["ST", "RW", "LW", "CF"],
    midfield: ["CM", "CAM", "LM", "RM", "CDM"],
    defense: ["RB", "CB", "LB", "LWB", "RWB"],
    goalkeeper: ["GK"],
  };

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomSkill = () => Math.floor(Math.random() * 100);
  const getRandomStartSkill = () => Math.floor(Math.random() * 50) + 20;

  const primaryPosition = getRandomElement(positions);
  let secondaryPosition;

  if (primaryPosition === "GK") {
    secondaryPosition = null;
  } else {
    const group = Object.values(positionGroups).find((group) =>
      group.includes(primaryPosition)
    );
    secondaryPosition = getRandomElement(
      group.filter((pos) => pos !== primaryPosition)
    );
  }

  return {
    id,
    name: `${getRandomElement(names)} ${getRandomElement(surnames)}`,
    skills: {
      shooting: getRandomStartSkill(),
      passing: getRandomStartSkill(),
      defending: getRandomStartSkill(),
      workrate: getRandomStartSkill(),
    },
    maxSkills: {
      shooting: getRandomSkill(),
      passing: getRandomSkill(),
      defending: getRandomSkill(),
      workrate: getRandomSkill(),
    },
    preferredPositions: secondaryPosition
      ? [primaryPosition, secondaryPosition]
      : [primaryPosition],
    transferCost: Math.floor(Math.random() * 20000) + 5000,
  };
};

const generatePlayers = (count) => {
  const players = [];
  for (let i = 1; i <= count; i++) {
    players.push(generateRandomPlayer(i));
  }
  return players;
};

const players = generatePlayers(200);
const playerDataContent = `import { Player } from '../types/game';

export const players: Player[] = ${JSON.stringify(players, null, 2)};
`;

writeFileSync("../data/playerData.ts", playerDataContent);
console.log("Player data generated and written to playerData.ts");

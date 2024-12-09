import { Team, Match, Round } from '../types/game';

export function generateSchedule(teams: Team[]): Round[] {
  const rounds: Round[] = [];
  const numTeams = teams.length;

  // Ensure even number of teams by adding a dummy team if necessary
  if (numTeams % 2 !== 0) {
    teams.push({ id: -1, name: 'Dummy', players: [], points: 0, goalsFor: 0, goalsAgainst: 0 });
  }

  const numRounds = numTeams - 1;
  const halfSize = numTeams / 2;

  const teamIndexes = teams.map((_, index) => index);

  for (let roundIndex = 0; roundIndex < numRounds; roundIndex++) {
    const matches: Match[] = [];

    for (let matchIndex = 0; matchIndex < halfSize; matchIndex++) {
      const homeIndex = (roundIndex + matchIndex) % (numTeams - 1);
      let awayIndex = (numTeams - 1 - matchIndex + roundIndex) % (numTeams - 1);

      if (matchIndex === 0) {
        awayIndex = numTeams - 1;
      }

      const homeTeam = teams[teamIndexes[homeIndex]];
      const awayTeam = teams[teamIndexes[awayIndex]];

      if (homeTeam.id !== -1 && awayTeam.id !== -1) {
        matches.push({ homeTeam, awayTeam, homeGoals: 0, awayGoals: 0 });
      }
    }

    rounds.push({ matches });

    // Rotate teams for next round
    teamIndexes.splice(1, 0, teamIndexes.pop()!);
  }

  return rounds;
}

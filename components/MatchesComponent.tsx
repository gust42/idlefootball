import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LeagueTable } from './LeagueTable';
import { Team, Round } from '../types/game';

interface MatchesComponentProps {
  teams: Team[];
  schedule: Round[];
  currentRound: number;
}

export function MatchesComponent({ teams, schedule, currentRound }: MatchesComponentProps) {
  const upcomingRounds = schedule.slice(currentRound, currentRound + 5);
  const matchHistory = schedule.slice(0, currentRound);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>League Table</CardTitle>
        </CardHeader>
        <CardContent>
          <LeagueTable teams={teams} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Matches</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingRounds.map((round, roundIndex) => (
            <div key={roundIndex} className="mb-4">
              <p>Round {currentRound + roundIndex + 1}</p>
              {round.matches.map((match, matchIndex) => (
                <div key={matchIndex} className="mb-4">
                  <p>{match.homeTeam.name} vs {match.awayTeam.name}</p>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          {matchHistory.map((round, roundIndex) => (
            <div key={roundIndex} className="mb-4">
              <p>Round {roundIndex + 1}</p>
              {round.matches.map((match, matchIndex) => (
                <div key={matchIndex} className="mb-4">
                  <p>{match.homeTeam.name} {match.homeGoals} - {match.awayGoals} {match.awayTeam.name}</p>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

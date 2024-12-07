import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LeagueTable } from './LeagueTable';
import { Team, Match } from '../types/game';

interface MatchesComponentProps {
  teams: Team[];
  schedule: Match[];
}

export function MatchesComponent({ teams, schedule }: MatchesComponentProps) {
  const upcomingMatches = schedule.slice(0, 5);
  const matchHistory = schedule.slice(5);

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
          {upcomingMatches.map((match, index) => (
            <div key={index} className="mb-4">
              <p>{match.homeTeam.name} vs {match.awayTeam.name}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          {matchHistory.map((match, index) => (
            <div key={index} className="mb-4">
              <p>{match.homeTeam.name} {match.homeGoals} - {match.awayGoals} {match.awayTeam.name}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

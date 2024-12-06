import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LeagueTable } from './LeagueTable';
import { Team } from '../types/game';

interface MatchesComponentProps {
  teams: Team[];
}

export function MatchesComponent({ teams }: MatchesComponentProps) {
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
          <p>View and prepare for your team's upcoming matches.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Review past match results and team performance.</p>
        </CardContent>
      </Card>
    </div>
  );
}


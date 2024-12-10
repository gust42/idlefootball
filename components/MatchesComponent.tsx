import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LeagueTable } from './LeagueTable';
import { useSnapshot } from 'valtio';
import { gameState } from '../hooks/useGameState';

export function MatchesComponent() {
  const snapshot = useSnapshot(gameState);
  const { teams, schedule, currentRound } = snapshot;
  const round = schedule[currentRound];
  const matchHistory = schedule.slice(0, currentRound);
  const [expandedRounds, setExpandedRounds] = useState<number[]>([]);

  const toggleRoundExpansion = (roundIndex: number) => {
    setExpandedRounds((prevExpandedRounds) =>
      prevExpandedRounds.includes(roundIndex)
        ? prevExpandedRounds.filter((index) => index !== roundIndex)
        : [...prevExpandedRounds, roundIndex]
    );
  };

  return (
    <div className="matches-component grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card">
          <CardHeader className="card-header">
            <CardTitle>Upcoming Matches</CardTitle>
          </CardHeader>
          <CardContent className="card-content">
            <div key={currentRound} className="mb-4">
              <p>Round {currentRound + 1}</p>
              {round?.matches.map((match, matchIndex) => (
                <div key={matchIndex} className="mb-4 clickable">
                  <p>{match.homeTeam.name} vs {match.awayTeam.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="card">
          <CardHeader className="card-header">
            <CardTitle>League Table</CardTitle>
          </CardHeader>
          <CardContent className="card-content">
            <LeagueTable />
          </CardContent>
        </Card>
      </div>
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          {matchHistory.map((round, roundIndex) => (
            <div key={roundIndex} className="mb-4">
              <p className="clickable" onClick={() => toggleRoundExpansion(roundIndex)}>
                Round {roundIndex + 1}
              </p>
              <div className={`expandable ${expandedRounds.includes(roundIndex) ? 'expanded' : 'collapsed'}`}>
                {round.matches.map((match, matchIndex) => (
                  <div
                    key={matchIndex}
                    className={`mb-4 ${match.homeTeam.id === 0 || match.awayTeam.id === 0 ? 'highlight' : ''}`}
                  >
                    <p>{match.homeTeam.name} {match.homeGoals} - {match.awayGoals} {match.awayTeam.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

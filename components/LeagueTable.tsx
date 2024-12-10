import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSnapshot } from 'valtio';
import { gameState } from '../hooks/useGameState';

export function LeagueTable() {
  const snapshot = useSnapshot(gameState);
  const { teams, schedule, currentRound } = snapshot;
  const sortedTeams = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));

  const [previousPositions, setPreviousPositions] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const newPreviousPositions: { [key: number]: number } = {};
    sortedTeams.forEach((team, index) => {
      newPreviousPositions[team.id] = index;
    });
    setPreviousPositions(newPreviousPositions);
  }, [currentRound]);

  const calculatePositionDiff = (teamId: number) => {
    if (currentRound === 0) return 0;
    const currentPosition = sortedTeams.findIndex(team => team.id === teamId);
    const previousPosition = previousPositions[teamId];
    return previousPosition - currentPosition;
  };

  const getPositionDiffArrow = (diff: number) => {
    if (diff > 0) return <span style={{ color: 'green' }}>↑</span>;
    if (diff < 0) return <span style={{ color: 'red' }}>↓</span>;
    return '→';
  };

  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow>
          <TableHead>Diff</TableHead>
          <TableHead>Pos</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Pts</TableHead>
          <TableHead>GF</TableHead>
          <TableHead>GA</TableHead>
          <TableHead>GD</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTeams.map((team, index) => (
          <TableRow key={team.name}>
            <TableCell>{getPositionDiffArrow(calculatePositionDiff(team.id))} {calculatePositionDiff(team.id)}</TableCell>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{team.name}</TableCell>
            <TableCell>{team.points || 0}</TableCell>
            <TableCell>{team.goalsFor || 0}</TableCell>
            <TableCell>{team.goalsAgainst || 0}</TableCell>
            <TableCell>{(team.goalsFor || 0) - (team.goalsAgainst || 0)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

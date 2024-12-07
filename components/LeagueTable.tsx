import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Team } from '../types/game';

interface LeagueTableProps {
  teams: Team[];
}

export function LeagueTable({ teams }: LeagueTableProps) {
  const sortedTeams = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Position</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>GF</TableHead>
          <TableHead>GA</TableHead>
          <TableHead>GD</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTeams.map((team, index) => (
          <TableRow key={team.name}>
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

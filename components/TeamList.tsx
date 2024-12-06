import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Player {
  name: string;
  skills: {
    shooting: number;
    passing: number;
    defending: number;
    workrate: number;
  };
}

interface TeamListProps {
  players: Player[];
}

export function TeamList({ players }: TeamListProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Players</CardTitle>
      </CardHeader>
      <CardContent className="flex">
        <ScrollArea className="h-[300px] w-full rounded-md border p-4 flex flex-row">
          {players.map((player) => (
            <div key={player.name} className="mb-4 last:mb-0">
              <h3 className="font-semibold">{player.name}</h3>
              <div className="text-sm text-muted-foreground">
                <p>Shooting: {player.skills.shooting}</p>
                <p>Passing: {player.skills.passing}</p>
                <p>Defending: {player.skills.defending}</p>
                <p>Workrate: {player.skills.workrate}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


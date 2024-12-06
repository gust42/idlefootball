import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Player } from '../types/game';

interface TrainingComponentProps {
  players: Player[];
  onStartTraining: (playerName: string, stat: keyof Player['skills']) => void;
}

export function TrainingComponent({ players, onStartTraining }: TrainingComponentProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <Card key={player.name}>
          <CardHeader>
            <CardTitle>{player.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(player.skills).map(([stat, value]) => (
              <div key={stat} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize">{stat}: {value}</span>
                  <Button 
                    onClick={() => onStartTraining(player.name, stat as keyof Player['skills'])}
                    disabled={player.training}
                    size="sm"
                  >
                    {player.training && player.training.stat === stat ? 'Training...' : 'Train'}
                  </Button>
                </div>
                {player.training && player.training.stat === stat && (
                  <Progress value={(10 - player.training.ticksRemaining) * 10} />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


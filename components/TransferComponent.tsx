"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Player } from "../types/game";

interface TransferComponentProps {
  availablePlayers: Player[];
  onTransferPlayer: (player: Player) => void;
  money: number;
}

export function TransferComponent({
  availablePlayers,
  onTransferPlayer,
  money,
}: TransferComponentProps) {
  const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const getRandomPlayers = (count: number): Player[] => {
      const shuffled = [...availablePlayers].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    setDisplayedPlayers(getRandomPlayers(5));
  }, [availablePlayers]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transfer Market</h2>
      <p className="mb-4">Available Funds: ${money.toLocaleString()}</p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {displayedPlayers.map((player) => (
          <Card key={player.name} className="w-full">
            <CardHeader>
              <CardTitle>{player.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div>SHO: {player.skills.shooting}</div>
                <div>PAS: {player.skills.passing}</div>
                <div>DEF: {player.skills.defending}</div>
                <div>WOR: {player.skills.workrate}</div>
              </div>
              <div className="mb-2">
                <p className="text-xs font-semibold mb-1">Positions:</p>
                <div className="flex flex-wrap gap-1">
                  {player.preferredPositions.map((position) => (
                    <Badge
                      key={position}
                      variant="secondary"
                      className="text-xs"
                    >
                      {position}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm font-semibold mb-2">
                Cost: ${player.transferCost.toLocaleString()}
              </p>
              <Button
                onClick={() => onTransferPlayer(player)}
                className="w-full"
                disabled={money < player.transferCost}
              >
                Transfer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

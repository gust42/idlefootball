import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "../types/game";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface PlayerCardsProps {
  players: Player[];
}

export function PlayerCards({ players }: PlayerCardsProps) {
  return (
    <Droppable droppableId="availablePlayers" direction="horizontal">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-wrap gap-2"
        >
          {players.map((player, index) => (
            <Draggable
              key={player.id.toString()}
              draggableId={player.id.toString()}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`transition-shadow duration-200 ${
                    snapshot.isDragging ? "shadow-lg" : ""
                  }`}
                >
                  <Card className="w-[140px] h-[160px]">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{player.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-1 text-xs mb-2">
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
                              className="text-[10px] px-1 py-0"
                            >
                              {position}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

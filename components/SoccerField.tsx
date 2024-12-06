import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Player } from '../types/game';

interface Position {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface SoccerFieldProps {
  players: Player[];
}

const positions: Position[] = [
  { id: 'goalkeeper', name: 'GK', x: 50, y: 90 },
  { id: 'defender1', name: 'LB', x: 20, y: 70 },
  { id: 'defender2', name: 'CB', x: 40, y: 70 },
  { id: 'defender3', name: 'CB', x: 60, y: 70 },
  { id: 'defender4', name: 'RB', x: 80, y: 70 },
  { id: 'midfielder1', name: 'LM', x: 20, y: 40 },
  { id: 'midfielder2', name: 'CM', x: 40, y: 40 },
  { id: 'midfielder3', name: 'CM', x: 60, y: 40 },
  { id: 'midfielder4', name: 'RM', x: 80, y: 40 },
  { id: 'forward1', name: 'ST', x: 35, y: 10 },
  { id: 'forward2', name: 'ST', x: 65, y: 10 },
];

export function SoccerField({ players }: SoccerFieldProps) {
  return (
    <div className="relative w-full h-[600px] bg-green-600 border-2 border-white rounded-lg overflow-hidden">
      {/* Field markings */}
      <div className="absolute top-[5%] left-[5%] right-[5%] bottom-[5%] border-2 border-white rounded-lg"></div>
      <div className="absolute top-1/2 left-[5%] right-[5%] h-0 border-t-2 border-white"></div>
      <div className="absolute top-[5%] left-1/2 w-0 h-[90%] border-l-2 border-white"></div>
      <div className="absolute top-[40%] left-[30%] right-[30%] h-[20%] border-2 border-white"></div>
      <div className="absolute top-[45%] left-[45%] w-[10%] h-[10%] border-2 border-white rounded-full"></div>

      {positions.map((position) => (
        <Droppable key={position.id} droppableId={position.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{
                top: `${position.y}%`,
                left: `${position.x}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {(() => {
                const player = players.find(p => p && p.id != null && p.position === position.id);
                return player ? (
                  <Draggable
                    key={player.id.toString()}
                    draggableId={player.id.toString()}
                    index={0}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`w-full h-full rounded-full flex items-center justify-center ${
                          snapshot.isDragging ? 'bg-green-400' :
                            player.preferredPositions.includes(position.name)
                              ? 'bg-green-500'
                              : 'bg-red-500'
                        }`}
                      >
                        {player.name.split(' ')[0]}
                      </div>
                    )}
                  </Draggable>
                ) : (
                  position.name
                );
              })()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
}


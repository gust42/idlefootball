"use client";
import React from "react";
import { useGameLoop } from "../hooks/useGameLoop";
import { PlayerCards } from "./PlayerCards";
import { SoccerField } from "./SoccerField";
import { Player } from "../types/game";
import { TrainingComponent } from "./TrainingComponent";
import { MatchesComponent } from "./MatchesComponent";
import { TransferComponent } from "./TransferComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

export function GameComponent() {
  const { gameState, addMessage } = useGameLoop();
  const { currentTeam, money, players, availablePlayers, teams, schedule, leagueTable, currentRound } = gameState;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === "availablePlayers" && result.destination.droppableId !== "availablePlayers") {
      const player = players.find((p) => p.id.toString() === result.draggableId);
      if (player) {
        addMessage({
          type: "UPDATE_PLAYER_POSITION",
          payload: { newPosition: result.destination.droppableId, player },
        });
      }
    } else if (result.source.droppableId !== "availablePlayers" && result.destination.droppableId === "availablePlayers") {
      addMessage({
        type: "REMOVE_PLAYER_POSITION",
        payload: { playerId: parseInt(result.draggableId) },
      });
    } else if (result.source.droppableId !== "availablePlayers" && result.destination.droppableId !== "availablePlayers") {
      addMessage({
        type: "SWAP_PLAYER_POSITIONS",
        payload: { sourcePosition: result.source.droppableId, destPosition: result.destination.droppableId },
      });
    }
  };

  const handleStartTraining = (playerName: string, stat: keyof Player["skills"]) => {
    const player = players.find((p) => p.name === playerName);
    if (player) {
      addMessage({
        type: "START_TRAINING",
        payload: { playerId: player.id, stat },
      });
    }
  };

  const handleTransferPlayer = (player: Player) => {
    addMessage({
      type: "TRANSFER_PLAYER",
      payload: player,
    });
  };

  console.log(currentRound);

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="team">
        <TabsList>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
        </TabsList>
        <TabsContent value="team">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2">
                <PlayerCards players={players} />
              </div>
              <div className="md:w-1/2">
                <SoccerField players={currentTeam} />
              </div>
            </div>
          </DragDropContext>
        </TabsContent>
        <TabsContent value="training">
          <TrainingComponent players={players} onStartTraining={handleStartTraining} />
        </TabsContent>
        <TabsContent value="matches">
          <MatchesComponent teams={teams} schedule={schedule} currentRound={currentRound}/>
        </TabsContent>
        <TabsContent value="transfer">
          <TransferComponent availablePlayers={availablePlayers} onTransferPlayer={handleTransferPlayer} money={money} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
import { DragDropContext, DropResult } from "react-beautiful-dnd";

export function GameComponent() {
  const { gameState, addMessage } = useGameLoop();
  const { currentTeam, money, players, availablePlayers, teams } = gameState;

  const handleAddPlayer = (player: Player) => {
    addMessage({ type: "ADD_PLAYER", payload: player });
  };

  const handleTransferPlayer = (player: Player) => {
    if (money >= player.transferCost) {
      addMessage({ type: "TRANSFER_PLAYER", payload: player });
    }
  };

  const handleStartTraining = (
    playerName: string,
    stat: keyof Player["skills"]
  ) => {
    addMessage({ type: "START_TRAINING", payload: { playerName, stat } });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (
      source.droppableId === "availablePlayers" &&
      destination.droppableId !== "availablePlayers"
    ) {
      const player = players[source.index];
      if (player && player.id) {
        addMessage({
          type: "UPDATE_PLAYER_POSITION",
          payload: { player, newPosition: destination.droppableId },
        });
      }
    } else if (
      source.droppableId !== "availablePlayers" &&
      destination.droppableId === "availablePlayers"
    ) {
      const player = currentTeam.find(
        (p) => p && p.id && p.position === source.droppableId
      );
      if (player && player.id) {
        addMessage({
          type: "REMOVE_PLAYER_POSITION",
          payload: { playerId: player.id },
        });
      }
    } else if (
      source.droppableId !== "availablePlayers" &&
      destination.droppableId !== "availablePlayers"
    ) {
      addMessage({
        type: "SWAP_PLAYER_POSITIONS",
        payload: {
          sourcePosition: source.droppableId,
          destPosition: destination.droppableId,
        },
      });
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Team Management</h1>
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>
        <TabsContent value="team">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Available Players
                </h2>
                <PlayerCards players={players} onAddPlayer={handleAddPlayer} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Your Team</h2>
                <SoccerField players={currentTeam} />
              </div>
            </div>
          </DragDropContext>
        </TabsContent>
        <TabsContent value="training">
          <TrainingComponent
            players={players}
            onStartTraining={handleStartTraining}
          />
        </TabsContent>
        <TabsContent value="transfers">
          <TransferComponent
            availablePlayers={availablePlayers}
            onTransferPlayer={handleTransferPlayer}
            money={money}
          />
        </TabsContent>
        <TabsContent value="matches">
          <MatchesComponent teams={teams} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

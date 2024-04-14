"use client";

import ContainerComponent from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { dfaMinimizationRepository } from "@/lib/repositories/dfa-minimization";
import mermaid from "mermaid";
import dynamic from "next/dynamic";
import { useState } from "react";

const MermaidComponent = dynamic(() => import("@/components/mermaid"), {
  ssr: false,
});

export default function Page() {
  const placeholderRelations = "A,B\nC,D\n...";

  const [alphabets, setAlphabets] = useState("0,1");
  const [states, setStates] = useState("A,B,C,D,E,F,G,H");
  const [startState, setStartState] = useState("A");
  const [acceptingStates, setAcceptingStates] = useState("E");
  const [relations, setRelations] = useState(
    "C,D\nH,D\nF,E\nE,F\nA,E\nF,B\nE,F\nF,E"
  );

  const [diagram, setDiagram] = useState({
    show: -1,
    initial: "",
    minified: "",
  });

  const onClickButtonGenerate = () => {
    setDiagram({
      ...diagram,
      initial: dfaMinimizationRepository.generateDiagramCode({
        alphabets: alphabets.toLowerCase(),
        states: states.toLowerCase(),
        startState: startState.toLowerCase(),
        finalStates: acceptingStates.toLowerCase(),
        transitions: relations.toLowerCase(),
      }),
      minified: dfaMinimizationRepository.generateDiagramCode(
        dfaMinimizationRepository.generateMinimization({
          alphabets: alphabets.toLowerCase(),
          states: states.toLowerCase(),
          startState: startState.toLowerCase(),
          finalStates: acceptingStates.toLowerCase(),
          transitions: relations.toLowerCase(),
        })
      ),
    });
  };

  const onClickReloadDiagram = () => {
    mermaid.contentLoaded();
  };

  return (
    <>
      <ContainerComponent safeTop variant="md" className="py-8">
        <p className="text-2xl font-semibold">Minimalisasi DFA</p>

        <Label>Masukkan alphabets</Label>
        <Input
          placeholder="0,1"
          value={alphabets}
          onChange={(e) => setAlphabets(e.target.value)}
          className="lowercase"
        />

        <Label>Masukkan states</Label>
        <Input
          placeholder="A,B,C,D,E,..."
          value={states}
          onChange={(e) => setStates(e.target.value)}
          className="lowercase"
        />

        <Label>Masukkan start state</Label>
        <Input
          placeholder="A"
          value={startState}
          onChange={(e) => setStartState(e.target.value)}
          className="lowercase"
        />

        <Label>Masukkan accepting state</Label>
        <Input
          placeholder="A,B,..."
          value={acceptingStates}
          onChange={(e) => setAcceptingStates(e.target.value)}
          className="lowercase"
        />

        <Label>Masukkan relasi atau hubungan</Label>
        <Textarea
          placeholder={placeholderRelations}
          value={relations}
          onChange={(e) => setRelations(e.target.value)}
          className="lowercase resize-none min-h-64"
        />

        <Button onClick={onClickButtonGenerate}>Generate</Button>
        <div>
          <Button onClick={() => setDiagram({ ...diagram, show: -1 })}>
            Hide diagram
          </Button>
          <Button onClick={() => setDiagram({ ...diagram, show: 0 })}>
            Initial diagram
          </Button>
          <Button onClick={() => setDiagram({ ...diagram, show: 1 })}>
            Minified diagram
          </Button>
        </div>

        {diagram.show !== -1 && (
          <MermaidComponent
            id="diagram"
            chart={diagram.show === 0 ? diagram.initial : diagram.minified}
          />
        )}
      </ContainerComponent>
    </>
  );
}

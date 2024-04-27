"use client";

import BreadCrumbComponent from "@/components/breadcrumb";
import ContainerComponent from "@/components/container";
import DiagramInputComponent from "@/components/diagram-input";
import JsonViewComponent from "@/components/json-view";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DiagramInputEpsilonTransitionsProps,
  DiagramInputTransitionsProps,
} from "@/lib/types/types";
import { Dices, RotateCcw, Wand } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [alphabets, setAlphabets] = useState("");
  const [states, setStates] = useState("");
  const [startState, setStartState] = useState("");
  const [finalStates, setFinalStates] = useState("");
  const [transitions, setTransitions] = useState<DiagramInputTransitionsProps>(
    {}
  );
  const [epsilonTransitions, setEpsilonTransitions] =
    useState<DiagramInputEpsilonTransitionsProps>({});

  const [diagramType, setDiagramType] = useState<string>();

  return (
    <>
      <ContainerComponent safeTop className="py-8">
        <BreadCrumbComponent
          items={[
            { href: "/", label: "Halaman Utama" },
            { href: "/v2/nfa-enfa-converter", label: "NFA, E-NFA Konverter" },
          ]}
        />

        <p className="mt-4 font-semibold text-3xl">NFA, E-NFA Konverter</p>
        <p className="mt-2">
          Simulator untuk menghasilkan sebuah DFA berdasarkan masukan NFA atau
          E-NFA dari pengguna
        </p>

        <section className="mt-8">
          <div className="space-y-1">
            <Label>Pilih jenis finite automata</Label>
            <Select
              value={diagramType}
              onValueChange={(e) => setDiagramType(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Jenis finite automata" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nfa">
                  NFA (Nondeterministic Finite Automata)
                </SelectItem>
                <SelectItem value="enfa">
                  E-NFA (Epsilon Nondeterministic Finite Automata)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {diagramType && (
            <DiagramInputComponent
              className="mt-4"
              diagramType={diagramType}
              input={{
                alphabets,
                states,
                startState,
                finalStates,
                transitions,
                epsilonTransitions,

                setAlphabets,
                setStates,
                setStartState,
                setFinalStates,
                setTransitions,
                setEpsilonTransitions,
              }}
            />
          )}

          <div className="flex items-center gap-1 justify-end mt-8">
            <Button variant={"secondary"}>
              <Dices className="h-4 w-4 mr-2" />
              Contoh
            </Button>
            <Button variant={"destructive"}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button>
              <Wand className="h-4 w-4 mr-2" />
              Ubah
            </Button>
          </div>

          <JsonViewComponent data={transitions} />
          <JsonViewComponent data={epsilonTransitions} />
        </section>
      </ContainerComponent>
    </>
  );
}

"use client";

import BreadCrumbComponent from "@/components/breadcrumb";
import ContainerComponent from "@/components/container";
import DiagramInputComponent from "@/components/diagram-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Dices, RotateCcw, SpellCheck } from "lucide-react";
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

  const [inputFAType, setInputFAType] = useState<
    "dfa" | "nfa" | "enfa" | "regex" | string
  >("");

  return (
    <>
      <ContainerComponent safeTop className="py-8">
        <BreadCrumbComponent
          items={[
            { href: "/", label: "Halaman Utama" },
            {
              href: "/v2/fa-validator",
              label: "DFA, NFA, E-NFA, Regex Validator",
            },
          ]}
        />

        <p className="text-3xl font-semibold mt-4">
          DFA, NFA, E-NFA, Regex Validator
        </p>
        <p className="mt-2">
          Simulator untuk mengetes DFA, NFA, E-NFA, ataupun Regex terhadap
          masukan berupa string, apakah akan di-accept atau di-reject
        </p>

        <section className="mt-8">
          <div className="space-y-1">
            <Label>Pilih jenis finite automata</Label>
            <Select
              value={inputFAType}
              onValueChange={(e) => setInputFAType(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Jenis finite automata" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dfa">
                  Deterministic Finite Automata
                </SelectItem>
                <SelectItem value="nfa">
                  Nondeterministic Finite Automata
                </SelectItem>
                <SelectItem value="enfa">
                  Epsilon Nondeterministic Finite Automata
                </SelectItem>
                <SelectItem value="regex">Regular Expression</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inputFAType &&
            (inputFAType === "regex" ? (
              <>
                <div className="space-y-1 mt-2">
                  <Label>Masukkan regular expression</Label>
                  <Input />
                </div>
              </>
            ) : (
              <>
                <DiagramInputComponent
                  className="mt-2"
                  diagramType={inputFAType}
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
              </>
            ))}

          <div className="mt-6">
            <p className="text-lg font-semibold">String Uji</p>
            <p>
              Masukkan string yang akan diuji sesuai dengan kombinasi alphabets
              (a,b,c)
            </p>
            <Input className="mt-4" />
          </div>

          <div className="flex items-center justify-end gap-1 mt-8">
            <Button variant={"secondary"}>
              <Dices className="w-4 h-4 mr-2" />
              Contoh
            </Button>
            <Button variant={"destructive"}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button>
              <SpellCheck className="w-4 h-4 mr-2" />
              Cek
            </Button>
          </div>
        </section>
      </ContainerComponent>
    </>
  );
}

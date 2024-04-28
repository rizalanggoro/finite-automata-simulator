"use client";

import enfaConverterExamples from "@/assets/examples/enfa-converter.json";
import nfaConverterExamples from "@/assets/examples/nfa-converter.json";
import BreadCrumbComponent from "@/components/breadcrumb";
import ContainerComponent from "@/components/container";
import DiagramInputComponent from "@/components/diagram-input";
import MermaidComponent from "@/components/mermaid";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { dataConverterRepository } from "@/lib/repositories/v2/data-converter";
import { diagramRepository } from "@/lib/repositories/v2/diagram";
import { enfaConverterRepository } from "@/lib/repositories/v2/enfa-converter";
import { nfaConverterRepository } from "@/lib/repositories/v2/nfa-converter";
import {
  DFADataProps,
  DiagramInputEpsilonTransitionsProps,
  DiagramInputTransitionsProps,
} from "@/lib/types/types";
import { Dices, RotateCcw, Wand } from "lucide-react";
import { useEffect, useState } from "react";

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

  const [inputDiagramType, setInputDiagramType] = useState<string>();
  const [isGenerated, setIsGenerated] = useState(false);
  const [exampleIndex, setExampleIndex] = useState({
    nfa: 0,
    enfa: 0,
  });
  const [diagrams, setDiagrams] = useState({
    initial: "",
    result: "",
  });
  const [result, setResult] = useState<{
    others: {
      reachableStates: string[];
      newTransitions: {
        [key: string]: {
          [key: string]: string;
        };
      };
      newFinalStates: string[];
    };
    dfaData: DFADataProps;
  }>();

  const { toast } = useToast();

  const onClickButtonExample = () => {
    if (inputDiagramType) {
      if (inputDiagramType === "nfa") {
        const exampleCount = nfaConverterExamples.length;

        const example = nfaConverterExamples[exampleIndex.nfa];
        setAlphabets(example.alphabets.join(","));
        setStates(example.states.join(","));
        setStartState(example.startState);
        setFinalStates(example.finalStates.join(","));
        setTimeout(() => setTransitions(example.transitions as any), 100);

        setExampleIndex({
          ...exampleIndex,
          nfa: exampleIndex.nfa < exampleCount - 1 ? exampleIndex.nfa + 1 : 0,
        });
        toast({
          description:
            "Berhasil menggunakan contoh NFA konverter ke-" +
            (exampleIndex.nfa + 1) +
            " dari " +
            exampleCount,
        });
      } else if (inputDiagramType === "enfa") {
        const exampleCount = enfaConverterExamples.length;

        const example = enfaConverterExamples[exampleIndex.enfa];
        setAlphabets(example.alphabets.join(","));
        setStates(example.states.join(","));
        setStartState(example.startState);
        setFinalStates(example.finalStates.join(","));
        setTimeout(() => setTransitions(example.transitions as any), 100);
        setTimeout(
          () => setEpsilonTransitions(example.epsilonTransitions as any),
          100
        );

        setExampleIndex({
          ...exampleIndex,
          enfa:
            exampleIndex.enfa < exampleCount - 1 ? exampleIndex.enfa + 1 : 0,
        });
        toast({
          description:
            "Berhasil menggunakan contoh E-NFA konverter ke-" +
            (exampleIndex.enfa + 1) +
            " dari " +
            exampleCount,
        });
      }
      setIsGenerated(false);
    }
  };

  const onClickButtonReset = () => {
    setAlphabets("");
    setStates("");
    setStartState("");
    setFinalStates("");
    setTransitions({});
    setEpsilonTransitions({});

    setInputDiagramType("");
    setIsGenerated(false);
    setDiagrams({ initial: "", result: "" });
  };

  const onClickButtonGenerate = () => {
    if (inputDiagramType) {
      if (inputDiagramType === "nfa") {
        const data = dataConverterRepository.convertNFAInput({
          alphabets,
          states,
          startState,
          finalStates,
          transitions,
        });
        const result = nfaConverterRepository.convertNFAToDFA(data);

        setResult(result);
        setDiagrams({
          initial: diagramRepository.generateNFA(data),
          result: diagramRepository.generateDFA(result.dfaData),
        });
        setIsGenerated(true);
      } else if (inputDiagramType === "enfa") {
        const data = dataConverterRepository.convertENFAInput({
          alphabets,
          states,
          startState,
          finalStates,
          transitions,
          epsilonTransitions,
        });
        const nfaData = enfaConverterRepository.convertENFAToNFA(data);
        const result = nfaConverterRepository.convertNFAToDFA(nfaData.nfaData);

        setResult(result);
        setDiagrams({
          initial: diagramRepository.generateE_NFA(data),
          result: diagramRepository.generateDFA(result.dfaData),
        });
        setIsGenerated(true);
      }
    }
  };

  useEffect(() => {
    setAlphabets("");
    setStates("");
    setStartState("");
    setFinalStates("");
    setTransitions({});
    setEpsilonTransitions({});

    setIsGenerated(false);
    setDiagrams({ initial: "", result: "" });
  }, [inputDiagramType]);

  useEffect(() => {
    setIsGenerated(false);
  }, [
    alphabets,
    states,
    startState,
    finalStates,
    transitions,
    epsilonTransitions,
  ]);

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
              value={inputDiagramType}
              onValueChange={(e) => setInputDiagramType(e)}
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

          {inputDiagramType && (
            <DiagramInputComponent
              className="mt-4"
              diagramType={inputDiagramType}
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
            <Button variant={"secondary"} onClick={onClickButtonExample}>
              <Dices className="h-4 w-4 mr-2" />
              Contoh
            </Button>
            <Button variant={"destructive"} onClick={onClickButtonReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={onClickButtonGenerate} disabled={isGenerated}>
              <Wand className="h-4 w-4 mr-2" />
              Ubah
            </Button>
          </div>
        </section>

        {isGenerated && result && (
          <>
            <Separator className="mt-8" />

            <section className="mt-8">
              <p className="font-semibold text-xl">Transitions Table</p>
              <p>
                Berikut adalah tabel transisi hasil konversi{" "}
                {inputDiagramType === "nfa" ? "NFA" : "Epsilon NFA"} menjadi DFA
              </p>

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    {result.dfaData.alphabets.map((alphabet, index) => (
                      <TableHead key={"transitions-table-head-" + index}>
                        {alphabet}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.dfaData.states.map((state, index) => {
                    const isStartState = state === result.dfaData.startState;
                    const isFinalState =
                      result.dfaData.finalStates.includes(state);
                    const transition = result.dfaData.transitions[state];

                    return (
                      <TableRow key={"transitions-table-body-" + index}>
                        <TableCell>
                          {isStartState && "-> "}
                          {isFinalState && "*"}
                          {state}
                        </TableCell>

                        {result.dfaData.alphabets.map((alphabet, index2) => (
                          <TableCell
                            key={"transitions-table-body-" + index + index2}
                          >
                            {transition[alphabet] === "empty"
                              ? "∅"
                              : transition[alphabet]}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </section>

            <section className="mt-8">
              <p className="font-semibold text-xl">State Diagram</p>
              <p>
                Berikut adalah state diagram awal dari{" "}
                {inputDiagramType === "nfa" ? "NFA" : "Epsilon NFA"} dan hasil
                konversi menjadi DFA berdasarkan masukan yang berhubungan
              </p>

              <Tabs defaultValue="initial" className="mt-4">
                <TabsList className="w-full grid grid-cols-2 gap-2">
                  <TabsTrigger value="initial">
                    {inputDiagramType === "nfa" ? "NFA" : "E-NFA"}
                  </TabsTrigger>
                  <TabsTrigger value="result">DFA</TabsTrigger>
                </TabsList>
                <TabsContent value="initial">
                  <MermaidComponent
                    id="mermaid-initial-state-diagram"
                    chart={diagrams.initial}
                  />
                </TabsContent>
                <TabsContent value="result">
                  <MermaidComponent
                    id="mermaid-result-state-diagram"
                    chart={diagrams.result}
                  />
                </TabsContent>
              </Tabs>
            </section>
          </>
        )}
      </ContainerComponent>
    </>
  );
}

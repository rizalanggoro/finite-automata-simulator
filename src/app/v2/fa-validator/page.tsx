"use client";

import dfaValidatorExamples from "@/assets/examples/dfa-validator.json";
import nfaValidatorExamples from "@/assets/examples/nfa-validator.json";
import BreadCrumbComponent from "@/components/breadcrumb";
import ContainerComponent from "@/components/container";
import DiagramInputComponent from "@/components/diagram-input";
import MermaidComponent from "@/components/mermaid";
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { dataConverterRepository } from "@/lib/repositories/v2/data-converter";
import { diagramRepository } from "@/lib/repositories/v2/diagram";
import { inputValidatorRepository } from "@/lib/repositories/v2/input-validator";
import {
  DiagramInputEpsilonTransitionsProps,
  DiagramInputTransitionsProps,
} from "@/lib/types/types";
import { generateRandomStrings } from "@/lib/utils";
import { Dices, RotateCcw, SpellCheck } from "lucide-react";
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

  const [inputFAType, setInputFAType] = useState<
    "dfa" | "nfa" | "enfa" | "regex" | string
  >("");
  const [inputString, setInputString] = useState("");
  const [exampleIndex, setExampleIndex] = useState({
    dfa: 0,
    nfa: 0,
    enfa: 0,
    regex: 0,
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [result, setResult] = useState<{
    isAccept: boolean;
    history: {
      str: string;
      from: string;
      to: string | string[];
    }[];
  }>();
  const [diagrams, setDiagrams] = useState<{
    [key: string]: string;
  }>({
    dfa: "",
    nfa: "",
    enfa: "",
    regex: "",
  });
  const { toast } = useToast();

  const onClickButtonExample = () => {
    let exampleCount = 0;
    let index = 0;
    let name = "";

    if (inputFAType === "dfa") {
      exampleCount = dfaValidatorExamples.length;
      index = exampleIndex.dfa + 1;
      const example = dfaValidatorExamples[exampleIndex.dfa];
      name = "DFA";

      setAlphabets(example.alphabets.join(","));
      setStates(example.states.join(","));
      setStartState(example.startState);
      setFinalStates(example.finalStates.join(","));
      setTimeout(() => setTransitions(example.transitions as any), 100);
      setInputString(generateRandomStrings(example.alphabets.join(""), 5));

      setExampleIndex({
        ...exampleIndex,
        dfa: exampleIndex.dfa < exampleCount - 1 ? exampleIndex.dfa + 1 : 0,
      });
    } else if (inputFAType === "nfa") {
      exampleCount = nfaValidatorExamples.length;
      index = exampleIndex.nfa + 1;
      const example = nfaValidatorExamples[exampleIndex.nfa];
      name = "NFA";

      setAlphabets(example.alphabets.join(","));
      setStates(example.states.join(","));
      setStartState(example.startState);
      setFinalStates(example.finalStates.join(","));
      setTimeout(() => setTransitions(example.transitions as any), 100);
      setInputString(generateRandomStrings(example.alphabets.join(""), 5));

      setExampleIndex({
        ...exampleIndex,
        nfa: exampleIndex.nfa < exampleCount - 1 ? exampleIndex.nfa + 1 : 0,
      });
    }

    toast({
      description:
        "Menggunakan contoh " +
        name +
        " validator ke-" +
        index +
        " dari " +
        exampleCount,
    });
    setIsGenerated(false);
  };

  const onClickButtonReset = () => {
    setAlphabets("");
    setStates("");
    setStartState("");
    setFinalStates("");
    setTransitions({});
    setEpsilonTransitions({});
    setInputFAType("");
    setInputString("");
    setIsGenerated(false);
    setResult(undefined);
  };

  const onClickButtonCheck = () => {
    if (inputFAType === "dfa") {
      const dfaData = dataConverterRepository.convertDFAInput({
        alphabets,
        states,
        startState,
        finalStates,
        transitions,
      });
      const result = inputValidatorRepository.validateInputForDFA(
        dfaData,
        inputString
      );

      setResult(result);
      setDiagrams({ ...diagrams, dfa: diagramRepository.generateDFA(dfaData) });
      setIsGenerated(true);
    } else if (inputFAType === "nfa") {
      const data = dataConverterRepository.convertNFAInput({
        alphabets,
        states,
        startState,
        finalStates,
        transitions,
      });
      const result = inputValidatorRepository.validateInputForNFA(
        data,
        inputString
      );

      setResult(result);
      setDiagrams({ ...diagrams, nfa: diagramRepository.generateNFA(data) });
      setIsGenerated(true);
    }
  };

  const onClickButtonExampleInputString = () => {
    if (alphabets) {
      const len = Math.floor(Math.random() * 8) + 3;
      setInputString(generateRandomStrings(alphabets.replaceAll(",", ""), len));
    }
  };

  useEffect(() => {
    setAlphabets("");
    setStates("");
    setStartState("");
    setFinalStates("");
    setTransitions({});
    setEpsilonTransitions({});
    setInputString("");
    setIsGenerated(false);
    setResult(undefined);
  }, [inputFAType]);

  useEffect(() => {
    setIsGenerated(false);
  }, [
    alphabets,
    states,
    startState,
    finalStates,
    transitions,
    epsilonTransitions,
    inputString,
  ]);

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

          {alphabets && (
            <div className="mt-6">
              <p className="text-lg font-semibold">String Uji</p>
              <p>
                Masukkan string yang akan diuji sesuai dengan kombinasi
                alphabets ({alphabets})
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Input
                  className="flex-1"
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value.toLowerCase())}
                />
                <Button
                  size={"icon"}
                  variant={"secondary"}
                  onClick={onClickButtonExampleInputString}
                >
                  <Dices className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-1 mt-8">
            <Button variant={"secondary"} onClick={onClickButtonExample}>
              <Dices className="w-4 h-4 mr-2" />
              Contoh
            </Button>
            <Button variant={"destructive"} onClick={onClickButtonReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={onClickButtonCheck} disabled={isGenerated}>
              <SpellCheck className="w-4 h-4 mr-2" />
              Cek
            </Button>
          </div>
        </section>

        {isGenerated && result && (
          <>
            <Separator className="mt-8" />

            <section className="mt-8">
              <p className="font-semibold text-xl">Transitions Table</p>
              <p>
                Berikut adalah tabel transisi perpindahan string antar state
                berdasarkan input string yang diberikan
              </p>

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Step</TableHead>
                    <TableHead>String</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.history.map((item, index) => {
                    return (
                      <TableRow key={"transitions-table-body-row-" + index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.str}</TableCell>
                        <TableCell>{item.from}</TableCell>
                        <TableCell>
                          {Array.isArray(item.to)
                            ? item.to.length > 0
                              ? item.to.join(",")
                              : "∅"
                            : item.to
                            ? item.to
                            : "∅"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Acceptances</TableCell>
                    <TableCell colSpan={3}>{String(result.isAccept)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </section>

            <section className="mt-8">
              <p className="font-semibold text-xl">State Diagram</p>
              <p>
                Berikut adalah state diagram dari DFA berdasarkan masukan yang
                diberikan
              </p>

              <MermaidComponent
                id="state-diagram"
                chart={diagrams[inputFAType]}
              />
            </section>
          </>
        )}
      </ContainerComponent>
    </>
  );
}

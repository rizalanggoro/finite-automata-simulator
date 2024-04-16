"use client";

import ContainerComponent from "@/components/container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { diagramRepository } from "@/lib/repositories/diagram";
import { eNFAConverterRepository } from "@/lib/repositories/e-nfa-converter";
import { nfaConverterRepository } from "@/lib/repositories/nfa-converter";
import { E_NFA2DFADataProps, NFA2DFADataProps } from "@/lib/types/types";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import ComponentTableE_NFA from "./table-e-nfa";
import ComponentTableNFA from "./table-nfa";

const MermaidComponent = dynamic(() => import("@/components/mermaid"), {
  ssr: false,
});

export default function Page() {
  // const [alphabets, setAlphabets] = useState("a,b");
  // const [states, setStates] = useState("q0,q1,q2");
  // const [startState, setStartState] = useState("q0");
  // const [finalStates, setFinalStates] = useState("q2");
  // const [faType, setFaType] = useState("nfa");
  // const [transitions, setTransitions] = useState<{
  //   [key: string]: string;
  // }>({
  //   q0: "q0,q1;q0",
  //   q1: ";q2",
  //   q2: ";",
  // });
  const [alphabets, setAlphabets] = useState("a,b");
  const [states, setStates] = useState("q0,q1,q2,q3,q4");
  const [startState, setStartState] = useState("q0");
  const [finalStates, setFinalStates] = useState("q4");
  const [faType, setFaType] = useState("e-nfa");
  const [transitions, setTransitions] = useState<{
    [key: string]: string;
  }>({
    q0: ";",
    q1: "q2;q4",
    q2: ";",
    q3: ";",
    q4: ";",
  });
  const [epsilons, setEpsilons] = useState<{
    [key: string]: string;
  }>({
    q0: "q1",
    q1: "q3",
    q2: "q4",
    q3: "",
    q4: "",
  });
  // const [alphabets, setAlphabets] = useState("0,1");
  // const [states, setStates] = useState("a,b,c,d,e,f");
  // const [startState, setStartState] = useState("a");
  // const [finalStates, setFinalStates] = useState("d");
  // const [faType, setFaType] = useState("e-nfa");
  // const [transitions, setTransitions] = useState<{
  //   [key: string]: string;
  // }>({
  //   a: "e;b",
  //   b: ";c",
  //   c: ";d",
  //   d: ";",
  //   e: "f;",
  //   f: "d;",
  // });
  // const [epsilons, setEpsilons] = useState<{
  //   [key: string]: string;
  // }>({
  //   a: "",
  //   b: "d",
  //   c: "",
  //   d: "",
  //   e: "b,c",
  //   f: "",
  // });

  const [nfa2dfaData, setNfa2dfaData] = useState<
    NFA2DFADataProps | undefined
  >();
  const [eNfa2dfaData, setENfa2dfaData] = useState<
    E_NFA2DFADataProps | undefined
  >();

  const [diagram, setDiagram] = useState({
    nfa: "",
    eNfa: "",
    dfa: "",
  });

  const onClickButtonGenerate = () => {
    if (faType === "nfa") {
      const result = nfaConverterRepository.generateDFA({
        alphabets: alphabets.toLowerCase(),
        states: states.toLowerCase(),
        startState: startState.toLowerCase(),
        finalStates: finalStates.toLowerCase(),
        transitions: transitions,
      });

      setNfa2dfaData(result);
      setDiagram({
        ...diagram,
        nfa: diagramRepository.generateNFA(result.nfaData),
        dfa: diagramRepository.generateDFA(result.dfaData),
      });
    } else {
      const result = eNFAConverterRepository.generateDFA({
        alphabets: alphabets.toLowerCase(),
        states: states.toLowerCase(),
        startState: startState.toLowerCase(),
        finalStates: finalStates.toLowerCase(),
        transitions: transitions,
        epsilons,
      });

      console.log({ result });

      setENfa2dfaData(result);
      setDiagram({
        ...diagram,
        eNfa: diagramRepository.generateE_NFA(result.eNfaData),
        dfa: diagramRepository.generateDFA(result.dfaData),
      });
    }
  };

  return (
    <>
      <ContainerComponent variant="md" safeTop className="py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/nfa-enfa-converter">
                NFA, E-NFA Converter
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <p className="font-semibold text-3xl mt-4">NFA, e-NFA Converter</p>
        <p className="mt-2">
          Simulator untuk menghasilkan sebuah DFA berdasarkan masukan NFA atau
          e-NFA dari pengguna
        </p>

        <div className="mt-8 space-y-2">
          <div className="space-y-1">
            <Label>Masukkan alphabets</Label>
            <Input
              placeholder="0,1,..."
              value={alphabets}
              onChange={(e) => setAlphabets(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Masukkan states</Label>
            <Input
              placeholder="0,1,..."
              value={states}
              onChange={(e) => setStates(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Masukkan start state</Label>
            <Input
              placeholder="0,1,..."
              value={startState}
              onChange={(e) => setStartState(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Masukkan final states</Label>
            <Input
              placeholder="0,1,..."
              value={finalStates}
              onChange={(e) => setFinalStates(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Pilih jenis finite automata</Label>
            <Select defaultValue={faType} onValueChange={(v) => setFaType(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Jenis finite automata" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nfa">NFA</SelectItem>
                <SelectItem value="e-nfa">Epsilon NFA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-lg font-semibold pt-4">Transitions</p>
            <p>
              Pisahkan setiap state menggunakan tanda koma (,) dan setiap
              hubungan dengan tanda titik koma (;)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {states.split(",").map((state, indexState) => (
              <div className="space-y-1" key={"input-transition-" + indexState}>
                <Label>
                  Masukkan transition ({state}{" "}
                  <ArrowRight className="w-3 h-3 inline" />{" "}
                  {alphabets.replaceAll(",", ";")})
                </Label>
                <Input
                  placeholder="0,1;0,1;..."
                  value={transitions[state]}
                  onChange={(e) =>
                    setTransitions({
                      ...transitions,
                      [state]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>

          {faType === "e-nfa" && (
            <>
              <div>
                <p className="text-lg font-semibold pt-4">Epsilon</p>
                <p>Pisahkan setiap state menggunakan tanda koma (,)</p>
              </div>
              <div className="gap-2 grid grid-cols-2">
                {states.split(",").map((item, index) => (
                  <div className="space-y-1" key={"input-epsilon-" + index}>
                    <Label>Masukkan epsilon ({item})</Label>
                    <Input
                      placeholder="0,1,..."
                      value={epsilons[item]}
                      onChange={(e) =>
                        setEpsilons({
                          ...epsilons,
                          [item]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClickButtonGenerate}>Generate</Button>
        </div>

        {faType === "nfa" && nfa2dfaData && (
          <ComponentTableNFA {...nfa2dfaData} />
        )}
        {faType === "e-nfa" && eNfa2dfaData && (
          <ComponentTableE_NFA {...eNfa2dfaData} />
        )}

        {(nfa2dfaData || eNfa2dfaData) && (
          <>
            <Separator className="mt-8" />

            <p className="font-semibold text-2xl mt-8">Diagram</p>
            <p>
              Berikut merupakan diagram {faType === "e-nfa" && "epsilon"}{" "}
              nondeterministic finite automata dan deterministic finite automata
              setelah dilakukan pengkonversian
            </p>

            <Tabs defaultValue="nfa-e-nfa" className="w-full mt-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="nfa-e-nfa">
                  {faType === "nfa" ? "NFA" : "Epsilon NFA"}
                </TabsTrigger>
                <TabsTrigger value="dfa">DFA</TabsTrigger>
              </TabsList>
              <TabsContent value="nfa-e-nfa" className="mt-4">
                <MermaidComponent
                  id="diagram-nfa-e-nfa"
                  chart={faType === "nfa" ? diagram.nfa : diagram.eNfa}
                />
              </TabsContent>
              <TabsContent value="dfa" className="mt-4">
                <MermaidComponent id="diagram-dfa" chart={diagram.dfa} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </ContainerComponent>
    </>
  );
}

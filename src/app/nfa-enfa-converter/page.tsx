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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { diagramRepository } from "@/lib/repositories/diagram";
import { eNFAConverterRepository } from "@/lib/repositories/e-nfa-converter";
import {
  NFA2DFADataProps,
  nfaConverterRepository,
} from "@/lib/repositories/nfa-enfa-converter";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MermaidComponent = dynamic(() => import("@/components/mermaid"), {
  ssr: false,
});

export default function Page() {
  const [alphabets, setAlphabets] = useState("0,1");
  const [states, setStates] = useState("a,b,c,d,e,f");
  const [startState, setStartState] = useState("a");
  const [finalStates, setFinalStates] = useState("d");
  const [faType, setFaType] = useState("e-nfa");
  // const [transitions, setTransitions] = useState("s1;s0,s1;\ns0;s1;");
  const [transitions, setTransitions] = useState<{
    [key: string]: string;
  }>({
    a: "e;b",
    b: ";c",
    c: ";d",
    d: ";",
    e: "f;",
    f: "d;",
  });
  const [epsilons, setEpsilons] = useState<{
    [key: string]: string;
  }>({
    a: "",
    b: "d",
    c: "",
    d: "",
    e: "b,c",
    f: "",
  });

  const [nfa2dfaData, setNfa2dfaData] = useState<
    NFA2DFADataProps | undefined
  >();

  useEffect(() => {
    console.log({ transitions });
  }, [transitions]);

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

      console.log(result);

      setNfa2dfaData(result);

      setDiagram({
        nfa: diagramRepository.generateNFA(result.data),
        eNfa: "",
        dfa: diagramRepository.generateDFA(result.dfaData),
      });
    } else {
      const result = eNFAConverterRepository.generateE_NFA({
        alphabets: alphabets.toLowerCase(),
        states: states.toLowerCase(),
        startState: startState.toLowerCase(),
        finalStates: finalStates.toLowerCase(),
        transitions: transitions,
        epsilons,
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

          {/* <div className="space-y-1">
            <Label>Masukkan transitions</Label>
            <Textarea
              placeholder="0,1,..."
              className="min-h-64 resize-none"
              value={transitions}
              onChange={(e) => setTransitions(e.target.value)}
            />
          </div> */}
          {faType === "e-nfa" && (
            <>
              <div>
                <p className="text-lg font-semibold pt-4">Epsilon</p>
                <p>Pisahkan setiap state menggunakan tanda koma (,)</p>
              </div>
              <div className="gap-2 grid grid-cols-2">
                {states.split(",").map((item) => (
                  <div className="space-y-1">
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

        {nfa2dfaData && (
          <>
            <Separator className="mt-8" />
            <p className="text-2xl font-semibold mt-8">Conversion Table</p>

            <p className="mt-2">
              Berikut tabel nondeterministic finite automata berdasarkan masukan
              yang diberikan sebelum dilakukan konversi{" "}
            </p>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>States</TableHead>
                  {nfa2dfaData.data.alphabets.map((item) => (
                    <TableHead>{item}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(nfa2dfaData.data.transitions).map((item) => {
                  const state = item[0];

                  return (
                    <TableRow>
                      <TableCell>
                        {nfa2dfaData.data.startState === state && (
                          <ArrowRight className="inline w-4 h-4 mr-2" />
                        )}
                        {nfa2dfaData.data.finalStates.includes(state)
                          ? "*"
                          : ""}
                        {state}
                      </TableCell>
                      {nfa2dfaData.data.alphabets.map((alphabet) => {
                        const transition = item[1][alphabet];
                        return (
                          <TableCell>
                            {transition ? transition.join(",") : "∅"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <p className="mt-4">
              Berikut tabel hasil konversi dari nondeterministic finite automata
              menjadi deterministic finite automata
            </p>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>States</TableHead>
                  {nfa2dfaData.data.alphabets.map((item) => (
                    <TableHead>{item}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(nfa2dfaData.dfaTable).map((item) => {
                  const state = item[0];

                  return (
                    <TableRow>
                      <TableCell>
                        {nfa2dfaData.data.startState === state && (
                          <ArrowRight className="inline w-4 h-4 mr-2" />
                        )}
                        {nfa2dfaData.dfaFinalStates.includes(state) ? "*" : ""}
                        {state}
                      </TableCell>
                      {nfa2dfaData.data.alphabets.map((alphabet) => {
                        const transition = item[1][alphabet];
                        return (
                          <TableCell>
                            {transition ? transition.join(",") : "∅"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}

        {nfa2dfaData && diagram && (
          <>
            <Separator className="mt-8" />

            <p className="font-semibold text-2xl mt-8">Diagram</p>

            <Tabs defaultValue="nfa" className="w-full mt-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="nfa">
                  {faType === "nfa" ? "NFA" : "Epsilon NFA"}
                </TabsTrigger>
                <TabsTrigger value="dfa">DFA</TabsTrigger>
              </TabsList>
              <TabsContent value="nfa">
                <MermaidComponent id="diagram-nfa" chart={diagram.nfa} />
              </TabsContent>
              <TabsContent value="dfa">
                <MermaidComponent id="diagram-dfa" chart={diagram.dfa} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </ContainerComponent>
    </>
  );
}

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  DFACheckDataProps,
  DFAMinimizationDataProps,
  dfaMinimizationRepository,
} from "@/lib/repositories/dfa-minimization";
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
  const [checkInputString, setCheckInputString] = useState("1011");

  const [diagram, setDiagram] = useState({
    initial: "",
    minified: "",
  });

  const [dfaMinimizationData, setDfaMinimizationData] = useState<
    DFAMinimizationDataProps | undefined
  >();
  const [dfaCheckInitialData, setDfaCheckInitialData] = useState<
    DFACheckDataProps | undefined
  >();
  const [dfaCheckMinifiedData, setDfaCheckMinifiedData] = useState<
    DFACheckDataProps | undefined
  >();

  const onClickButtonGenerate = () => {
    const minimizationData = dfaMinimizationRepository.generateMinimization({
      alphabets: alphabets.toLowerCase(),
      states: states.toLowerCase(),
      startState: startState.toLowerCase(),
      finalStates: acceptingStates.toLowerCase(),
      transitions: relations.toLowerCase(),
    });

    setDfaMinimizationData(minimizationData);

    setDiagram({
      initial: dfaMinimizationRepository.generateDiagramCode({
        alphabets: alphabets.toLowerCase(),
        states: states.toLowerCase(),
        startState: startState.toLowerCase(),
        finalStates: acceptingStates.toLowerCase(),
        transitions: relations.toLowerCase(),
      }),
      minified: dfaMinimizationRepository.generateDiagramCode({
        ...minimizationData.input,
      }),
    });
  };

  const onClickButtonCheck = () => {
    if (dfaMinimizationData) {
      setDfaCheckInitialData(
        dfaMinimizationRepository.checkInputString(
          {
            alphabets: alphabets.toLowerCase(),
            states: states.toLowerCase(),
            startState: startState.toLowerCase(),
            finalStates: acceptingStates.toLowerCase(),
            transitions: relations.toLowerCase(),
          },
          checkInputString
        )
      );

      setDfaCheckMinifiedData(
        dfaMinimizationRepository.checkInputString(
          dfaMinimizationData.input,
          checkInputString
        )
      );
    }
  };

  return (
    <>
      <ContainerComponent safeTop variant="md" className="py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dfa-minimization">
                Minimisasi DFA
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <p className="text-3xl font-semibold mt-4">Minimisasi DFA</p>
        <p className="mt-2">
          Simulator untuk mengubah DFA menjadi minimal dimana pengguna dapat
          mengetes kedua DFA tersebut (sebelum dan sesudah minimalisasi)
        </p>

        <div className="space-y-2">
          <div className="mt-8 space-y-1">
            <Label>Masukkan alphabets</Label>
            <Input
              placeholder="0,1"
              value={alphabets}
              onChange={(e) => setAlphabets(e.target.value)}
              className="lowercase"
            />
          </div>

          <div className="space-y-1">
            <Label>Masukkan states</Label>
            <Input
              placeholder="A,B,C,D,E,..."
              value={states}
              onChange={(e) => setStates(e.target.value)}
              className="lowercase"
            />
          </div>

          <div className="space-y-1">
            <Label>Masukkan start state</Label>
            <Input
              placeholder="A"
              value={startState}
              onChange={(e) => setStartState(e.target.value)}
              className="lowercase"
            />
          </div>

          <div className="space-y-1">
            <Label>Masukkan accepting state</Label>
            <Input
              placeholder="A,B,..."
              value={acceptingStates}
              onChange={(e) => setAcceptingStates(e.target.value)}
              className="lowercase"
            />
          </div>

          <div className="space-y-1">
            <Label>Masukkan relasi atau hubungan</Label>
            <Textarea
              placeholder={placeholderRelations}
              value={relations}
              onChange={(e) => setRelations(e.target.value)}
              className="lowercase resize-none min-h-64"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClickButtonGenerate}>Generate</Button>
        </div>

        {dfaMinimizationData && (
          <>
            <Separator className="mt-8" />
            <p className="font-semibold text-2xl mt-8">Step by step</p>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead>Equivalence</TableHead>
                  <TableHead>Subset</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(dfaMinimizationData.table).map(
                  (item, index) => (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>Eq-{item[0]}</TableCell>
                      <TableCell>
                        {"{"}
                        {item[1].join("} {")}
                        {"}"}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>States</TableCell>
                  <TableCell>
                    {dfaMinimizationData.data.states.join(",")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Final states</TableCell>
                  <TableCell>
                    {dfaMinimizationData.data.finalStates.join(",")}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </>
        )}

        {dfaMinimizationData && (
          <>
            <Separator className="mt-8" />
            <p className="font-semibold text-2xl mt-8">Check user from input</p>
            <div className="space-y-1 mt-4">
              <Label>Masukkan string</Label>
              <Input
                placeholder="101010..."
                value={checkInputString}
                onChange={(e) => setCheckInputString(e.target.value)}
                className="lowercase"
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={onClickButtonCheck}>Check</Button>
            </div>

            <p className="font-semibold text-xl mt-8">Step by step</p>
            {dfaCheckInitialData && dfaCheckMinifiedData && (
              <>
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow className="border-none">
                      <TableHead colSpan={1} rowSpan={2}>
                        String
                      </TableHead>
                      <TableHead colSpan={4}>Initial</TableHead>
                      <TableHead colSpan={4}>Minified</TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={2}>from</TableHead>
                      <TableHead colSpan={2}>to</TableHead>
                      <TableHead colSpan={2}>from</TableHead>
                      <TableHead colSpan={2}>to</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from(
                      Array(dfaCheckInitialData.history.length).keys()
                    ).map((item) => (
                      <TableRow>
                        <TableCell colSpan={1}>
                          {dfaCheckInitialData.history[item].str}
                        </TableCell>
                        <TableCell colSpan={2}>
                          {dfaCheckInitialData.history[item].from}
                        </TableCell>
                        <TableCell colSpan={2}>
                          {dfaCheckInitialData.history[item].to}
                        </TableCell>
                        <TableCell colSpan={2}>
                          {dfaCheckMinifiedData.history[item].from}
                        </TableCell>
                        <TableCell colSpan={2}>
                          {dfaCheckMinifiedData.history[item].to}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Acceptance</TableCell>
                      <TableCell colSpan={2}>
                        {String(dfaCheckInitialData.isAccept)}
                      </TableCell>
                      <TableCell colSpan={2}></TableCell>
                      <TableCell colSpan={2}>
                        {String(dfaCheckMinifiedData.isAccept)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </>
            )}
          </>
        )}

        {dfaMinimizationData && (
          <>
            <Separator className="mt-8" />
            <p className="font-semibold text-2xl mt-8">Diagram</p>
            <Tabs defaultValue="initial" className="w-full mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="initial" className="w-full">
                  Initial
                </TabsTrigger>
                <TabsTrigger value="minified" className="w-full">
                  Minified
                </TabsTrigger>
              </TabsList>
              <TabsContent value="initial">
                <MermaidComponent
                  id="initial-diagram"
                  chart={diagram.initial}
                />
              </TabsContent>
              <TabsContent value="minified">
                <MermaidComponent
                  id="minified-diagram"
                  chart={diagram.minified}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </ContainerComponent>
    </>
  );
}

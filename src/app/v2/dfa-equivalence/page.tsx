"use client";

import dfaEquivalenceExamples from "@/assets/examples/dfa-equivalence.json";
import BreadCrumbComponent from "@/components/breadcrumb";
import ContainerComponent from "@/components/container";
import DiagramInputComponent from "@/components/diagram-input";
import MermaidComponent from "@/components/mermaid";
import { Button } from "@/components/ui/button";
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
import { dataConverterRepository } from "@/lib/repositories/v2/data-converter";
import { dfaEquivalenceRepository } from "@/lib/repositories/v2/dfa-equivalence";
import { diagramRepository } from "@/lib/repositories/v2/diagram";
import { DFADataProps, DiagramInputTransitionsProps } from "@/lib/types/types";
import { Check, Dices, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [alphabets1, setAlphabets1] = useState("");
  const [states1, setStates1] = useState("");
  const [startState1, setStartState1] = useState("");
  const [finalStates1, setFinalStates1] = useState("");
  const [transitions1, setTransitions1] =
    useState<DiagramInputTransitionsProps>({});

  const [alphabets2, setAlphabets2] = useState("");
  const [states2, setStates2] = useState("");
  const [startState2, setStartState2] = useState("");
  const [finalStates2, setFinalStates2] = useState("");
  const [transitions2, setTransitions2] =
    useState<DiagramInputTransitionsProps>({});

  const [exampleIndex, setExampleIndex] = useState(0);
  const [equivalenceResult, setEquivalenceResult] = useState<{
    equivalence: boolean;
    others: {
      transitions: {
        [key: string]: {
          [key: string]: string;
        };
      };
      dfaData1: DFADataProps;
      dfaData2: DFADataProps;
    };
  }>();
  const [diagrams, setDiagrams] = useState({
    dfa1: "",
    dfa2: "",
  });
  const [isGenerated, setIsGenerated] = useState(false);

  const onClickButtonExample = () => {
    const example = dfaEquivalenceExamples[exampleIndex];

    const dfa1: DFADataProps = example[0] as any;
    setAlphabets1(dfa1.alphabets.join(","));
    setStates1(dfa1.states.join(","));
    setStartState1(dfa1.startState);
    setFinalStates1(dfa1.finalStates.join(","));
    setTimeout(() => setTransitions1(dfa1.transitions), 100);

    const dfa2: DFADataProps = example[1] as any;
    setAlphabets2(dfa2.alphabets.join(","));
    setStates2(dfa2.states.join(","));
    setStartState2(dfa2.startState);
    setFinalStates2(dfa2.finalStates.join(","));
    setTimeout(() => setTransitions2(dfa2.transitions), 100);

    setExampleIndex(
      exampleIndex < dfaEquivalenceExamples.length - 1 ? exampleIndex + 1 : 0
    );
  };

  const onClickButtonReset = () => {
    setAlphabets1("");
    setStates1("");
    setStartState1("");
    setFinalStates1("");
    setTransitions1({});

    setAlphabets2("");
    setStates2("");
    setStartState2("");
    setFinalStates2("");
    setTransitions2({});

    setIsGenerated(false);
  };

  const onClickButtonCheck = () => {
    const dfaData1 = dataConverterRepository.convertDFAInput({
      alphabets: alphabets1,
      states: states1,
      startState: startState1,
      finalStates: finalStates1,
      transitions: transitions1,
    });
    const dfaData2 = dataConverterRepository.convertDFAInput({
      alphabets: alphabets2,
      states: states2,
      startState: startState2,
      finalStates: finalStates2,
      transitions: transitions2,
    });

    const result = dfaEquivalenceRepository.checkEquivalence(
      dfaData1,
      dfaData2
    );

    setEquivalenceResult(result);
    setDiagrams({
      dfa1: diagramRepository.generateDFA(dfaData1),
      dfa2: diagramRepository.generateDFA(dfaData2),
    });

    setIsGenerated(true);
  };

  useEffect(() => {
    setIsGenerated(false);
  }, [
    alphabets1,
    alphabets2,
    states1,
    states2,
    startState1,
    startState2,
    finalStates1,
    finalStates2,
    transitions1,
    transitions2,
  ]);

  return (
    <>
      <ContainerComponent safeTop className="py-8">
        <BreadCrumbComponent
          items={[
            { label: "Home", href: "/" },
            { label: "DFA Ekuivalensi", href: "/v2/dfa-equivalence" },
          ]}
        />
        <p className="mt-4 text-3xl font-semibold">DFA Ekuivalensi</p>
        <p className="mt-2">
          Simulator untuk mengecek ekuivalensi antara dua buah masukan DFA
        </p>

        <p className="font-semibold mt-8">Diagram DFA 1</p>
        <p>Masukkan beberapa informasi untuk diagram DFA pertama</p>
        <DiagramInputComponent
          className="mt-4"
          diagramType="dfa"
          input={{
            alphabets: alphabets1,
            states: states1,
            startState: startState1,
            finalStates: finalStates1,
            transitions: transitions1,
            setAlphabets: setAlphabets1,
            setStates: setStates1,
            setStartState: setStartState1,
            setFinalStates: setFinalStates1,
            setTransitions: setTransitions1,
          }}
        />

        <p className="font-semibold mt-8">Diagram DFA 2</p>
        <p>Masukkan beberapa informasi untuk diagram DFA kedua</p>
        <DiagramInputComponent
          className="mt-4"
          diagramType="dfa"
          input={{
            alphabets: alphabets2,
            states: states2,
            startState: startState2,
            finalStates: finalStates2,
            transitions: transitions2,
            setAlphabets: setAlphabets2,
            setStates: setStates2,
            setStartState: setStartState2,
            setFinalStates: setFinalStates2,
            setTransitions: setTransitions2,
          }}
        />

        <div className="flex items-center justify-end gap-2 mt-8">
          <Button variant={"secondary"} onClick={onClickButtonExample}>
            <Dices className="w-4 h-4 mr-2" />
            Contoh
          </Button>
          <Button variant={"destructive"} onClick={onClickButtonReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={onClickButtonCheck} disabled={isGenerated}>
            <Check className="w-4 h-4 mr-2" />
            Cek
          </Button>
        </div>

        {isGenerated && equivalenceResult && (
          <>
            <Separator className="mt-8" />

            <section className="mt-8">
              <p className="font-semibold text-xl">Transitions Table</p>
              <p>
                Berikut adalah tabel hasil transisi secara berpasangan beserta
                dengan jenis state-nya (final state atau intermediate state)
              </p>

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>States</TableHead>
                    {equivalenceResult.others.dfaData1.alphabets.map(
                      (alphabet, index) => (
                        <TableHead
                          key={"transitions-table-header-head-" + index}
                        >
                          {alphabet}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(equivalenceResult.others.transitions).map(
                    (entry, index) => (
                      <TableRow key={"transitions-table-body-row-" + index}>
                        <TableCell>{entry[0]}</TableCell>
                        {equivalenceResult.others.dfaData1.alphabets.map(
                          (alphabet, index2) => (
                            <TableCell
                              key={
                                "transitions-table-body-row-" + index + index2
                              }
                            >
                              {entry[1][alphabet]}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    )
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={1}>Jenis state</TableCell>
                    <TableCell colSpan={2}>
                      F.S (Final State), I.S (Intermediate State)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Equivalences</TableCell>
                    <TableCell colSpan={2}>
                      {String(equivalenceResult.equivalence)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </section>

            <section className="mt-8">
              <p className="font-semibold text-xl">State Diagram</p>
              <p>Berikut adalah state diagram dari kedua DFA</p>
              <Tabs defaultValue="dfa1" className="mt-4">
                <TabsList className="w-full grid grid-cols-2 gap-2">
                  <TabsTrigger value="dfa1">DFA 1</TabsTrigger>
                  <TabsTrigger value="dfa2">DFA 2</TabsTrigger>
                </TabsList>
                <TabsContent value="dfa1">
                  <MermaidComponent
                    chart={diagrams.dfa1}
                    id="mermaid-diagram-dfa1"
                  />
                </TabsContent>
                <TabsContent value="dfa2">
                  <MermaidComponent
                    chart={diagrams.dfa2}
                    id="mermaid-diagram-dfa2"
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

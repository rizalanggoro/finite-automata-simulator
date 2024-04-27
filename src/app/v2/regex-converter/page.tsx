"use client";

import regexExamples from "@/assets/examples/regex-converter.json";
import BreadCrumbComponent from "@/components/breadcrumb";
import ContainerComponent from "@/components/container";
import MermaidComponent from "@/components/mermaid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { diagramRepository } from "@/lib/repositories/v2/diagram";
import { regexConverterRepository } from "@/lib/repositories/v2/regex-converter";
import { ENFADataProps } from "@/lib/types/types";
import { Dices, RotateCcw, Wand } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [regex, setRegex] = useState("");

  const [exampleIndex, setExampleIndex] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [result, setResult] = useState<{
    others: {
      regex: string;
      ast: any;
    };
    enfaData: ENFADataProps;
  }>();
  const [diagram, setDiagram] = useState("");
  const { toast } = useToast();

  const onClickButtonExample = () => {
    const example = regexExamples[exampleIndex];
    setRegex(example);

    toast({
      description:
        "Menggunakan contoh regular expression ke-" +
        (exampleIndex + 1) +
        " dari " +
        regexExamples.length,
    });

    setExampleIndex(
      exampleIndex < regexExamples.length - 1 ? exampleIndex + 1 : 0
    );
    setIsGenerated(false);
  };

  const onClickButtonReset = () => {
    setRegex("");
    setIsGenerated(false);
  };

  const onClickButtonGenerate = () => {
    if (regex) {
      const result = regexConverterRepository.convertRegexToENFA(regex);
      if (result) {
        setDiagram(diagramRepository.generateE_NFA(result.enfaData));
        setResult(result);
        setIsGenerated(true);
      }
    }
  };

  useEffect(() => {
    setIsGenerated(false);
  }, [regex]);

  return (
    <>
      <ContainerComponent safeTop className="py-8">
        <BreadCrumbComponent
          items={[
            { label: "Halaman Utama", href: "/" },
            { label: "Regex Konverter", href: "/v2/regex-converter" },
          ]}
        />
        <p className="font-semibold text-3xl mt-4">Regex Konverter</p>
        <p className="mt-2">
          Simulator untuk mengubah masukan regular expression menjadi sebuah
          state diagram ϵ-NFA yang berhubungan
        </p>

        <section className="mt-4">
          <div className="space-y-1">
            <Label>Masukkan regular expression</Label>
            <Input
              value={regex}
              onChange={(e) => setRegex(e.target.value.toLowerCase())}
            />
          </div>

          <div className="flex items-center justify-end gap-1 mt-8">
            <Button variant={"secondary"} onClick={onClickButtonExample}>
              <Dices className="w-4 h-4 mr-2" />
              Contoh
            </Button>
            <Button variant={"destructive"} onClick={onClickButtonReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={onClickButtonGenerate} disabled={isGenerated}>
              <Wand className="w-4 h-4 mr-2" />
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
                Berikut adalah table transisi hasil konversi dari regular
                expression menjadi ϵ-NFA
              </p>

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    {result.enfaData.alphabets.map((alphabet, index) => (
                      <TableHead
                        key={"transitions-table-head-alphabet-" + index}
                      >
                        {alphabet}
                      </TableHead>
                    ))}
                    <TableHead>ϵ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.enfaData.states.map((state, index) => {
                    const transition = result.enfaData.transitions[state];
                    const epsilonTransition =
                      result.enfaData.epsilonTransitions[state];

                    return (
                      <TableRow key={"transitions-table-body-" + index}>
                        <TableCell>
                          {state === result.enfaData.startState && "-> "}
                          {result.enfaData.finalStates.includes(state) && "*"}
                          {state}
                        </TableCell>
                        {result.enfaData.alphabets.map((alphabet, index2) => (
                          <TableCell
                            key={
                              "transitions-table-body-cell-" + index + index2
                            }
                          >
                            {transition && transition[alphabet]
                              ? transition[alphabet].join(",")
                              : "∅"}
                          </TableCell>
                        ))}
                        <TableCell>
                          {epsilonTransition
                            ? epsilonTransition.join(",")
                            : "∅"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </section>

            <section className="mt-8">
              <p className="font-semibold text-xl">State Diagram</p>
              <p>
                Berikut adalah state diagram hasil konversi dari regular
                expression menjadi ϵ-NFA
              </p>

              <div className="mt-4">
                <MermaidComponent chart={diagram} id="state-diagram-enfa" />
              </div>
            </section>
          </>
        )}
      </ContainerComponent>
    </>
  );
}

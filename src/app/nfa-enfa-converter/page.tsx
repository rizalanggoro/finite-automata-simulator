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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  NFA2DFADataProps,
  nfaConverterRepository,
} from "@/lib/repositories/nfa-enfa-converter";
import { useState } from "react";

export default function Page() {
  const [alphabets, setAlphabets] = useState("0,1");
  const [states, setStates] = useState("p,q,r,s");
  const [startState, setStartState] = useState("p");
  const [finalStates, setFinalStates] = useState("s");
  const [transitions, setTransitions] = useState("p,q;p\nr;r\ns;\ns;s");
  const [faType, setFaType] = useState("nfa");

  const [nfa2dfaData, setNfa2dfaData] = useState<
    NFA2DFADataProps | undefined
  >();

  const onClickButtonGenerate = () => {
    const result = nfaConverterRepository.generateDFA({
      alphabets: alphabets.toLowerCase(),
      states: states.toLowerCase(),
      startState: startState.toLowerCase(),
      finalStates: finalStates.toLowerCase(),
      transitions: transitions.toLowerCase(),
      type: faType,
    });

    setNfa2dfaData(result);
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
            <Label>Masukkan transitions</Label>
            <Textarea
              placeholder="0,1,..."
              className="min-h-64 resize-none"
              value={transitions}
              onChange={(e) => setTransitions(e.target.value)}
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
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClickButtonGenerate}>Generate</Button>
        </div>

        {nfa2dfaData && (
          <>
            <Separator className="mt-8" />
            <p className="text-2xl font-semibold mt-8">Conversion Table</p>

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
                {Object.entries(nfa2dfaData.filteredTable).map((item) => {
                  const state = item[0];

                  return (
                    <TableRow>
                      <TableCell>{state}</TableCell>
                      {nfa2dfaData.data.alphabets.map((alphabet) => {
                        const transition = item[1][alphabet];
                        return <TableCell>{transition.join(",")}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Final states</TableCell>
                  <TableCell colSpan={nfa2dfaData.data.alphabets.length}>
                    {"{"}
                    {nfa2dfaData.finalStates.join("} {")}
                    {"}"}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </>
        )}
      </ContainerComponent>
    </>
  );
}

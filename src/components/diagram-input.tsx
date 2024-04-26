"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DiagramInputTransitionsProps } from "@/lib/types/types";
import { getStrings } from "@/lib/utils";
import {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import { Label } from "./ui/label";

type Props = {
  diagramType: "dfa" | "nfa" | "enfa";
  input: {
    alphabets: string;
    states: string;
    startState: string;
    finalStates: string;
    transitions: DiagramInputTransitionsProps;

    setAlphabets: Dispatch<SetStateAction<string>>;
    setStates: Dispatch<SetStateAction<string>>;
    setStartState: Dispatch<SetStateAction<string>>;
    setFinalStates: Dispatch<SetStateAction<string>>;
    setTransitions: Dispatch<SetStateAction<DiagramInputTransitionsProps>>;
  };
} & HTMLAttributes<HTMLDivElement>;

export default function DiagramInputComponent(props: Props) {
  const alphabets: string[] = useMemo(
    () => getStrings(props.input.alphabets.toLowerCase(), ","),
    [props.input.alphabets]
  );
  const states: string[] = useMemo(
    () => getStrings(props.input.states.toLowerCase(), ","),
    [props.input.states]
  );
  const finalStates: string[] = useMemo(
    () => getStrings(props.input.finalStates.toLowerCase(), ","),
    [props.input.finalStates]
  );

  useEffect(() => {
    if (alphabets.length > 0 && states.length > 0) {
      const containerTransitions: DiagramInputTransitionsProps = {};

      for (const state of states) {
        containerTransitions[state] = {};
        for (const alphabet of alphabets) {
          containerTransitions[state][alphabet] = "";
        }
      }

      props.input.setTransitions(containerTransitions);
    } else {
      props.input.setTransitions({});
    }
  }, [alphabets, states]);

  return (
    <>
      <div className={props.className}>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>Masukkan alphabets</Label>
            <Input
              placeholder="a,b,..."
              value={props.input.alphabets}
              onChange={(e) => props.input.setAlphabets(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Masukkan states</Label>
            <Input
              placeholder="q0,q1,q2,..."
              value={props.input.states}
              onChange={(e) => props.input.setStates(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Masukkan start state</Label>
            <Input
              placeholder="q0"
              value={props.input.startState}
              onChange={(e) => props.input.setStartState(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Masukkan final states</Label>
            <Input
              placeholder="q0,q1,..."
              value={props.input.finalStates}
              onChange={(e) => props.input.setFinalStates(e.target.value)}
            />
          </div>
        </div>

        {alphabets.length > 0 && states.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="font-semibold text-lg">Transitions</p>
            <p>Masukkan transisi untuk setiap state pada table di bawah ini</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  {alphabets.map((alphabet, alphabetIndex) => (
                    <TableHead
                      key={"dfa-input-head-" + alphabet + alphabetIndex}
                    >
                      {alphabet}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {states.map((state, stateIndex) => (
                  <TableRow key={"dfa-input-table-row-" + state + stateIndex}>
                    <TableCell>
                      {state === props.input.startState && "-> "}
                      {finalStates.includes(state) && "*"}
                      {state}
                    </TableCell>
                    {alphabets.map((alphabet, alphabetIndex) => (
                      <TableCell
                        key={"dfa-input-table-cell-" + alphabet + alphabetIndex}
                      >
                        {props.input.transitions[state] !== undefined &&
                          props.input.transitions[state][alphabet] !==
                            undefined && (
                            <>
                              <Input
                                className="min-w-16"
                                value={props.input.transitions[state][alphabet]}
                                onChange={(e) => {
                                  props.input.setTransitions({
                                    ...props.input.transitions,
                                    [state]: {
                                      ...props.input.transitions[state],
                                      [alphabet]: e.target.value.toLowerCase(),
                                    },
                                  });
                                }}
                              />
                            </>
                          )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}

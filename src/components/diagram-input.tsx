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
import {
  DiagramInputEpsilonTransitionsProps,
  DiagramInputTransitionsProps,
} from "@/lib/types/types";
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
  diagramType: "dfa" | "nfa" | "enfa" | string;
  input: {
    alphabets: string;
    states: string;
    startState: string;
    finalStates: string;
    transitions: DiagramInputTransitionsProps;
    epsilonTransitions?: DiagramInputEpsilonTransitionsProps;

    setAlphabets: Dispatch<SetStateAction<string>>;
    setStates: Dispatch<SetStateAction<string>>;
    setStartState: Dispatch<SetStateAction<string>>;
    setFinalStates: Dispatch<SetStateAction<string>>;
    setTransitions: Dispatch<SetStateAction<DiagramInputTransitionsProps>>;
    setEpsilonTransitions?: Dispatch<
      SetStateAction<DiagramInputEpsilonTransitionsProps>
    >;
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

      // epsilon transitions
      if (props.diagramType === "enfa" && props.input.setEpsilonTransitions) {
        const containerEpsilonTransitions: DiagramInputEpsilonTransitionsProps =
          {};

        for (const state of states) {
          containerEpsilonTransitions[state] = "";
        }

        props.input.setEpsilonTransitions(containerEpsilonTransitions);
      }
    } else {
      props.input.setTransitions({});

      // epsilon transitions
      if (props.diagramType === "enfa" && props.input.setEpsilonTransitions) {
        props.input.setEpsilonTransitions({});
      }
    }
  }, [alphabets, states, props.diagramType]);

  return (
    <>
      <div className={props.className}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
          <div className="mt-6">
            <p className="font-semibold text-lg">Transitions</p>
            <p>
              Masukkan transisi untuk setiap state pada table di bawah ini
              {props.diagramType !== "dfa" &&
                ". Pisahkan setiap state menggunakan tanda koma (,)"}
            </p>
            <Table className="mt-4">
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

        {/* epsilon transitions */}
        {props.diagramType &&
          props.diagramType === "enfa" &&
          states.length > 0 &&
          props.input.epsilonTransitions &&
          props.input.setEpsilonTransitions && (
            <div className="mt-6">
              <p className="font-semibold text-lg">Epsilon Transitions</p>
              <p>
                Masukkan transisi epsilon untuk setiap state pada table di bawah
                ini. Pisahkan setiap state menggunakan tanda koma (,)
              </p>

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Epsilon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {states.map((state, index) => (
                    <TableRow
                      key={"epsilon-transitions-table-body-row-" + index}
                    >
                      <TableCell>{state}</TableCell>
                      <TableCell>
                        {props.input.epsilonTransitions &&
                          props.input.epsilonTransitions[state] !==
                            undefined && (
                            <Input
                              className="min-w-16"
                              value={props.input.epsilonTransitions[state]}
                              onChange={(e) =>
                                props.input.setEpsilonTransitions!({
                                  ...props.input.epsilonTransitions,
                                  [state]: e.target.value.toLowerCase(),
                                })
                              }
                            />
                          )}
                      </TableCell>
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

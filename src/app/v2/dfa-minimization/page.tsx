"use client";

import ContainerComponent from "@/components/container";
import JsonViewComponent from "@/components/json-view";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";

const getStrings = (str: string, delimiter: string): string[] => {
  if (str.trim().length > 0) {
    return str.split(delimiter).filter((it) => it.trim().length > 0);
  }

  return [];
};

export default function Page() {
  const [alphabets, setAlphabets] = useState("");
  const [states, setStates] = useState("");
  const [startState, setStartState] = useState("");
  const [finalStates, setFinalStates] = useState("");
  const [transitions, setTransitions] = useState<{
    [key: string]: {
      [key: string]: string;
    };
  }>({});

  const arrAlphabets = useMemo(() => getStrings(alphabets, ","), [alphabets]);
  const arrStates = useMemo(() => Object.keys(transitions), [transitions]);
  const arrFinalStates = useMemo(
    () => getStrings(finalStates, ","),
    [finalStates]
  );

  useEffect(() => {
    const arrAlphabets = getStrings(alphabets, ",");
    const arrStates = getStrings(states, ",");

    if (arrAlphabets.length > 0 && arrStates.length > 0) {
      const containerTransitions: {
        [key: string]: {
          [key: string]: string;
        };
      } = {};

      for (const state of arrStates) {
        containerTransitions[state] = {};
        for (const alphabet of arrAlphabets) {
          containerTransitions[state][alphabet] = "";
        }
      }

      setTransitions(containerTransitions);
    } else {
      setTransitions({});
    }
  }, [alphabets, states]);

  return (
    <>
      <ContainerComponent safeTop>
        <p>DFA Minimization</p>

        <Input
          placeholder="Masukkan alphabets"
          value={alphabets}
          onChange={(e) => setAlphabets(e.target.value)}
        />
        <Input
          placeholder="Masukkan states"
          value={states}
          onChange={(e) => setStates(e.target.value)}
        />
        <Input
          placeholder="Masukkan start state"
          value={startState}
          onChange={(e) => setStartState(e.target.value)}
        />
        <Input
          placeholder="Masukkan final states"
          value={finalStates}
          onChange={(e) => setFinalStates(e.target.value)}
        />

        {arrAlphabets.length > 0 && arrStates.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                {arrAlphabets.map((item, index) => (
                  <TableHead>{item}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {arrStates.map((item, index) => (
                <TableRow>
                  <TableCell>
                    {item === startState && "-> "}
                    {arrFinalStates.includes(item) && "*"}
                    {item}
                  </TableCell>
                  {arrAlphabets.map((item2, index2) => (
                    <TableCell>
                      <Input
                        className="min-w-16"
                        value={transitions[item][item2]}
                        onChange={(e) => {
                          setTransitions({
                            ...transitions,
                            [item]: {
                              ...transitions[item],
                              [item2]: e.target.value,
                            },
                          });
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* <div className="grid grid-cols-2">
          {Object.keys(transitions).map((item, index) => (
            <div className="inline-block">
              {getStrings(alphabets, ",").map((item2, index2) => (
                <div>
                  <Label>
                    {item} {"->"} {item2}
                  </Label>
                  <Input
                    value={transitions[item][item2]}
                    onChange={(e) =>
                      setTransitions({
                        ...(transitions ?? {}),
                        [item]: {
                          ...(transitions[item] ?? {}),
                          [item2]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          ))}
        </div> */}

        <JsonViewComponent data={transitions} title="Transitions" />
      </ContainerComponent>
    </>
  );
}

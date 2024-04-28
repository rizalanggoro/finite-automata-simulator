import { DFADataProps, NFADataProps, NFAInputProps } from "../../types/types";
import { dataConverterRepository } from "./data-converter";

const generateNewTransitions = (
  data: NFADataProps,
  reachableStates: string[]
) => {
  const table: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};
  const transitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};

  // determine transitions
  for (const reachableState of reachableStates) {
    table[reachableState] = {};

    for (const state of reachableState.split(",")) {
      const transition = data.transitions[state];
      for (const alphabet of data.alphabets) {
        if (table[reachableState][alphabet]) {
          for (const item of transition[alphabet]) {
            if (!table[reachableState][alphabet].includes(item))
              table[reachableState][alphabet].push(item);
          }
        } else {
          table[reachableState][alphabet] = [...transition[alphabet]];
        }

        table[reachableState][alphabet].sort();
      }
    }
  }

  for (const key of Object.keys(table)) {
    transitions[key] = {};
    for (const alphabet of data.alphabets) {
      const to = table[key][alphabet].join(",");
      transitions[key][alphabet] = to ? to : "empty";
    }
  }

  return transitions;
};

const generateNewFinalStates = (
  data: NFADataProps,
  reachableStates: string[]
) => {
  const result: string[] = [];

  for (const state of reachableStates) {
    for (const finalState of data.finalStates) {
      if (state.includes(finalState)) {
        result.push(state);
        break;
      }
    }
  }

  return result;
};

const generateReachableStates = (data: NFADataProps) => {
  const willVisit: string[] = [data.startState];
  const visited: string[] = [];

  while (willVisit.length > 0) {
    const current = willVisit.splice(0, 1)[0];

    if (current) {
      if (!visited.includes(current)) visited.push(current);

      if (current.includes(",")) {
        for (const alphabet of data.alphabets) {
          const _next: string[] = [];
          for (const _current of current.split(",")) {
            data.transitions[_current][alphabet].forEach((item) => {
              if (item && !_next.includes(item)) _next.push(item);
            });
          }

          const next = _next.sort().join(",");
          if (next && !visited.includes(next)) {
            willVisit.push(next);
          }
        }
      } else {
        for (const alphabet of data.alphabets) {
          const next = data.transitions[current][alphabet].join(",");
          if (next && !visited.includes(next)) {
            willVisit.push(next);
          }
        }
      }
    }
  }

  return visited;
};

const convertNFAToDFA = (data: NFADataProps) => {
  const reachableStates = generateReachableStates(data);
  const newTransitions = generateNewTransitions(data, reachableStates);
  const newFinalStates = generateNewFinalStates(data, reachableStates);

  return {
    others: {
      reachableStates,
      newTransitions,
      newFinalStates,
    },
    dfaData: {
      alphabets: data.alphabets,
      states: reachableStates,
      startState: data.startState,
      finalStates: newFinalStates,
      transitions: newTransitions,
    } as DFADataProps,
  };
};

const convertNFAInputToDFA = (input: NFAInputProps) => {
  return convertNFAToDFA(dataConverterRepository.convertNFAInput(input));
};

export const nfaConverterRepository = {
  convertNFAInputToDFA,
  convertNFAToDFA,
};

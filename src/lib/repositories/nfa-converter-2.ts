import { NFADataProps, NFAInputProps } from "../types/types";
import { dataConverterRepository } from "./data-converter";

const generateAllStatesCombinations = (set: string[]) => {
  const result: string[] = [];

  const backtrack = (index: number, current: string[]) => {
    result.push(current.join(","));

    for (let a = index; a < set.length; a++) {
      current.push(set[a]);
      backtrack(a + 1, current);
      current.pop();
    }
  };

  backtrack(0, []);

  return result.sort().filter((item) => item !== "");
};

const generateDFATable = (data: NFADataProps) => {
  const table: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  const combinations = generateAllStatesCombinations(data.states);

  // determine transitions
  for (const combination of combinations) {
    table[combination] = {};

    const states = combination.split(",");
    for (const state of states) {
      const transition = data.transitions[state];
      for (const alphabet of data.alphabets) {
        if (table[combination][alphabet]) {
          table[combination][alphabet].push(...transition[alphabet]);
        } else {
          table[combination][alphabet] = [...transition[alphabet]];
        }

        table[combination][alphabet].sort();
      }
    }
  }

  return table;
};

const generateReachableDFATable = (
  data: NFADataProps,
  table: {
    [key: string]: {
      [key: string]: string[];
    };
  }
) => {
  const reachableTable: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  // retain only those states reachable from start state
  const willVisit: string[] = [data.startState];
  const visited: string[] = [];
  while (willVisit.length > 0) {
    const current = willVisit.splice(0, 1)[0];

    for (const alphabet of data.alphabets) {
      const state = table[current][alphabet].join(",");
      reachableTable[current] = table[current];

      if (!visited.includes(state)) {
        willVisit.push(state);
        visited.push(state);
      }
    }
  }

  return reachableTable;
};

const generateDFANewFinalStates = (
  data: NFADataProps,
  table: {
    [key: string]: {
      [key: string]: string[];
    };
  }
) => {
  const result: string[] = [];

  for (const state of Object.keys(table)) {
    for (const finalState of data.finalStates) {
      if (state.includes(finalState)) {
        result.push(state);
        break;
      }
    }
  }

  return result;
};

const convertNFAToDFA = (data: NFADataProps) => {
  const table = generateDFATable(data);
  const reachableTable = generateReachableDFATable(data, table);
  const newFinalStates = generateDFANewFinalStates(data, reachableTable);

  return {
    dfaTable: table,
    reachableDfaTable: reachableTable,
    newFinalStates,
  };
};

const convertNFAInputToDFA = (input: NFAInputProps) => {
  return convertNFAToDFA(dataConverterRepository.convertNFAInput(input));
};

export const nfaConverterRepository2 = {
  convertNFAInputToDFA,
  convertNFAToDFA,
};

import { DFADataProps } from "../types/dfa";

type NFAInputProps = {
  alphabets: string;
  states: string;
  startState: string;
  finalStates: string;
  transitions: string;
  type: string | "nfa" | "e-nfa";
};

type NFADataProps = {
  alphabets: string[];
  states: string[];
  startState: string;
  finalStates: string[];
  transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  type: string | "nfa" | "e-nfa";
};

type DFATableProps = {
  [key: string]: {
    [key: string]: string[];
  };
};

export type NFA2DFADataProps = {
  data: NFADataProps;
  table: DFATableProps;
  dfaData: DFADataProps;
  dfaTable: DFATableProps;
  dfaFinalStates: string[];
};

const generateNFAData = (input: NFAInputProps): NFADataProps => {
  const states = input.states.split(",");
  const alphabets = input.alphabets.split(",");
  const startState = input.startState;
  const finalStates = input.finalStates.split(",");
  const transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  const _transitions = input.transitions.split("\n").map((item) => {
    const destinations = item.split(";");
    const map: {
      [key: string]: string[];
    } = {};
    for (let a = 0; a < destinations.length; a++)
      if (destinations[a].length > 0)
        map[alphabets[a]] = destinations[a].split(",");

    return map;
  });

  for (let a = 0; a < _transitions.length; a++)
    transitions[states[a]] = _transitions[a];

  return {
    states,
    alphabets,
    startState,
    finalStates,
    transitions,
    type: input.type,
  };
};

const generateDFATable = (data: NFADataProps) => {
  const table: DFATableProps = {};

  const newStates: string[] = Object.keys(data.transitions);
  while (newStates.length > 0) {
    const currentState = newStates.splice(0, 1)[0];
    const innerTable: {
      [key: string]: string[];
    } = {};

    if (currentState.indexOf(",") !== -1) {
      const currentStates = currentState.split(",");
      for (const state of currentStates) {
        const destinations = data.transitions[state];
        for (const destination of Object.entries(destinations)) {
          if (innerTable[destination[0]]) {
            for (const _destination of destination[1]) {
              if (!innerTable[destination[0]].includes(_destination)) {
                innerTable[destination[0]].push(_destination);
                innerTable[destination[0]].sort();
              }
            }
          } else {
            innerTable[destination[0]] = [...destination[1]];
            innerTable[destination[0]].sort();
          }
        }

        for (const alphabet of data.alphabets) {
          if (innerTable[alphabet]) {
            const newState = innerTable[alphabet].join();

            if (
              newState != currentState &&
              newState.indexOf(",") !== -1 &&
              !Object.keys(table).includes(newState)
            ) {
              console.log({ newState });
              newStates.push(newState);
            }
          }
        }
      }
      table[currentState] = innerTable;
    } else {
      const destinations = data.transitions[currentState];
      console.log({ state: currentState, destinations });

      for (const destination of Object.entries(destinations)) {
        if (destination[1].length > 1) {
          innerTable[destination[0]] = destination[1];
          newStates.push(destination[1].join());
        } else {
          innerTable[destination[0]] = [...destination[1]];
        }
      }

      table[currentState] = innerTable;
    }
  }

  return table;
};

const generateDFAFilteredTableData = (
  data: NFADataProps,
  table: DFATableProps
): {
  table: DFATableProps;
  finalStates: string[];
} => {
  const fixDfa: string[] = [];
  const willVisit: string[] = [data.startState];

  while (willVisit.length > 0) {
    const state = willVisit.splice(0, 1)[0];
    const destinations = table[state];
    for (const destination of Object.values(destinations)) {
      const nextVisit = destination.join();
      if (
        nextVisit != state &&
        !fixDfa.includes(nextVisit) &&
        !willVisit.includes(nextVisit)
      ) {
        console.log(nextVisit);
        willVisit.push(nextVisit);
      }
    }

    fixDfa.push(state);
  }

  console.log({ fixDfa });

  const filteredTable: DFATableProps = {};
  const filteredFinalStates: string[] = [];
  for (const tableEntry of Object.entries(table)) {
    if (fixDfa.includes(tableEntry[0])) {
      filteredTable[tableEntry[0]] = tableEntry[1];

      for (const finalState of data.finalStates) {
        if (tableEntry[0].indexOf(finalState) !== -1) {
          filteredFinalStates.push(tableEntry[0]);
          break;
        }
      }
    }
  }

  return {
    table: filteredTable,
    finalStates: filteredFinalStates,
  };
};

const generateDFAData = (
  data: NFADataProps,
  dfaTable: DFATableProps,
  dfaFinalStates: string[]
): DFADataProps => {
  const transitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};

  for (const state of Object.keys(dfaTable)) {
    const innerTransitions: {
      [key: string]: string;
    } = {};

    for (const alphabet of data.alphabets) {
      if (dfaTable[state][alphabet]) {
        const nextState = dfaTable[state][alphabet].join();
        innerTransitions[alphabet] = nextState;
      } else {
        innerTransitions[alphabet] = "";
      }
    }
    transitions[state] = innerTransitions;
  }

  return {
    alphabets: data.alphabets,
    startState: data.startState,
    finalStates: dfaFinalStates,
    states: Object.keys(dfaTable),
    transitions,
  };
};

const generateDFA = (input: NFAInputProps): NFA2DFADataProps => {
  const data = generateNFAData(input);
  const table = generateDFATable(data);
  const filteredTableData = generateDFAFilteredTableData(data, table);
  const dfaData = generateDFAData(
    data,
    filteredTableData.table,
    filteredTableData.finalStates
  );

  return {
    data,
    table,
    dfaData,
    dfaTable: filteredTableData.table,
    dfaFinalStates: filteredTableData.finalStates,
  };
};

export const nfaConverterRepository = {
  generateDFA,
};

import { DFADataProps, DFAInputProps } from "@/lib/types/types";
import { dataConverterRepository } from "./data-converter";

const convertDFAInputToMinifiedDFA = (input: DFAInputProps) =>
  convertDFAToMinifiedDFA(dataConverterRepository.convertDFAInput(input));

const generateSubsets = (data: DFADataProps) => {
  const subsets: Array<{
    [key: string]: string[];
  }> = [];

  // memisahkan final states dan non final states
  subsets[0] = { 0: [], 1: [] };
  subsets[0][0] = [
    ...data.states.sort().filter((it) => data.finalStates.includes(it)),
  ];
  subsets[0][1] = [
    ...data.states.sort().filter((it) => !data.finalStates.includes(it)),
  ];

  // memisahkan node berdasarkan subset sebelumnya
  let subsetIndex = 1;
  let isDone = false;
  while (!isDone) {
    subsets[subsetIndex] = {};

    for (const prevSubsetEntry of Object.entries(subsets[subsetIndex - 1])) {
      if (prevSubsetEntry[1].length > 1) {
        for (const state of prevSubsetEntry[1]) {
          const transition = data.transitions[state];
          let subsetReferIndex = "";

          for (const alphabet of data.alphabets) {
            for (const prevSubsetEntry2 of Object.entries(
              subsets[subsetIndex - 1]
            )) {
              const key2 = prevSubsetEntry2[0];
              const value2 = prevSubsetEntry2[1];

              if (value2.includes(transition[alphabet])) {
                subsetReferIndex += key2;
                break;
              }
            }
          }

          if (subsets[subsetIndex][subsetReferIndex]) {
            subsets[subsetIndex][subsetReferIndex].push(state);
          } else {
            subsets[subsetIndex][subsetReferIndex] = [state];
          }

          subsets[subsetIndex][subsetReferIndex].sort();
        }
      } else {
        subsets[subsetIndex][prevSubsetEntry[1][0]] = prevSubsetEntry[1];
      }
    }

    isDone =
      JSON.stringify(Object.values(subsets[subsetIndex - 1])) ===
      JSON.stringify(Object.values(subsets[subsetIndex]));

    subsetIndex++;
  }

  return subsets;
};

const generateNewStates = (
  subsets: {
    [key: string]: string[];
  }[]
) => {
  const states: string[] = [];

  for (const value of Object.values(subsets[subsets.length - 1])) {
    states.push(value[0]);
  }

  return states.sort();
};

const generateEquivalences = (
  subsets: {
    [key: string]: string[];
  }[],
  newStates: string[]
) => {
  const equivalences: { [key: string]: string[] } = {};
  const lastSubset = subsets[subsets.length - 1];

  for (const state of newStates) {
    equivalences[state] = [];

    for (const value of Object.values(lastSubset)) {
      if (value.includes(state)) {
        equivalences[state].push(...value.filter((it) => it !== state));
      }
    }
  }

  return equivalences;
};

const generateNewFinalStates = (
  data: DFADataProps,
  equivalences: { [key: string]: string[] }
) => {
  const finalStates: string[] = [];

  for (const finalState of data.finalStates) {
    for (const entry of Object.entries(equivalences)) {
      if (
        (entry[0] === finalState || entry[1].includes(finalState)) &&
        !finalStates.includes(entry[0])
      ) {
        finalStates.push(entry[0]);
        break;
      }
    }
  }

  return finalStates.sort();
};

const generateNewTransitions = (
  data: DFADataProps,
  newStates: string[],
  equivalences: { [key: string]: string[] }
) => {
  const transitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};

  for (const state of newStates) {
    transitions[state] = {};
    const transition = data.transitions[state];

    for (const alphabet of data.alphabets) {
      if (newStates.includes(transition[alphabet])) {
        transitions[state][alphabet] = transition[alphabet];
      } else {
        for (const entry of Object.entries(equivalences)) {
          if (entry[1].includes(transition[alphabet])) {
            transitions[state][alphabet] = entry[0];
            break;
          }
        }
      }
    }
  }

  return transitions;
};

const generateNewStartState = (
  data: DFADataProps,
  equivalences: {
    [key: string]: string[];
  }
) => {
  let result = "";

  if (Object.keys(equivalences).includes(data.startState)) {
    result = data.startState;
  } else {
    for (const [key, value] of Object.entries(equivalences)) {
      if (value.includes(data.startState)) {
        result = key;
        break;
      }
    }
  }

  return result;
};

const convertDFAToMinifiedDFA = (data: DFADataProps) => {
  const subsets = generateSubsets(data);
  const newStates = generateNewStates(subsets);
  const equivalences = generateEquivalences(subsets, newStates);
  const newFinalStates = generateNewFinalStates(data, equivalences);
  const newTransitions = generateNewTransitions(data, newStates, equivalences);
  const newStartState = generateNewStartState(data, equivalences);

  return {
    others: {
      subsets,
      newStates,
      equivalences,
      newFinalStates,
      newTransitions,
    },
    dfaData: {
      alphabets: data.alphabets,
      states: newStates,
      startState: newStartState,
      finalStates: newFinalStates,
      transitions: newTransitions,
    } as DFADataProps,
  };
};

export const dfaMinimizationRepository = {
  convertDFAInputToMinifiedDFA,
  convertDFAToMinifiedDFA,
};

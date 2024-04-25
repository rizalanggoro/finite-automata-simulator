import { DFADataProps, DFAInputProps } from "../types/types";

export type DFAMinimizationDataProps = {
  initialData: DFADataProps;
  minifiedData: DFADataProps;
  table: {
    [key: string]: Array<Array<string>>;
  };
};

export type DFACheckDataProps = {
  isAccept: boolean;
  history: Array<{
    str: string;
    from: string;
    to: string;
  }>;
};

const generateDFAData = (input: DFAInputProps): DFADataProps => {
  const states = input.states.toLowerCase().split(",");
  const alphabets = input.alphabets.toLowerCase().split(",");
  const startState = input.startState.toLowerCase();
  const finalStates = input.finalStates.toLowerCase().split(",");
  const transitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};

  for (const transition of Object.entries(input.transitions)) {
    const key = transition[0];
    const value = transition[1];

    const innerTransitions: {
      [key: string]: string;
    } = {};

    // const nextStates = value.toLowerCase().split(";");
    // for (let a = 0; a < alphabets.length; a++) {
    //   const alphabet = alphabets[a];
    //   innerTransitions[alphabet] = nextStates[a];
    // }

    transitions[key] = innerTransitions;
  }

  return {
    states,
    alphabets,
    startState,
    finalStates,
    transitions,
  };
};

const isStateAvailableInEveryFirstPairState = (
  state: string,
  pairStates: string[][]
): boolean => {
  for (const a of pairStates) {
    if (a[0] === state) return true;
  }
  return false;
};

const findStateIndexInPairStates = (state: string, pairStates: string[][]) => {
  let index = -1;
  for (let a = 0; a < pairStates.length; a++) {
    for (let b = 0; b < pairStates[a].length; b++) {
      if (pairStates[a][b] === state) {
        index = a;
        break;
      }
    }
  }
  return index;
};

const generateMinimization = (
  input: DFAInputProps
): DFAMinimizationDataProps => {
  const data = generateDFAData(input);

  // remove all unreachable states
  const destinationStates: Array<string> = [];
  for (const state of data.states) {
    const transition = data.transitions[state];
    for (const alphabet of data.alphabets) {
      const state = transition[alphabet];
      if (!destinationStates.includes(state)) {
        destinationStates.push(state);
      }
    }
  }

  const reachableStates = data.states.filter(
    (item) => destinationStates.includes(item) || item === data.startState
  );

  // table to hold all subsets
  const table: {
    [key: string]: Array<Array<string>>;
  } = {};

  // separate final state and non final state into different subset
  table[0] = [
    [...reachableStates.filter((item) => data.finalStates.includes(item))],
    [...reachableStates.filter((item) => !data.finalStates.includes(item))],
  ];

  // separate nodes that refer to another subset
  let isChanged = true;
  let level = 0;
  while (isChanged) {
    const prevSubset = table[level];
    const currentSubset: Array<Array<string>> = [];

    for (const states of Object.values(prevSubset)) {
      const innerCurrentSubset: {
        [key: string]: Array<string>;
      } = {};

      if (states.length > 1) {
        for (const state of states) {
          const transition = data.transitions[state];
          let innerNewSubsetKey = "";

          for (const alphabet of data.alphabets) {
            const dest = transition[alphabet];
            const destKey = Object.entries(prevSubset)
              .filter((item) => item[1].includes(dest))
              .map((item) => item[0])[0];
            innerNewSubsetKey += destKey;
          }

          if (innerCurrentSubset[innerNewSubsetKey])
            innerCurrentSubset[innerNewSubsetKey].push(state);
          else innerCurrentSubset[innerNewSubsetKey] = [state];
        }
        currentSubset.push(...Object.values(innerCurrentSubset));
      } else {
        currentSubset.push(states);
      }
    }

    table[level + 1] = currentSubset;

    // stop the algorithm when no changes made from prev step
    if (
      Object.values(prevSubset)
        .map((item) => item.join(""))
        .join() ===
      Object.values(currentSubset)
        .map((item) => item.join(""))
        .join()
    )
      isChanged = false;
    else level++;
  }

  // convert last result from table to DFA input type
  const keys = Object.keys(table);
  const lastKey = keys[keys.length - 1];

  const lastPairStates = table[lastKey];

  // search for final and non-final states
  const finalPairStateIndexes: number[] = [];
  const resultStates: string[] = [];
  const resultFinalStates: string[] = [];
  for (let a = 0; a < lastPairStates.length; a++) {
    // search final state index from pair state
    const pairState = lastPairStates[a];
    for (const state of Object.values(pairState)) {
      if (data.finalStates.includes(state)) {
        finalPairStateIndexes.push(a);
      }
    }

    // push state to array result
    if (finalPairStateIndexes.includes(a)) {
      resultFinalStates.push(pairState[0]);
    }
    resultStates.push(pairState[0]);
  }

  // generate transitions
  const transitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};

  for (const pairState of lastPairStates) {
    const firstState = pairState[0];
    const destinations = data.transitions[firstState];

    let status = true;
    let makeErrorAlphabet = "";
    let makeErrorValue = "";

    for (const destination of Object.entries(destinations)) {
      if (
        !isStateAvailableInEveryFirstPairState(destination[1], lastPairStates)
      ) {
        status = false;
        makeErrorAlphabet = destination[0];
        makeErrorValue = destination[1];
        break;
      }
    }

    if (status) {
      transitions[firstState] = destinations;
    } else {
      let newIndex = findStateIndexInPairStates(makeErrorValue, lastPairStates);

      const newDestinations = { ...destinations };
      newDestinations[makeErrorAlphabet] = lastPairStates[newIndex][0];
      transitions[firstState] = newDestinations;
    }
  }

  // generate result transitions
  const resultTransitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};
  for (const state of resultStates) {
    const innerResultTransitions: {
      [key: string]: string;
    } = {};

    const transition = transitions[state];
    for (const alphabet of data.alphabets) {
      const destination = transition[alphabet];
      innerResultTransitions[alphabet] = destination;
    }
    resultTransitions[state] = innerResultTransitions;
  }

  // search start state
  let resultStartState = "";
  if (isStateAvailableInEveryFirstPairState(data.startState, lastPairStates)) {
    resultStartState = data.startState;
  } else {
    // find start state equivalence
    let index = findStateIndexInPairStates(data.startState, lastPairStates);
    resultStartState = lastPairStates[index][0];
  }

  // const inputResult: DFAInputProps = {
  //   alphabets: data.alphabets.join(),
  //   states: resultStates.join(),
  //   startState: resultStartState,
  //   finalStates: resultFinalStates.join(),
  //   transitions: resultTransitions,
  // };

  const minifiedData: DFADataProps = {
    alphabets: data.alphabets,
    states: resultStates,
    startState: resultStartState,
    finalStates: resultFinalStates,
    transitions: resultTransitions,
  };

  return {
    // input: inputResult,
    // data: generateDFAData(inputResult),
    table,
    initialData: data,
    minifiedData,
  };
};

const checkInputString = (
  data: DFADataProps,
  inputString: string
): DFACheckDataProps => {
  // const data = generateDFAData(input);
  const startState = data.startState;

  const history: Array<{
    str: string;
    from: string;
    to: string;
  }> = [];

  const inputStrings = inputString.split("");
  let currentState = startState;

  for (const str of inputStrings) {
    const destinations = data.transitions[currentState];
    const toState = destinations[str];

    history.push({
      str,
      from: currentState,
      to: toState,
    });
    currentState = toState;
  }

  const isAccept = data.finalStates.includes(currentState);

  return {
    isAccept,
    history,
  };
};

export const dfaMinimizationRepository = {
  generateDFAData,
  generateMinimization,
  checkInputString,
};

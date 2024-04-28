import { ENFADataProps, ENFAInputProps, NFADataProps } from "../../types/types";
import { dataConverterRepository } from "./data-converter";

const generateClosures = (data: ENFADataProps) => {
  const result: {
    [key: string]: string[];
  } = {};

  for (const entry of Object.entries(data.epsilonTransitions)) {
    const key = entry[0];
    const value = entry[1];

    result[key] = [];

    if (value.length > 0) {
      const stack: string[] = [key, ...value];
      while (stack.length > 0) {
        const current = stack.splice(0, 1)[0];
        if (!result[key].includes(current)) {
          result[key].push(current);
        }

        stack.push(...data.epsilonTransitions[current]);
      }
    } else {
      result[key] = [key];
    }

    result[key].sort();
  }

  return result;
};

// deprecated
const generateNewTransitions = (
  data: ENFADataProps,
  closures: { [key: string]: string[] }
) => {
  const transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  for (const entry of Object.entries(data.transitions)) {
    const key = entry[0];
    const value = entry[1];
    // const epsilonTransitions = data.epsilonTransitions[key];
    const epsilonTransitions = closures[key];

    console.log({ key, epsilonTransitions });

    transitions[key] = value;

    if (epsilonTransitions.length > 0) {
      for (const alphabet of data.alphabets) {
        for (const epsilonTransition of epsilonTransitions) {
          const currentTransition = data.transitions[epsilonTransition];
          for (const item of currentTransition[alphabet]) {
            if (!transitions[key][alphabet].includes(item)) {
              transitions[key][alphabet].push(item);
            }
          }
        }

        transitions[key][alphabet].sort();
      }
    }
  }

  return transitions;
};

const generateNewFinalStates = (
  data: ENFADataProps,
  closures: {
    [key: string]: string[];
  }
) => {
  const finalStates: string[] = [];
  for (const closure of Object.entries(closures)) {
    const key = closure[0];
    const value = closure[1];

    for (const item of value) {
      if (data.finalStates.includes(item)) {
        finalStates.push(key);
        break;
      }
    }
  }

  finalStates.sort();

  return finalStates;
};

const generateNewTransitions2 = (
  data: ENFADataProps,
  closures: { [key: string]: string[] }
) => {
  const transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  // initialize empty transitions
  for (const state of data.states) {
    transitions[state] = {};
    for (const alphabet of data.alphabets) {
      transitions[state][alphabet] = [];
    }
  }

  for (const state of data.states) {
    if (closures[state].length === 1) {
      for (const alphabet of data.alphabets) {
        data.transitions[state][alphabet].forEach((item) => {
          if (!transitions[state][alphabet].includes(item))
            transitions[state][alphabet].push(item);
        });

        transitions[state][alphabet].sort();
      }
    } else if (closures[state].length > 1) {
      // epsilon*
      for (const clItem of closures[state]) {
        // alphabet
        for (const alphabet of data.alphabets) {
          const transition = data.transitions[clItem][alphabet];
          if (state === "a")
            console.log({ state, clItem, alphabet, transition });

          if (transition && transition.length > 0) {
            // epsilon*
            for (const transitionItem of transition) {
              closures[transitionItem].forEach((item) => {
                if (!transitions[state][alphabet].includes(item))
                  transitions[state][alphabet].push(item);
              });
            }
          }

          transitions[state][alphabet].sort();
        }
      }
    }
  }

  return transitions;
};

const convertENFAInputToNFA = (input: ENFAInputProps) =>
  convertENFAToNFA(dataConverterRepository.convertENFAInput(input));

const convertENFAToNFA = (data: ENFADataProps) => {
  const closures = generateClosures(data);
  const newTransitions = generateNewTransitions2(data, closures);
  const newFinalStates = generateNewFinalStates(data, closures);

  return {
    others: {
      enfaData: data,
      enfaClosures: closures,
      newTransitions,
      newFinalStates,
    },
    nfaData: {
      alphabets: data.alphabets,
      states: data.states,
      startState: data.startState,
      finalStates: newFinalStates,
      transitions: newTransitions,
    } as NFADataProps,
  };
};

export const enfaConverterRepository = {
  convertENFAInputToNFA,
  convertENFAToNFA,
};

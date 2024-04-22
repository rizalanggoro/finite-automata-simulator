import {
  ENFA2NFADataProps,
  ENFADataProps,
  ENFAInputProps,
} from "../types/types";
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

const generateNewTransitions = (data: ENFADataProps) => {
  const transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  for (const entry of Object.entries(data.transitions)) {
    const key = entry[0];
    const value = entry[1];
    const epsilonTransitions = data.epsilonTransitions[key];

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

const convertENFAInputToNFA = (input: ENFAInputProps): ENFA2NFADataProps => {
  const data = dataConverterRepository.convertENFAInput(input);
  const closures = generateClosures(data);
  const newTransitions = generateNewTransitions(data);
  const newFinalStates = generateNewFinalStates(data, closures);

  return {
    enfaData: data,
    enfaClosures: closures,
    nfaData: {
      alphabets: data.alphabets,
      states: data.states,
      startState: data.startState,
      finalStates: newFinalStates,
      transitions: newTransitions,
    },
  };
};

export const enfaConverterRepository = {
  convertENFAInputToNFA,
};

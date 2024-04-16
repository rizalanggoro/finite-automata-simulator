import {
  E_NFA2DFADataProps,
  E_NFADataProps,
  E_NFAInputProps,
} from "../types/types";
import { nfaConverterRepository } from "./nfa-converter";

const generateE_NFAData = (input: E_NFAInputProps): E_NFADataProps => {
  const states = input.states.toLowerCase().split(",");
  const alphabets = input.alphabets.toLowerCase().split(",");
  const startState = input.startState.toLowerCase();
  const finalStates = input.finalStates.toLowerCase().split(",");
  const transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};
  const epsilonTransitions: {
    [key: string]: string[];
  } = {};

  for (const transition of Object.entries(input.transitions)) {
    const key = transition[0].toLowerCase();
    const value = transition[1].toLowerCase();

    if (states.includes(key)) {
      const innerTransitions: { [key: string]: string[] } = {};

      const statesByAlphabet = value.split(";");
      for (let a = 0; a < alphabets.length; a++) {
        const alphabet = alphabets[a];
        if (statesByAlphabet[a].length > 0)
          innerTransitions[alphabet] = statesByAlphabet[a].split(",");
        else {
          innerTransitions[alphabet] = [];
        }
      }

      transitions[key] = innerTransitions;
    }
  }

  // epsilon transitions
  for (const epsilonTransition of Object.entries(input.epsilons)) {
    const key = epsilonTransition[0].toLowerCase();
    const value = epsilonTransition[1].toLowerCase();

    if (states.includes(key)) {
      console.log({ key, value });

      if (value.length > 0) {
        epsilonTransitions[key] = value.split(",");
      }
    }
  }

  return {
    states,
    alphabets,
    startState,
    finalStates,
    transitions,
    epsilonTransitions,
  };
};

const generateFinalStatesWithClosure = (data: E_NFADataProps): string[] => {
  const newFinalStates: string[] = [...data.finalStates];
  for (const transition of Object.entries(data.transitions)) {
    const currentState = transition[0];
    const epsilonStates = data.epsilonTransitions[currentState];

    console.log({ currentState, epsilonStates });

    if (epsilonStates && epsilonStates.length > 0) {
      const closures: string[] = [];

      let currentEpsilonStates = [currentState, ...epsilonStates];
      while (currentEpsilonStates.length > 0) {
        const currentEpsilonState = currentEpsilonStates[0];
        // const a = data.transitions[currentEpsilonState].epsilon;
        const a = data.epsilonTransitions[currentEpsilonState];

        if (a && currentEpsilonState !== currentState) {
          currentEpsilonStates.push(...a);
        }
        closures.push(currentEpsilonStates.splice(0, 1)[0]);
      }

      if (closures.includes(currentState)) {
        newFinalStates.push(currentState);
      }
    }
  }

  return newFinalStates;
};

const generateNewTransitions = (data: E_NFADataProps) => {
  const newTransitions: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};
  // const newEpsilonTransitions: {
  //   [key: string]: string[];
  // } = {};

  for (const transition of Object.entries(data.transitions)) {
    const key = transition[0];
    const value = transition[1];
    const currentEpsilonTransitions = data.epsilonTransitions[key];

    if (currentEpsilonTransitions && currentEpsilonTransitions.length > 0) {
      for (const epsilon of currentEpsilonTransitions) {
        const innerNewTransitions: {
          [key: string]: string[];
        } = {};
        // newEpsilonTransitions[key] = currentEpsilonTransitions;

        for (const alphabet of data.alphabets) {
          if (data.transitions[key] && data.transitions[key][alphabet])
            innerNewTransitions[alphabet] = data.transitions[key][alphabet];
          else innerNewTransitions[alphabet] = [];
        }

        const transition = data.transitions[epsilon];
        for (const alphabet of data.alphabets) {
          innerNewTransitions[alphabet].push(...transition[alphabet]);
        }

        newTransitions[key] = innerNewTransitions;
      }
    } else {
      newTransitions[key] = value;
    }
  }

  console.log({
    trasitions: data.transitions,
    newTransitions,
    // newEpsilonTransitions,
  });

  return newTransitions;
};

const generateDFA = (input: E_NFAInputProps): E_NFA2DFADataProps => {
  const data = generateE_NFAData(input);
  const newFinalStates = generateFinalStatesWithClosure(data);
  const newTransitions = generateNewTransitions(data);

  console.log({ data, newFinalStates, newTransitions });

  const nfaData = {
    ...data,
    finalStates: newFinalStates,
    transitions: newTransitions,
  };

  const dfaResult = nfaConverterRepository.generateDFAUsingData(nfaData);
  console.log({ dfaResult });
  return {
    eNfaData: data,
    dfaData: dfaResult.dfaData,
    dfaTable: dfaResult.dfaTable,
    dfaFinalStates: dfaResult.dfaFinalStates,
  } as E_NFA2DFADataProps;
};

export const eNFAConverterRepository = {
  generateDFA,
};

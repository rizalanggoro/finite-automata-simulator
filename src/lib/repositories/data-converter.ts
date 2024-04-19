import {
  DFADataProps,
  DFAInputProps,
  E_NFADataProps,
  E_NFAInputProps,
  NFADataProps,
  NFAInputProps,
} from "../types/types";

const convertDFAInput = (input: DFAInputProps): DFADataProps => {
  const alphabets = input.alphabets.toLowerCase().split(",");
  const states = input.states.toLowerCase().split(",");
  const startState = input.startState.toLowerCase();
  const finalStates = input.finalStates.toLowerCase().split(",");
  const transitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};

  // menginisialisasi empty transitions object
  for (const state of states) {
    transitions[state] = {};
    for (const alphabet of alphabets) {
      transitions[state][alphabet] = "";
    }
  }

  // men-generate transisi berdasakan masukan user
  for (const state of states) {
    const strPairDestinations = input.transitions[state];
    const pairDestinations = strPairDestinations.split(",");
    for (let a = 0; a < alphabets.length; a++) {
      transitions[state][alphabets[a]] = pairDestinations[a];
    }
  }

  return {
    alphabets,
    states,
    startState,
    finalStates,
    transitions,
  };
};
const convertNFAInput = (input: NFAInputProps): NFADataProps => {
  const alphabets = input.alphabets.split(",");
  const states = input.states.split(",");
  const startState = input.startState;
  const finalStates = input.finalStates.split(",");
  const transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  // menginisialisasi empty transitions object
  for (const state of states) {
    transitions[state] = {};
    for (const alphabet of alphabets) {
      transitions[state][alphabet] = [];
    }
  }

  // men-generate transisi berdasarkan masukan yang diberikan pengguna
  for (const state of states) {
    const strPairDestinations = input.transitions[state];
    const pairDestinations = strPairDestinations.split(";");
    for (let a = 0; a < alphabets.length; a++) {
      const strDestinations = pairDestinations[a];
      if (strDestinations.length > 0) {
        transitions[state][alphabets[a]] = strDestinations.split(",");
      }
    }
  }

  return {
    alphabets,
    states,
    startState,
    finalStates,
    transitions,
  };
};
const convertENFAInput = (input: E_NFAInputProps): E_NFADataProps => {
  const { alphabets, states, startState, finalStates, transitions } =
    convertNFAInput({ ...input });

  const epsilonTransitions: {
    [key: string]: string[];
  } = {};

  // menginisialisasi empty epsilon transitions object
  for (const state of states) {
    epsilonTransitions[state] = [];
  }

  // men-generate epsilon transitions berdasarkan masukan dari user
  for (const state of states) {
    const strEpsilonDestinations = input.epsilons[state];
    epsilonTransitions[state] = [state];

    if (strEpsilonDestinations.length > 0) {
      epsilonTransitions[state].push(...strEpsilonDestinations.split(","));
    }

    epsilonTransitions[state].sort();
  }

  return {
    alphabets,
    states,
    startState,
    finalStates,
    transitions,
    epsilonTransitions,
  };
};

export const dataConverterRepository = {
  convertDFAInput,
  convertNFAInput,
  convertENFAInput,
};

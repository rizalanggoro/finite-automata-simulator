import {
  DFADataProps,
  DFAInputProps,
  ENFADataProps,
  ENFAInputProps,
  NFADataProps,
  NFAInputProps,
} from "../../types/types";

const convertDFAInput = (input: DFAInputProps): DFADataProps => {
  const alphabets = input.alphabets.toLowerCase().split(",");
  const states = input.states.toLowerCase().split(",");
  const startState = input.startState.toLowerCase();
  const finalStates = input.finalStates.toLowerCase().split(",");
  const transitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = input.transitions;

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
    for (const alphabet of alphabets) {
      const transition = input.transitions[state][alphabet];
      if (transition) {
        transitions[state][alphabet].push(...transition.split(","));
      }

      transitions[state][alphabet].sort();
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

const convertENFAInput = (input: ENFAInputProps): ENFADataProps => {
  const { alphabets, states, startState, finalStates, transitions } =
    convertNFAInput({ ...input });

  const epsilonTransitions: {
    [key: string]: string[];
  } = {};

  // men-generate epsilon transitions berdasarkan masukan dari user
  for (const state of states) {
    epsilonTransitions[state] = [];
    const strEpsilonDestinations = input.epsilonTransitions[state];

    if (strEpsilonDestinations) {
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

import { E_NFADataProps, E_NFAInputProps } from "../types/types";

const generateE_NFAData = (input: E_NFAInputProps): E_NFADataProps => {
  const states = input.states.split(",");
  const alphabets = input.alphabets.split(",");
  const startState = input.startState;
  const finalStates = input.finalStates.split(",");
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

    const innerTransitions: { [key: string]: string[] } = {};

    const statesByAlphabet = value.split(";");
    for (let a = 0; a < alphabets.length; a++) {
      const alphabet = alphabets[a];
      if (statesByAlphabet[a].length > 0)
        innerTransitions[alphabet] = statesByAlphabet[a].split(",");
    }

    transitions[key] = innerTransitions;
  }

  // epsilon transitions
  for (const epsilonTransition of Object.entries(input.epsilons)) {
    const key = epsilonTransition[0].toLowerCase();
    const value = epsilonTransition[1].toLowerCase();
    console.log({ key, value });

    if (value.length > 0) {
      epsilonTransitions[key] = value.split(",");
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

const generateE_NFA = (input: E_NFAInputProps) => {
  const data = generateE_NFAData(input);

  console.log(data);
};

export const eNFAConverterRepository = {
  generateE_NFA,
};

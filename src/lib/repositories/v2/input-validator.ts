import { DFADataProps, NFADataProps } from "@/lib/types/types";

const validateInputForDFA = (data: DFADataProps, inputString: string) => {
  const history: Array<{
    str: string;
    from: string;
    to: string;
  }> = [];

  const inputStrings = inputString.split("");
  let fromState = data.startState;

  for (const str of inputStrings) {
    const transition = data.transitions[fromState];
    const toState = transition[str];

    history.push({
      str,
      from: fromState,
      to: toState,
    });
    fromState = toState;
  }

  const isAccept = data.finalStates.includes(fromState);

  return {
    isAccept,
    history,
  };
};

const validateInputForNFA = (data: NFADataProps, inputString: string) => {
  const history: Array<{
    str: string;
    from: string;
    to: string[];
  }> = [];

  const inputStrings = inputString.split("");

  let currentStates: string[] = [];
  currentStates.push(data.startState);

  for (const symbol of inputStrings) {
    let nextStates: string[] = [];

    for (const state of currentStates) {
      console.log({ symbol, state });
      let possibleStates = data.transitions[state][symbol];
      nextStates = [...nextStates, ...possibleStates];

      history.push({
        str: symbol,
        from: state,
        to: possibleStates,
      });
    }

    currentStates = nextStates;
  }

  let isAccept = false;
  for (const currentState of currentStates) {
    if (data.finalStates.includes(currentState)) {
      isAccept = true;
      break;
    }
  }

  return {
    isAccept,
    history,
  };
};

const validateInputForENFA = () => {};

const validateInputForRegex = () => {};

export const inputValidatorRepository = {
  validateInputForDFA,
  validateInputForNFA,
  validateInputForENFA,
  validateInputForRegex,
};

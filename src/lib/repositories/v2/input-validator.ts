import { DFADataProps, ENFADataProps, NFADataProps } from "@/lib/types/types";
import EpsilonNFAValidator from "@/lib/validators/enfa";
import NFAValidator from "@/lib/validators/nfa";

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
    to: string;
  }> = [];

  const nfaValidator = new NFAValidator(
    data.states,
    data.alphabets,
    data.transitions,
    data.startState,
    data.finalStates,
    history
  );
  const isAccept = nfaValidator.validate(inputString);

  return {
    isAccept,
    history,
  };
};

const validateInputForENFA = (data: ENFADataProps, inputString: string) => {
  const history: Array<{
    str: string;
    from: string;
    to: string;
  }> = [];

  const getCombinedData = (): NFADataProps => {
    const combinedDataTransitions: {
      [key: string]: {
        [key: string]: string[];
      };
    } = {};

    for (const [key, value] of Object.entries(data.transitions)) {
      combinedDataTransitions[key] = value;
      combinedDataTransitions[key]["ε"] = data.epsilonTransitions[key];
    }

    return {
      alphabets: data.alphabets,
      states: data.states,
      startState: data.startState,
      finalStates: data.finalStates,
      transitions: combinedDataTransitions,
    };
  };

  const combinedData = getCombinedData();
  const epsilonNfaValidator = new EpsilonNFAValidator(
    combinedData.states,
    combinedData.alphabets,
    combinedData.transitions,
    combinedData.startState,
    combinedData.finalStates,
    history
  );
  const isAccept = epsilonNfaValidator.validate(inputString);

  return {
    isAccept,
    history,
  };
};

const validateInputForRegex = () => {};

export const inputValidatorRepository = {
  validateInputForDFA,
  validateInputForNFA,
  validateInputForENFA,
  validateInputForRegex,
};

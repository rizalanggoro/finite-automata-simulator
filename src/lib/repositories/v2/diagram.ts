import { DFADataProps, ENFADataProps, NFADataProps } from "../../types/types";

const generateDFA = (data: DFADataProps): string => {
  let code = "flowchart LR\n";

  // create start state
  code += "\nstart[start]";

  // create states
  for (const state of data.states) {
    if (data.finalStates.includes(state))
      code += "\n" + state + "(((" + state + ")))";
    else code += "\n" + state + "((" + state + "))";
  }
  code += "\n";

  // connect start state
  code += "\nstart --> " + data.startState;

  // create transitions
  for (const transition of Object.entries(data.transitions)) {
    for (const alphabet of data.alphabets) {
      const state = transition[0];
      const destination = transition[1][alphabet];
      if (destination.length > 0 && destination !== "empty")
        code += "\n" + state + " -- " + alphabet + " --> " + destination;
      else code += "\n" + state + " -- " + alphabet + " --> empty((∅))";
    }
  }

  return code;
};

const generateNFA = (data: NFADataProps): string => {
  let code = "flowchart LR";

  // create start state
  code += "\nstart[start]";

  // create states
  for (const state of data.states) {
    if (data.finalStates.includes(state))
      code += "\n" + state + "(((" + state + ")))";
    else code += "\n" + state + "((" + state + "))";
  }
  code += "\n";

  // connect start state
  code += "\nstart --> " + data.startState;

  // create transitions
  for (const transition of Object.entries(data.transitions)) {
    for (const alphabet of data.alphabets) {
      const state = transition[0];
      const destination = transition[1][alphabet];
      if (destination) {
        for (const destinationItem of destination) {
          code += "\n" + state + " -- " + alphabet + " --> " + destinationItem;
        }
      }
    }
  }

  return code;
};

const generateE_NFA = (data: ENFADataProps) => {
  let code = "flowchart LR";

  // create start state
  code += "\nstart[start]";

  // create states
  for (const state of data.states) {
    if (data.finalStates.includes(state))
      code += "\n" + state + "(((" + state + ")))";
    else code += "\n" + state + "((" + state + "))";
  }
  code += "\n";

  // connect start state
  code += "\nstart --> " + data.startState;

  // create transitions
  for (const transition of Object.entries(data.transitions)) {
    for (const alphabet of data.alphabets) {
      const state = transition[0];
      const destination = transition[1][alphabet];
      if (destination) {
        for (const destinationItem of destination) {
          code += "\n" + state + " -- " + alphabet + " --> " + destinationItem;
        }
      }
    }
  }

  // create epsilon transitions
  // console.log(data.epsilonTransitions);
  for (const epsilonTransition of Object.entries(data.epsilonTransitions)) {
    const state = epsilonTransition[0];

    const nextStates = epsilonTransition[1];
    for (const nextState of nextStates) {
      code += "\n" + state + " -- ε --> " + nextState;
    }
  }

  // console.log(code);

  return code;
};

export const diagramRepository = {
  generateDFA,
  generateNFA,
  generateE_NFA,
};

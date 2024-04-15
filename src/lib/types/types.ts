export type DFADataProps = {
  states: string[];
  startState: string;
  finalStates: string[];
  alphabets: string[];
  transitions: {
    [key: string]: {
      [key: string]: string;
    };
  };
};

export type NFAInputProps = {
  alphabets: string;
  states: string;
  startState: string;
  finalStates: string;
  transitions: {
    [key: string]: string;
  };
};

export type NFADataProps = {
  states: string[];
  startState: string;
  finalStates: string[];
  alphabets: string[];
  transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  };
};

export type E_NFAInputProps = {
  alphabets: string;
  states: string;
  startState: string;
  finalStates: string;
  transitions: {
    [key: string]: string;
  };
  epsilons: {
    [key: string]: string;
  };
};

export type E_NFADataProps = {
  states: string[];
  startState: string;
  finalStates: string[];
  alphabets: string[];
  transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  epsilonTransitions: {
    [key: string]: string[];
  };
};

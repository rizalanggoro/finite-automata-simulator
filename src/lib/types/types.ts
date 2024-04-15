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

// dfa
export type DFAInputProps = {
  states: string;
  startState: string;
  finalStates: string;
  alphabets: string;
  transitions: {
    [key: string]: string;
  };
};

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

// nfa
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

// enfa
export type ENFAInputProps = {
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

export type ENFADataProps = {
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

// converter output types
export type ENFA2NFADataProps = {
  enfaData: ENFADataProps;
  enfaClosures: { [key: string]: string[] };
  nfaData: NFADataProps;
};

export type NFA2DFADataProps = {
  nfaData: NFADataProps;
  dfaUnfilteredTable: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  dfaData: DFADataProps;
  dfaTable: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  dfaFinalStates: string[];
};

// deprecated
export type E_NFA2DFADataProps = {
  eNfaData: ENFADataProps;
  dfaData: DFADataProps;
  dfaTable: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  dfaFinalStates: string[];
};

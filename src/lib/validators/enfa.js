export class EpsilonNFAValidator {
  constructor(
    states,
    alphabet,
    transitions,
    startState,
    acceptStates,
    history
  ) {
    this.states = states;
    this.alphabet = alphabet;
    this.transitions = transitions;
    this.startState = startState;
    this.acceptStates = acceptStates;
    this.history = history;

    // Check for states transitioning to empty states for all symbols
    this.states.forEach((state) => {
      const emptyTransitions = this.transitions[state];
      const allEmpty = Object.values(emptyTransitions).every(
        (transitions) => transitions.length === 0
      );
      if (allEmpty) {
        // Add default epsilon transition to itself
        this.transitions[state]["ε"] = [state];
      }
    });
  }

  drawTransitionTable() {
    console.log("Transition Table:");
    console.log("-------------------------------------");
    console.log("State | Symbol | Next States | Epsilon");
    console.log("-------------------------------------");
    for (let state of this.states) {
      for (let symbol of this.alphabet) {
        const nextStates = this.transitions[state][symbol] || [];
        const epsilonTransitions = this.transitions[state]["ε"] || [];
        console.log(
          `${state.padEnd(6)} | ${symbol.padEnd(6)} | ${nextStates
            .join(", ")
            .padEnd(11)} | ${epsilonTransitions.join(", ")}`
        );
      }
    }
    console.log("-------------------------------------");
  }

  epsilonClosure(state) {
    let closure = new Set([state]);
    let stack = [state];

    while (stack.length > 0) {
      let currentState = stack.pop();
      let epsilonTransitions = this.transitions[currentState]["ε"] || [];

      epsilonTransitions.forEach((nextState) => {
        if (!closure.has(nextState)) {
          closure.add(nextState);
          stack.push(nextState);
        }
      });
    }

    // Include states reachable via epsilon transitions from closure states
    for (let state of closure) {
      let epsilonTransitions = this.transitions[state]["ε"] || [];
      epsilonTransitions.forEach((nextState) => {
        if (!closure.has(nextState)) {
          closure.add(nextState);
        }
      });
    }

    return closure;
  }

  validate(input) {
    this.drawTransitionTable();
    console.log("Validation Steps:");
    console.log("-------------------------------------");

    // Compute epsilon closure for all states
    let epsilonClosures = {};
    for (let state of this.states) {
      epsilonClosures[state] = this.epsilonClosure(state);
    }

    // Start from the epsilon closure of the start state q0'
    let currentStateSet = epsilonClosures[this.startState];
    console.log("Starting from state(s):", [...currentStateSet].join(", "));

    for (let symbol of input) {
      console.log("Current state(s):", [...currentStateSet].join(", "));

      let nextStateSet = new Set();
      let symbolConsumed = false; // Flag to check if the symbol is consumed
      let transitionFound = false; // Flag to track if any transition is found for the current symbol

      currentStateSet.forEach((state) => {
        let transitions = this.transitions[state][symbol] || [];
        if (transitions.length > 0) {
          transitionFound = true; // Update flag if transition is found for any state
          symbolConsumed = true; // Update flag if the symbol is consumed
          transitions.forEach((nextState) => {
            nextStateSet = new Set([
              ...nextStateSet,
              ...epsilonClosures[nextState],
            ]);
          });
        }
      });

      // Consider epsilon transitions
      currentStateSet.forEach((state) => {
        let epsilonTransitions = this.transitions[state]["ε"] || [];
        epsilonTransitions.forEach((nextState) => {
          nextStateSet = new Set([
            ...nextStateSet,
            ...epsilonClosures[nextState],
          ]);
        });
      });

      console.log(
        `After reading '${symbol}', the next state(s) is/are: ${[
          ...nextStateSet,
        ].join(", ")}`
      );

      this.history.push({
        str: symbol,
        from: [...currentStateSet].join(","),
        to: [...nextStateSet].join(","),
      });

      if (!transitionFound) {
        console.log(
          `No transition available from state(s) ${[...currentStateSet].join(
            ", "
          )} on input '${symbol}'`
        );
      }

      if (!symbolConsumed) {
        console.log(
          `Symbol '${symbol}' not consumed. Skipping to next symbol.`
        );
        continue; // Skip to next symbol
      }

      currentStateSet = nextStateSet;
    }

    console.log("-------------------------------------");
    // Check if any of the final states are in the accept states
    let finalStates = [...currentStateSet];
    let isAcceptingState = finalStates.some((state) =>
      this.acceptStates.includes(state)
    );

    // Include states with no transitions in the final states if they are accept states
    for (let state of this.states) {
      if (!finalStates.includes(state) && this.acceptStates.includes(state)) {
        let hasTransitions = input
          .split("")
          .every((symbol) => this.transitions[state][symbol] !== undefined);
        if (!hasTransitions) {
          finalStates.push(state);
        }
      }
    }

    console.log("Final state(s):", finalStates.join(", "));
    return finalStates.some((state) => this.acceptStates.includes(state));
  }
}

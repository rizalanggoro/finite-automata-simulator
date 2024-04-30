export default class NFAValidator {
  constructor(
    states,
    alphabet,
    transitions,
    startState,
    acceptingStates,
    history
  ) {
    this.states = states;
    this.alphabet = alphabet;
    this.transitions = transitions;
    this.startState = startState;
    this.acceptingStates = acceptingStates;
    this.finalStates = [];
    this.history = history;
  }

  drawTransitionTable() {
    console.log("Transition Table:");
    console.log("-------------------------------------");
    console.log("State | Symbol | Next States");
    console.log("-------------------------------------");
    for (let state of this.states) {
      for (let symbol of this.alphabet) {
        const nextStates = this.transitions[state][symbol] || [];
        console.log(
          `${state.padEnd(6)} | ${symbol.padEnd(6)} | ${nextStates.join(", ")}`
        );
      }
    }
    console.log("-------------------------------------");
  }

  validate(input) {
    this.drawTransitionTable();
    console.log("Validation Steps:");
    console.log("-------------------------------------");

    // Start from the start state
    let currentStateSet = new Set([this.startState]);
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
          nextStateSet = new Set([...nextStateSet, ...transitions]);
        }
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
    // Check if any of the final states are in the accepting states
    this.finalStates = [...currentStateSet];
    console.log("Final state(s):", this.finalStates.join(", "));
    return this.finalStates.some((state) =>
      this.acceptingStates.includes(state)
    );
  }
}

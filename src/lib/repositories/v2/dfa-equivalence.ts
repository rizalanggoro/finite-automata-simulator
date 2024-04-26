import { DFADataProps } from "@/lib/types/types";

const checkEquivalence = (dfa1: DFADataProps, dfa2: DFADataProps) => {
  let result: boolean = false;
  const transitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};

  if (dfa1.alphabets.length !== dfa2.alphabets.length) {
    // jika alfabet tidak sama, maka tidak bisa dicek ekuivalensinya
    result = false;
  } else {
    // lakukan pencarian untuk state yang tidak ekuivalen
    const visitedPairs = new Set<string>();
    const stack: string[][] = [[dfa1.startState, dfa2.startState]];

    while (stack.length > 0) {
      const popValues = stack.pop();
      if (popValues) {
        const [state1, state2] = popValues;
        const pair = `(${state1},${state2})`;

        // cek apakah pasangan state sudah pernah dikunjungi
        if (visitedPairs.has(pair)) continue;
        visitedPairs.add(pair);

        // cek apakah kedua state adalah state akhir atau tidak
        if (
          dfa1.finalStates.includes(state1) !==
          dfa2.finalStates.includes(state2)
        ) {
          result = false;
          break;
        }

        transitions[pair] = {};

        // cek transisi untuk setiap simbol dalam alfabet
        for (const alphabet of dfa1.alphabets) {
          const nextState1 = dfa1.transitions[state1][alphabet];
          const nextState2 = dfa2.transitions[state2][alphabet];

          const nextState1Type = dfa1.finalStates.includes(nextState1)
            ? "F.S"
            : "I.S";
          const nextState2Type = dfa2.finalStates.includes(nextState2)
            ? "F.S"
            : "I.S";

          transitions[pair][
            alphabet
          ] = `(${nextState1},${nextState2}) -> (${nextState1Type},${nextState2Type})`;

          if (!nextState1 || !nextState2) {
            if (nextState1 !== nextState2) {
              // jika transisi tidak ada atau tidak sama
              result = false;
              break;
            }
          } else {
            stack.push([nextState1, nextState2]);
          }
        }

        // jika tidak ditemukan perbedaan
        result = true;
      }
    }
  }

  return {
    equivalence: result,
    others: {
      transitions,
      dfaData1: dfa1,
      dfaData2: dfa2,
    },
  };
};

export const dfaEquivalenceRepository = {
  checkEquivalence,
};

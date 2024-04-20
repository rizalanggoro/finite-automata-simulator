import ContainerComponent from "@/components/container";
import { dataConverterRepository } from "@/lib/repositories/data-converter";
import {
  DFAInputProps,
  E_NFAInputProps,
  NFAInputProps,
} from "@/lib/types/types";

export default function Page() {
  const dfaInput: DFAInputProps = {
    alphabets: "a,b",
    states: "0,1,2,3",
    startState: "0",
    finalStates: "2,3",
    transitions: {
      0: "1,2",
      1: "2,3",
      2: "3,0",
      3: "0,1",
    },
  };
  const dfaData = dataConverterRepository.convertDFAInput(dfaInput);

  const nfaInput: NFAInputProps = {
    alphabets: "a,b",
    states: "0,1,2,3",
    startState: "0",
    finalStates: "2,3",
    transitions: {
      0: ";1,2",
      1: "2;3",
      2: "1,3;",
      3: "",
    },
  };
  const nfaData = dataConverterRepository.convertNFAInput(nfaInput);

  const enfaInput: E_NFAInputProps = {
    alphabets: "a,b",
    states: "0,1,2,3",
    startState: "0",
    finalStates: "2,3",
    transitions: {
      0: ";1,2",
      1: "2;3",
      2: "1,3;",
      3: "",
    },
    epsilons: {
      0: "",
      1: "2,3",
      2: "1",
      3: "",
    },
  };
  const enfaData = dataConverterRepository.convertENFAInput(enfaInput);

  return (
    <>
      <ContainerComponent safeTop className="py-8">
        <section className="space-y-1">
          <p className="font-semibold">DFA Data Converter</p>
          <p>{JSON.stringify(dfaInput)}</p>
          <p>{JSON.stringify(dfaData)}</p>
        </section>

        <section className="mt-4 space-y-1">
          <p className="font-semibold">NFA Data Converter</p>
          <p>{JSON.stringify(nfaInput)}</p>
          <p>{JSON.stringify(nfaData)}</p>
        </section>

        <section className="mt-4 space-y-1">
          <p className="font-semibold">ENFA Data Converter</p>
          <p>{JSON.stringify(enfaInput)}</p>
          <p>{JSON.stringify(enfaData)}</p>
        </section>
      </ContainerComponent>
    </>
  );
}

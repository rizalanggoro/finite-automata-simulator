"use client";

import ContainerComponent from "@/components/container";
import JsonViewComponent from "@/components/json-view";
import { dataConverterRepository } from "@/lib/repositories/data-converter";
import { nfaConverterRepository2 } from "@/lib/repositories/nfa-converter-2";
import { NFAInputProps } from "@/lib/types/types";

export default function Page() {
  // const dfaInput: DFAInputProps = {
  //   alphabets: "a,b",
  //   states: "0,1,2,3",
  //   startState: "0",
  //   finalStates: "2,3",
  //   transitions: {
  //     0: "1,2",
  //     1: "2,3",
  //     2: "3,0",
  //     3: "0,1",
  //   },
  // };
  // const dfaData = dataConverterRepository.convertDFAInput(dfaInput);

  // const nfaInput: NFAInputProps = {
  //   alphabets: "a,b",
  //   states: "0,1,2,3",
  //   startState: "0",
  //   finalStates: "2,3",
  //   transitions: {
  //     0: ";1,2",
  //     1: "2;3",
  //     2: "1,3;",
  //     3: "",
  //   },
  // };
  // const nfaData = dataConverterRepository.convertNFAInput(nfaInput);

  // const enfaInput: ENFAInputProps = {
  //   alphabets: "0,1",
  //   states: "a,b,c,d,e,f",
  //   startState: "a",
  //   finalStates: "d",
  //   transitions: {
  //     a: "e;b",
  //     b: ";c",
  //     c: ";d",
  //     d: "",
  //     e: "f;",
  //     f: "d;",
  //   },
  //   epsilons: {
  //     a: "",
  //     b: "d",
  //     c: "",
  //     d: "",
  //     e: "b,c",
  //     f: "",
  //   },
  // };
  // const enfaData = dataConverterRepository.convertENFAInput(enfaInput);
  // const enfaNfaData = enfaConverterRepository.convertENFAInputToNFA(enfaInput);

  // const enfaInput2: ENFAInputProps = {
  //   alphabets: "0,1",
  //   states: "q0,q1,q2,q3,q4",
  //   startState: "q0",
  //   finalStates: "q2",
  //   transitions: {
  //     q0: ";q1",
  //     q1: ";q0",
  //     q2: "q3;q4",
  //     q3: "q2;",
  //     q4: "q2;",
  //   },
  //   epsilons: {
  //     q0: "q2",
  //     q1: "",
  //     q2: "",
  //     q3: "",
  //     q4: "",
  //   },
  // };
  // const enfaData2 = dataConverterRepository.convertENFAInput(enfaInput2);
  // const enfaNfaData2 =
  //   enfaConverterRepository.convertENFAInputToNFA(enfaInput2);

  // const enfaInput3: ENFAInputProps = {
  //   alphabets: "0,1",
  //   states: "q0',q0,q1,q2",
  //   startState: "q0'",
  //   finalStates: "q0',q2",
  //   transitions: {
  //     "q0'": "",
  //     q0: "q0,q1;q0",
  //     q1: ";q2",
  //     q2: "",
  //   },
  //   epsilons: {
  //     "q0'": "q0",
  //     q0: "",
  //     q1: "",
  //     q2: "",
  //   },
  // };
  // const enfaData3 = dataConverterRepository.convertENFAInput(enfaInput3);
  // const enfaNfaData3 =
  //   enfaConverterRepository.convertENFAInputToNFA(enfaInput3);
  // const dfaData3 = nfaConverterRepository.generateDFAUsingData(
  //   enfaNfaData3.nfaData
  // );

  const nfaInput: NFAInputProps = {
    alphabets: "0,1",
    states: "q0,q1,q2",
    startState: "q0",
    finalStates: "q2",
    transitions: {
      q0: "q0,q1;q0",
      q1: ";q2",
      q2: "",
    },
  };
  const nfaData = dataConverterRepository.convertNFAInput(nfaInput);
  const nfa2DfaData = nfaConverterRepository2.convertNFAToDFA(nfaData);

  return (
    <>
      <ContainerComponent safeTop className="py-8">
        <JsonViewComponent data={nfaInput} title="NFA Input" />
        <JsonViewComponent data={nfaData} title="NFA Data" />
        <JsonViewComponent data={nfa2DfaData} title="NFA -> DFA Data" />

        {/* <section className="space-y-2">
          <p className="font-semibold text-lg">DFA Data Converter</p>

          <JsonViewComponent data={dfaInput} />
          <JsonViewComponent data={dfaData} />
        </section>

        <section className="mt-4 space-y-2 border-t">
          <p className="font-semibold mt-4 text-lg">NFA Data Converter</p>

          <JsonViewComponent data={nfaInput} />
          <JsonViewComponent data={nfaData} />
        </section>

        <section className="mt-4 space-y-2 border-t">
          <p className="font-semibold mt-4">ENFA Data Converter</p>

          <JsonViewComponent data={enfaInput} />
          <JsonViewComponent data={enfaData} />
          <JsonViewComponent data={enfaNfaData} />
        </section>

        <section className="mt-4 space-y-2 border-t">
          <p className="font-semibold mt-4">ENFA Data Converter 2</p>

          <JsonViewComponent data={enfaInput2} />
          <JsonViewComponent data={enfaData2} />
          <JsonViewComponent data={enfaNfaData2} />
        </section> */}

        {/* <section className="mt-4 space-y-2 border-t">
          <p className="font-semibold mt-4">ENFA Data Converter 3</p>

          <JsonViewComponent title="ENFA Input" data={enfaInput3} />
          <JsonViewComponent title="ENFA Data" data={enfaData3} />
          <JsonViewComponent title="ENFA -> NFA Data" data={enfaNfaData3} />
          <JsonViewComponent title="NFA -> DFA Data" data={dfaData3} />
        </section> */}
      </ContainerComponent>
    </>
  );
}

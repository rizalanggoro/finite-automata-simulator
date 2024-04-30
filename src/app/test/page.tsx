"use client";

import regexConverterExamples from "@/assets/examples/regex-converter.json";
import ContainerComponent from "@/components/container";
import { regexConverterRepository } from "@/lib/repositories/v2/regex-converter";

export default function Page() {
  const example = regexConverterExamples[0];
  const result = regexConverterRepository.convertRegexToENFA(example);

  return (
    <>
      <ContainerComponent safeTop>
        <p>Hello world!</p>
        {/* <JsonViewComponent
          data={{
            enfa: result?.enfaData,
            refine: result?.refinedEnfaData,
          }}
        /> */}
      </ContainerComponent>
    </>
  );
}

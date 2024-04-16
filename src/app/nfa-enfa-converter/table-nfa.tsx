import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NFA2DFADataProps } from "@/lib/types/types";
import { ArrowRight } from "lucide-react";

export default function ComponentTableNFA({
  nfaData,
  dfaData,
  dfaTable,
  dfaFinalStates,
}: NFA2DFADataProps) {
  return (
    <>
      <Separator className="mt-8" />
      <p className="text-2xl font-semibold mt-8">Conversion Table</p>

      <p className="mt-2">
        Berikut tabel nondeterministic finite automata berdasarkan masukan yang
        diberikan sebelum dilakukan konversi
      </p>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>States</TableHead>
            {nfaData.alphabets.map((item, index) => (
              <TableHead key={"table-head-" + item + index}>{item}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(nfaData.transitions).map((item, index) => {
            const state = item[0];

            return (
              <TableRow key={"table-row-" + item + index}>
                <TableCell>
                  {nfaData.startState === state && (
                    <ArrowRight className="inline w-4 h-4 mr-2" />
                  )}
                  {nfaData.finalStates.includes(state) ? "*" : ""}
                  {state}
                </TableCell>
                {nfaData.alphabets.map((alphabet, index) => {
                  const transition = item[1][alphabet];
                  return (
                    <TableCell key={"table-cell-" + alphabet + index}>
                      {transition && transition.length > 0
                        ? transition.join(",")
                        : "∅"}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <p className="mt-4">
        Berikut tabel hasil konversi dari nondeterministic finite automata
        menjadi deterministic finite automata
      </p>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>States</TableHead>
            {dfaData.alphabets.map((item, index) => (
              <TableHead key={"dfa-table-head-" + item + index}>
                {item}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(dfaTable).map((item, index) => {
            const state = item[0];

            return (
              <TableRow key={"dfa-table-row-" + item + index}>
                <TableCell>
                  {dfaData.startState === state && (
                    <ArrowRight className="inline w-4 h-4 mr-2" />
                  )}
                  {dfaFinalStates.includes(state) ? "*" : ""}
                  {state}
                </TableCell>
                {dfaData.alphabets.map((alphabet, index) => {
                  const transition = item[1][alphabet];
                  return (
                    <TableCell key={"dfa-table-cell-" + alphabet + index}>
                      {transition ? transition.join(",") : "∅"}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

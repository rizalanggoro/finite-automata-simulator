import { ENFADataProps } from "@/lib/types/types";

const syntaxTreeParser = {
  parseSub(text: any, begin: any, end: any, first: any): any {
    var i,
      sub,
      last = 0,
      node: any = { begin: begin, end: end },
      virNode: any,
      tempNode: any,
      stack = 0,
      parts: any = [];
    if (text.length === 0) {
      return "Error: empty input at " + begin + ".";
    }
    if (first) {
      for (i = 0; i <= text.length; i += 1) {
        if (i === text.length || (text[i] === "|" && stack === 0)) {
          if (last === 0 && i === text.length) {
            return syntaxTreeParser.parseSub(
              text,
              begin + last,
              begin + i,
              false
            );
          }
          sub = syntaxTreeParser.parseSub(
            text.substr(last, i - last),
            begin + last,
            begin + i,
            true
          );
          if (typeof sub === "string") {
            return sub;
          }
          parts.push(sub);
          last = i + 1;
        } else if (text[i] === "(") {
          stack += 1;
        } else if (text[i] === ")") {
          stack -= 1;
        }
      }
      if (parts.length === 1) {
        return parts[0];
      }
      node.type = "or";
      node.parts = parts;
    } else {
      for (i = 0; i < text.length; i += 1) {
        if (text[i] === "(") {
          last = i + 1;
          i += 1;
          stack = 1;
          while (i < text.length && stack !== 0) {
            if (text[i] === "(") {
              stack += 1;
            } else if (text[i] === ")") {
              stack -= 1;
            }
            i += 1;
          }
          if (stack !== 0) {
            return "Error: missing right bracket for " + (begin + last) + ".";
          }
          i -= 1;
          sub = syntaxTreeParser.parseSub(
            text.substr(last, i - last),
            begin + last,
            begin + i,
            true
          );
          if (typeof sub === "string") {
            return sub;
          }
          sub.begin -= 1;
          sub.end += 1;
          parts.push(sub);
        } else if (text[i] === "*") {
          if (parts.length === 0) {
            return "Error: unexpected * at " + (begin + i) + ".";
          }
          tempNode = {
            begin: parts[parts.length - 1].begin,
            end: parts[parts.length - 1].end + 1,
          };
          tempNode.type = "star";
          tempNode.sub = parts[parts.length - 1];
          parts[parts.length - 1] = tempNode;
        } else if (text[i] === "+") {
          if (parts.length === 0) {
            return "Error: unexpected + at " + (begin + i) + ".";
          }
          virNode = {
            begin: parts[parts.length - 1].begin,
            end: parts[parts.length - 1].end + 1,
          };
          virNode.type = "star";
          virNode.sub = parts[parts.length - 1];
          tempNode = {
            begin: parts[parts.length - 1].begin,
            end: parts[parts.length - 1].end + 1,
          };
          tempNode.type = "cat";
          tempNode.parts = [parts[parts.length - 1], virNode];
          parts[parts.length - 1] = tempNode;
        } else if (text[i] === "?") {
          if (parts.length === 0) {
            return "Error: unexpected + at " + (begin + i) + ".";
          }
          virNode = {
            begin: parts[parts.length - 1].begin,
            end: parts[parts.length - 1].end + 1,
          };
          virNode.type = "empty";
          virNode.sub = parts[parts.length - 1];
          tempNode = {
            begin: parts[parts.length - 1].begin,
            end: parts[parts.length - 1].end + 1,
          };
          tempNode.type = "or";
          tempNode.parts = [parts[parts.length - 1], virNode];
          parts[parts.length - 1] = tempNode;
        } else if (text[i] === "ϵ") {
          tempNode = { begin: begin + i, end: begin + i + 1 };
          tempNode.type = "empty";
          parts.push(tempNode);
        } else {
          tempNode = { begin: begin + i, end: begin + i + 1 };
          tempNode.type = "text";
          tempNode.text = text[i];
          parts.push(tempNode);
        }
      }
      if (parts.length === 1) {
        return parts[0];
      }
      node.type = "cat";
      node.parts = parts;
    }
    return node;
  },

  parseRegex(text: any) {
    return this.parseSub(text, 0, text.length, true);
  },
};

const nfaGenerator = {
  generateGraph(node: any, start: any, end: any, count: any) {
    var i, last, temp, tempStart, tempEnd;
    if (!start.hasOwnProperty("id")) {
      start.id = count;
      count += 1;
    }
    switch (node.type) {
      case "empty":
        start.edges.push(["ϵ", end]);
        break;
      case "text":
        start.edges.push([node.text, end]);
        break;
      case "cat":
        last = start;
        for (i = 0; i < node.parts.length - 1; i += 1) {
          temp = { type: "", edges: [] };
          count = nfaGenerator.generateGraph(node.parts[i], last, temp, count);
          last = temp;
        }
        count = nfaGenerator.generateGraph(
          node.parts[node.parts.length - 1],
          last,
          end,
          count
        );
        break;
      case "or":
        for (i = 0; i < node.parts.length; i += 1) {
          tempStart = { type: "", edges: [] };
          tempEnd = { type: "", edges: [["ϵ", end]] };
          start.edges.push(["ϵ", tempStart]);
          count = nfaGenerator.generateGraph(
            node.parts[i],
            tempStart,
            tempEnd,
            count
          );
        }
        break;
      case "star":
        tempStart = { type: "", edges: [] };
        tempEnd = {
          type: "",
          edges: [
            ["ϵ", tempStart],
            ["ϵ", end],
          ],
        };
        start.edges.push(["ϵ", tempStart]);
        start.edges.push(["ϵ", end]);
        count = nfaGenerator.generateGraph(node.sub, tempStart, tempEnd, count);
        break;
    }
    if (!end.hasOwnProperty("id")) {
      end.id = count;
      count += 1;
    }
    return count;
  },

  regexToNfa(text: any) {
    var ast = syntaxTreeParser.parseRegex(text),
      start = { type: "start", edges: [] },
      accept = { type: "accept", edges: [] };
    if (typeof ast === "string") {
      return ast;
    }
    nfaGenerator.generateGraph(ast, start, accept, 0);
    return start;
  },
};

const nfaDisplay = {
  displayNfa(nfa: any): ENFADataProps {
    const enfaData: ENFADataProps = {
      alphabets: [],
      states: [],
      startState: "",
      finalStates: [],
      transitions: {},
      epsilonTransitions: {},
    };

    console.log("ϵ-NFA:");
    let visited = new Set();

    function printNode(node: any) {
      const nodeType = String(node.type);
      const nodeId = String(node.id);

      if (!enfaData.states.includes("q" + nodeId))
        enfaData.states.push("q" + nodeId);
      if (nodeType === "start") enfaData.startState = String("q" + nodeId);

      if (visited.has(node)) return;
      visited.add(node);

      if (node.type !== "accept") {
        console.log(nodeType + " " + nodeId + ":");
      }

      for (const edge of node.edges) {
        const alphabet = String(edge[0]);
        const to = String(edge[1].id);
        const toType = String(edge[1].type);

        if (alphabet === "ϵ") {
          enfaData.epsilonTransitions["q" + nodeId] = [
            ...(enfaData.epsilonTransitions["q" + nodeId] ?? []),
            "q" + to,
          ];
        } else {
          if (!enfaData.alphabets.includes(alphabet))
            enfaData.alphabets.push(alphabet);
          enfaData.transitions["q" + nodeId] = {
            ...enfaData.transitions["q" + nodeId],
            [alphabet]: ["q" + to],
          };
        }

        if (toType === "accept")
          if (!enfaData.finalStates.includes("q" + to))
            enfaData.finalStates.push("q" + to);

        console.log(`  ${alphabet} -> ${toType} ${to}`);
      }

      for (const edge of node.edges) {
        printNode(edge[1]);
      }
    }

    printNode(nfa);

    return enfaData;
  },
};

const refineENFA = (data: ENFADataProps) => {
  const result: ENFADataProps = {
    alphabets: data.alphabets,
    states: data.states,
    startState: data.startState,
    finalStates: data.finalStates,
    transitions: {},
    epsilonTransitions: {},
  };

  for (const state of data.states) {
    result.transitions[state] = {};

    for (const alphabet of data.alphabets) {
      if (data.transitions[state] && data.transitions[state][alphabet]) {
        result.transitions[state][alphabet] = data.transitions[state][alphabet];
      } else {
        result.transitions[state][alphabet] = [];
      }
    }

    if (data.epsilonTransitions[state]) {
      result.epsilonTransitions[state] = data.epsilonTransitions[state];
    } else {
      result.epsilonTransitions[state] = [];
    }
  }

  return result;
};

const convertRegexToENFA = (regex: string) => {
  const ast = syntaxTreeParser.parseRegex(regex);
  if (typeof ast === "string") {
    console.error("Error:", ast);
    return;
  }

  const nfa = nfaGenerator.regexToNfa(regex);
  if (typeof nfa === "string") {
    console.error("Error:", nfa);
    return;
  }

  const enfaData = nfaDisplay.displayNfa(nfa);
  const refinedEnfaData = refineENFA(enfaData);

  return {
    others: { regex, ast },
    enfaData: refinedEnfaData,
  };
};

export const regexConverterRepository = {
  convertRegexToENFA,
};

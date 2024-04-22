import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";

type Props = {
  data: any;
};

export default function JsonViewComponent(props: Props) {
  if (props.data)
    return (
      <>
        <JsonView
          value={props.data}
          style={githubLightTheme}
          enableClipboard={false}
          displayDataTypes={false}
        />
      </>
    );
  else return <></>;
}

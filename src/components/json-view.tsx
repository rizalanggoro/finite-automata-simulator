import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";

type Props = {
  data: any;
  title?: string;
};

export default function JsonViewComponent(props: Props) {
  if (props.data)
    return (
      <>
        {props.title && (
          <p className="font-medium text-sm">
            {">"} {props.title}
          </p>
        )}
        <JsonView
          value={props.data}
          style={githubLightTheme}
          enableClipboard={false}
          displayDataTypes={false}
          collapsed
        />
      </>
    );
  else return <></>;
}

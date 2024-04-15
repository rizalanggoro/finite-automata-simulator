import mermaid from "mermaid";
import { useEffect } from "react";

mermaid.initialize({
  securityLevel: "loose",
  theme: "neutral",
});

export default function MermaidComponent({
  chart,
  id,
}: {
  chart: string;
  id: string;
}) {
  useEffect(() => {
    document.getElementById(id)?.removeAttribute("data-processed");
    mermaid.contentLoaded();
  }, [chart, id]);

  return (
    <div className="mermaid" id={id}>
      {chart}
    </div>
  );
}

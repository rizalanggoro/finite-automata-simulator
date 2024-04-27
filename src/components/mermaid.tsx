import { CircleHelp, Clipboard, ClipboardCheck } from "lucide-react";
import mermaid from "mermaid";
import Link from "next/link";
import { useEffect } from "react";
import useClipboard from "react-use-clipboard";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

mermaid.initialize({
  securityLevel: "loose",
  theme: "forest",
});

export default function MermaidComponent({
  chart,
  id,
}: {
  chart: string;
  id: string;
}) {
  const [isCopied, setCopied] = useClipboard(chart);
  const { toast } = useToast();

  useEffect(() => {
    if (isCopied) {
      toast({
        title: "Berhasil!",
        description: "Kode state diagram berhasil disalin ke clipboard!",
      });
    }
  }, [isCopied]);

  useEffect(() => {
    document.getElementById(id)?.removeAttribute("data-processed");
    mermaid.contentLoaded();
  }, [chart, id]);

  return (
    <div>
      <div className="mermaid justify-center flex py-8" id={id}>
        {chart}
      </div>

      <div className="flex items-start gap-4 border rounded-lg bg-card p-4">
        <CircleHelp className="w-4 h-4 my-1" />

        <div className="flex-1">
          <p className="font-semibold">
            State diagram tidak terlihat dengan jelas?
          </p>
          <p className="text-sm">
            Salin kode state diagram dengan menekan tombol di samping, kemudian
            tempelkan pada website{" "}
            <Button asChild variant={"link"} className="p-0 h-fit">
              <Link href={"https://mermaid.live"} target="_blank">
                mermaid.live
              </Link>
            </Button>
            .
          </p>
        </div>

        <Button onClick={setCopied} size={"icon"} variant={"secondary"}>
          {isCopied ? (
            <ClipboardCheck className="w-4 h-4" />
          ) : (
            <Clipboard className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

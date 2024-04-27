import { Clipboard } from "lucide-react";
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

      <div className="flex justify-end items-center gap-4">
        <p className="text-sm">
          State diagram tidak terlihat dengan jelas? Salin kode state diagram
          kemudian tempelkan pada website{" "}
          <Button asChild variant={"link"} className="px-0">
            <Link href={"https://mermaid.live"} target="_blank">
              mermaid.live
            </Link>
          </Button>
        </p>
        <Button onClick={setCopied}>
          <Clipboard className="w-4 h-4 mr-2" />
          Salin kode
        </Button>
      </div>
    </div>
  );
}

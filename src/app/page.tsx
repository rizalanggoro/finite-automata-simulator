import ContainerComponent from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlignJustify,
  Minimize2,
  Regex,
  Repeat,
  SpellCheck,
} from "lucide-react";
import Link from "next/link";

type MenuItem = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  href: string;
};

const menus: Array<MenuItem> = [
  {
    icon: <Repeat className="w-4 h-4" />,
    title: "NFA, E-NFA Konverter",
    description:
      "Simulator untuk menghasilkan sebuah DFA berdasarkan masukan NFA atau E-NFA dari pengguna",
    href: "/v2/nfa-enfa-converter",
  },
  {
    icon: <Regex className="w-4 h-4" />,
    title: "Regex Konverter",
    description:
      "Simulator untuk menghasilkan sebuah e-NFA sesuai dengan regular expression yang dimasukkan oleh pengguna",
    href: "/v2/regex-converter",
  },
  {
    icon: <Minimize2 className="w-4 h-4" />,
    title: "Minimisasi DFA",
    description:
      "Simulator untuk mengubah DFA menjadi minimal dimana pengguna dapat mengetes kedua DFA tersebut (sebelum dan sesudah minimalisasi)",
    href: "/v2/dfa-minimization",
  },
  {
    icon: <AlignJustify className="w-4 h-4" />,
    title: "DFA Ekuivalensi",
    description:
      "Simulator untuk mengecek ekuivalensi antara dua buah masukan DFA",
    href: "/v2/dfa-equivalence",
  },
  {
    icon: <SpellCheck className="w-4 h-4" />,
    title: "DFA, NFA, e-NFA, Regex Validator",
    description: "lorem ipsum",
    href: "/",
  },
];

export default function Page() {
  return (
    <>
      <ContainerComponent safeTop variant="sm" className="py-8">
        <p className="text-2xl font-semibold">Finite Automata Simulator</p>
        <p className="mt-2">
          Berikut beberapa tools yang tersedia untuk menyimulasikan Finite
          Automata
        </p>

        <div className="grid md:hidden grid-cols-1 gap-2 mt-8">
          {menus.map((menu, index) => (
            <GridItemCard key={"mobile-grid-item-" + index} menu={menu} />
          ))}
        </div>

        <div className="hidden md:grid grid-cols-2 gap-2 mt-8">
          <div className="grid grid-cols-1 gap-2 h-fit">
            {menus.map((menu, index) =>
              index % 2 == 0 ? (
                <GridItemCard
                  key={"desktop-left-grid-item-" + index}
                  menu={menu}
                />
              ) : (
                <></>
              )
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 h-fit">
            {menus.map((menu, index) =>
              index % 2 == 1 ? (
                <GridItemCard
                  key={"desktop-right-grid-item-" + index}
                  menu={menu}
                />
              ) : (
                <></>
              )
            )}
          </div>
        </div>
      </ContainerComponent>
    </>
  );
}

type GridItemCardProps = {
  menu: MenuItem;
};
function GridItemCard({ menu }: GridItemCardProps) {
  return (
    <>
      <Link href={menu.href}>
        <Card className={cn(menu.href === "/" && "opacity-30")}>
          <CardHeader>
            {menu.icon && (
              <Button size={"icon"} variant={"secondary"}>
                {menu.icon}
              </Button>
            )}

            <CardTitle className="text-lg pt-2">{menu.title}</CardTitle>
            <CardDescription>
              {menu.href === "/"
                ? "Dalam tahap pengembangan..."
                : menu.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </>
  );
}

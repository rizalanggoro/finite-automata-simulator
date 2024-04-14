import ContainerComponent from "@/components/container";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type MenuItem = {
  title: string;
  description: string;
  href: string;
};

const menus: Array<MenuItem> = [
  {
    title: "NFA, e-NFA Konverter",
    description:
      "Simulator untuk menghasilkan sebuah DFA berdasarkan masukan NFA atau e-NFA dari pengguna",
    href: "/",
  },
  {
    title: "Regex Koverter",
    description:
      "Simulator untuk menghasilkan sebuah e-NFA sesuai dengan regular expression yang dimasukkan oleh pengguna",
    href: "/",
  },
  {
    title: "Minimisasi DFA",
    description:
      "Simulator untuk mengubah DFA menjadi minimal dimana pengguna dapat mengetes kedua DFA tersebut (sebelum dan sesudah minimalisasi)",
    href: "/dfa-minimization",
  },
  { title: "DFA Ekuivalensi", description: "lorem ipsum", href: "/" },
  {
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
            <GridItemCard menu={menu} />
          ))}
        </div>

        <div className="hidden md:grid grid-cols-2 gap-2 mt-8">
          <div className="grid grid-cols-1 gap-2 h-fit">
            {menus.map((menu, index) =>
              index % 2 == 0 ? <GridItemCard menu={menu} /> : <></>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 h-fit">
            {menus.map((menu, index) =>
              index % 2 == 1 ? <GridItemCard menu={menu} /> : <></>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{menu.title}</CardTitle>
            <CardDescription>{menu.description}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </>
  );
}

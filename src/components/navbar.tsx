import Link from "next/link";
import ContainerComponent from "./container";
import { Button } from "./ui/button";

type MenuItem = {
  title: string;
  href: string;
};
const menus: Array<MenuItem> = [
  // { title: "Dokumentasi", href: "/docs" },
  { title: "Tentang", href: "/about" },
];

export default function NavbarComponent() {
  return (
    <>
      <div className="fixed top-0 w-full z-10 h-1 bg-gradient-to-r from-lime-300 to-amber-300"></div>
      <div className="border-b h-16 w-full fixed top-0 mt-1 z-10 backdrop-blur bg-background/10">
        <ContainerComponent
          variant="lg"
          className="flex items-center justify-between h-16"
        >
          <Link href={"/"}>
            <Button
              variant={"link"}
              className="text-primary font-semibold px-0"
            >
              Finite Automata
            </Button>
          </Link>

          <div className="flex items-center gap-6">
            {menus.map((menu, index) => (
              <Link href={menu.href}>
                <Button
                  variant={"link"}
                  className="text-muted-foreground font-normal px-0"
                >
                  {menu.title}
                </Button>
              </Link>
            ))}
          </div>
        </ContainerComponent>
      </div>
    </>
  );
}

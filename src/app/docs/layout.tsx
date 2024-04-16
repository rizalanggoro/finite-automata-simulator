import ContainerComponent from "@/components/container";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <ContainerComponent variant="sm" safeTop className="prose py-8">
      {children}
    </ContainerComponent>
  );
}

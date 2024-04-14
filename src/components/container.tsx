import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sm" | "md" | "lg";
  children: React.ReactNode;
  safeTop?: boolean;
}

export default function ContainerComponent({
  variant = "md",
  ...props
}: Props) {
  return (
    <>
      <div
        className={cn(
          "mx-auto px-4",
          variant === "sm" && "max-w-[600px]",
          variant === "md" && "max-w-[768px]",
          variant === "lg" && "max-w-[1024px]",
          props.className,
          props.safeTop && "mt-16"
        )}
      >
        {props.children}
      </div>
    </>
  );
}

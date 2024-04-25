"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

type Props = {
  items: {
    label: string;
    href: string;
  }[];
};

export default function BreadCrumbComponent(props: Props) {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {props.items.map((item, index) => {
            const components: React.ReactNode[] = [];

            components.push(
              <BreadcrumbItem key={"breadcrumb-item-" + index}>
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            );

            if (index < props.items.length - 1) {
              components.push(
                <BreadcrumbSeparator key={"breadcrumb-separator-" + index} />
              );
            }

            return components;
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}

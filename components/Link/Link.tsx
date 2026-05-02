import NextLink, { LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

const Link: React.FunctionComponent<Props> = ({ children, ...props }) => {
  return (
    <NextLink {...props} as={`${basePath}${props.href}`}>
      {children}
    </NextLink>
  );
};

export default Link;

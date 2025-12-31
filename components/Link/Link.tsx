import NextLink, { LinkProps } from "next/link";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface ChidrenProps {
  children: React.ReactNode;
}

const Link: React.FunctionComponent<ChidrenProps & LinkProps> = ({
  children,
  ...props
}) => {
  return (
    <NextLink
      {...props}
      as={`${basePath}${props.href}`}
    >
      {children}
    </NextLink>
  );
};

export default Link;

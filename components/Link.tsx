import NextLink, { LinkProps } from "next/link";
import { format } from "url";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const Link: React.FunctionComponent<LinkProps> = ({ children, ...props }) => {
  console.log(format(props.href));
  return (
    <NextLink
      {...props}
      as={`${publicRuntimeConfig.basePath || ""}${format(props.href)}`}
    >
      {children}
    </NextLink>
  );
};

export default Link;

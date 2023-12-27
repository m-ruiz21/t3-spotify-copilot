import { TRPCReactProvider } from "@/trpc/react";
import { ChakraProvider } from "@chakra-ui/react";
import { NextAuthProvider } from "./next-auth-provider";

import { cookies } from "next/headers";

interface ProvidersProps {
  session: any;
  children?: React.ReactNode;
};

export const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <TRPCReactProvider cookies={cookies().toString()}>
      <NextAuthProvider session={session}>
        <ChakraProvider>
          {children}
        </ChakraProvider> 
      </NextAuthProvider>
    </TRPCReactProvider>
  );
};
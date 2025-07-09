'use client';
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";


interface QueryProviderProps {
    children: ReactNode;
}

export const QueryProvider = ({children}:QueryProviderProps) => {
    const [queryClient] = useState(() => new QueryClient())

    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
}
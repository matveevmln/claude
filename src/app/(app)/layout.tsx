import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}

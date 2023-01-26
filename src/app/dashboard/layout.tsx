import BodyWithSidebar from '@share/components/layout/BodyWidthSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BodyWithSidebar>{children}</BodyWithSidebar>;
}

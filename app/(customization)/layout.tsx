import NavBar from "@/app/ui/nav";

export default function CustomizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

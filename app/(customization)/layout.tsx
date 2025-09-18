import NavBar from "@/app/ui/nav";

export default function CustomizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <NavBar />
      {children}
    </div>
  );
}

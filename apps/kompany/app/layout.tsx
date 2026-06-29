import "./globals.css";

export const metadata = {
  title: "Company Brain",
  description: "Organizational Knowledge Graph Interface",
};

/**
 * Root Layout for the Next.js App Router.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

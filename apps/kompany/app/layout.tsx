import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

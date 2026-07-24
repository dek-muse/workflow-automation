import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = { title: "FlowPilot AI", description: "Multi-tenant AI workflow automation for modern operations teams." };

const stripExtensionAttributes = `
  document.querySelectorAll("*").forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name.startsWith("bis_") || attribute.name.startsWith("__processed_")) {
        element.removeAttribute(attribute.name);
      }
    }
  });
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning>
    <body suppressHydrationWarning>
      <Script id="strip-extension-hydration-attributes" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: stripExtensionAttributes }} />
      {children}
    </body>
  </html>;
}
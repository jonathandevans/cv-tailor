import { Metadata } from "next";

export function generateMetadata({
  title,
  absolute,
  description = "Use our free online CV builder to make perfect CVs, to land your dream job using our ready-to-go templates which you can customise to perfection. Create and download your CVs as PDFs in minutes.",
}: {
  title?: string;
  absolute?: string;
  description?: string;
} = {}): Metadata {
  const _title = absolute
    ? absolute
    : title
    ? `${title} - CV Tailor`
    : "CV Tailor";

  return {
    title: _title,
    description,
    keywords: ["CV", "Resume", "Custom", "Build"],

    openGraph: {
      title,
      description,
      images: [{ url: "/icon.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/icon.png"],
    },

    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

import { siteConfig } from "@/data/siteConfig";

/** schema.org Person + WebSite structured data. Only configured socials are listed. */
export default function JsonLd() {
  const sameAs = Object.values(siteConfig.socials).filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        jobTitle: siteConfig.role,
        description: siteConfig.seo.description,
        url: siteConfig.url,
        image: `${siteConfig.url}${siteConfig.media.portrait.src}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.location.city,
          addressCountry: "IN",
        },
        knowsAbout: siteConfig.about.expertise,
        ...(sameAs.length ? { sameAs } : {}),
        ...(siteConfig.contact.email ? { email: `mailto:${siteConfig.contact.email}` } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

import Script from "next/script";

export const metadata = {
  title: "Test | Discover Malmö",
  robots: { index: false, follow: false },
};

export default function TestPage() {
  return (
    <>
      <Script
        id="travelpayouts"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(){var s=document.createElement("script");s.async=1;s.src='https://tpembars.com/NTIyNTkw.js?t=522590';document.head.appendChild(s);})();`,
        }}
      />
      <main style={{ padding: "4rem 2rem", maxWidth: 800, margin: "0 auto" }}>
        <h1>Test</h1>
      </main>
    </>
  );
}

import Script from "next/script";

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="travelpayouts"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(){var s=document.createElement("script");s.async=1;s.src='https://tpembars.com/NTIyNTkw.js?t=522590';document.head.appendChild(s);})();`,
        }}
      />
      <Script
        id="tpwl"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(){var s=document.createElement("script");s.async=1;s.type="module";s.src="https://tpemd.com/wl_web/main.js?wl_id=16742";document.head.appendChild(s);})();`,
        }}
      />
      {children}
    </>
  );
}

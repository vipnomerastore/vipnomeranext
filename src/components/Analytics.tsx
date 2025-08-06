import Script from "next/script";

export default function Analytics() {
  const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

  return (
    <>
      {/* Yandex Metrica */}
      {YM_ID && (
        <>
          <Script id="yandex-metrica" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(${YM_ID}, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true,
                   webvisor:true
              });
            `}
          </Script>
          {/* Yandex Metrica noscript */}
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${YM_ID}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}
    </>
  );
}

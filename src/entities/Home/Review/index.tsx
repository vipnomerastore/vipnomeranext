import { useEffect } from "react";

const HomeReview = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.reviewlab.ru/widget/index-es2015.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /* @ts-ignore */
  return <review-lab data-widgetid="67ef70eed1c28064fc680007" />;
};

export default HomeReview;

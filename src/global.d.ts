import React from "react";

declare global {
  interface Window {
    ymaps: {
      ready: (callback: () => void) => void;
      Map: new (container: string | HTMLElement, options: unknown) => unknown;
      Placemark: new (
        coordinates: number[],
        properties: unknown,
        options: unknown
      ) => unknown;
      control: { ZoomControl: new (options?: unknown) => unknown };
    };
  }
  namespace JSX {
    interface IntrinsicElements {
      "review-lab": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "data-widgetid": string },
        HTMLElement
      >;
      "review-lab-simple": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "data-widgetid": string },
        HTMLElement
      >;
      "review-lab-rating": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "data-widgetid": string },
        HTMLElement
      >;
    }
  }
}

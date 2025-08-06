import { Toaster } from "react-hot-toast";

const ToasterConfig = () => (
  <Toaster
    toastOptions={{
      style: {
        background: "#242423",
        color: "#fff",
        border: "1px solid #2b2b2b",
        borderRadius: "12px",
        padding: "12px 16px",
      },
      success: {
        style: {
          borderLeft: "4px solid #d9ad49",
        },
      },
      error: {
        style: {
          borderLeft: "4px solid #ff6b6b",
        },
      },
    }}
  />
);

export default ToasterConfig;

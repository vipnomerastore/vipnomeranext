import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "none",

          ":before": {
            display: "none",
          },

          "&.Mui-expanded": {
            borderRadius: "10px !important",
            border: "1px solid #d9ad49",
          },
        },
      },
    },
  },
});

"use client";

import { Pagination, SxProps, Theme } from "@mui/material";

interface PaginationClientProps {
  page: number;
  count: number;
}

export const paginationStyle: SxProps<Theme> = {
  "& .MuiPaginationItem-root": {
    color: "#ffffff",
    backgroundColor: "transparent",
    border: "1px solid #333333",
    borderRadius: "10px",
    margin: "0 5px",
    minWidth: "40px",
    height: "40px",
    fontSize: "14px",
    fontWeight: "600",
    "&:hover": {
      backgroundColor: "rgba(253, 252, 164, 0.1)",
      borderColor: "#fdfca4",
    },
    "&.Mui-selected": {
      borderColor: "#fdfca4",
      "&:hover": {},
    },
  },
};

export default function PaginationClient({
  page,
  count,
}: PaginationClientProps) {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (value === 1) {
      window.location.href = "/blog";
    } else {
      window.location.href = `/blog?page=${value}`;
    }
  };

  return (
    <Pagination
      page={page}
      onChange={handleChange}
      count={count}
      shape="rounded"
      sx={paginationStyle}
      siblingCount={1}
      boundaryCount={1}
    />
  );
}

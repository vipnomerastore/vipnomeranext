"use client";

import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Image from "next/image"; // <-- импортируем Image

import styles from "./Menu.module.scss";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    transformOrigin={{ vertical: "top", horizontal: "center" }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    padding: "0 !important",
    minWidth: 150,
    color: "#ffffff",
    backgroundColor: "#212121",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",

    "& .MuiMenu-list": {
      padding: "4px 0",
    },

    "& .MuiMenuItem-root": {
      padding: "8px 16px",
      fontSize: 14,
      color: "#ffffff",
      backgroundColor: "#212121",
      transition: "background-color 0.2s ease",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      "&:hover": {
        backgroundColor: "#2c2c2c",
      },

      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

interface CustomizedMenusProps {
  sortBy: string;
  order: "asc" | "desc" | "none";
  onSortChange: (sortBy: string, order: "asc" | "desc" | "none") => void;
}

export default function CustomizedMenus({
  sortBy,
  order,
  onSortChange,
}: CustomizedMenusProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (newSortBy: string, newOrder: "asc" | "desc" | "none") => {
    onSortChange(newSortBy, newOrder);
    handleClose();
  };

  const options = [
    { label: "По умолчанию", sortBy: "none", order: "none" as const },
    { label: "Сначала дешевле", sortBy: "price", order: "asc" as const },
    { label: "Сначала дороже", sortBy: "price", order: "desc" as const },
  ];

  const currentOption =
    options.find((opt) => opt.sortBy === sortBy && opt.order === order) ||
    options[0];

  return (
    <div>
      <Button
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        sx={{
          backgroundColor: "transparent",
          textTransform: "none",
          color: "#ffffff",
          maxWidth: 170,
          minWidth: 170,
          padding: "8px 4px",
        }}
        disableElevation
        onClick={handleClick}
        endIcon={
          <div className={styles.endIcon}>
            <Image
              src="/assets/home/sorting/arrow.svg"
              alt="arrow"
              width={12}
              height={12}
              priority
            />
          </div>
        }
      >
        {currentOption.label}
      </Button>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option) => (
          <MenuItem
            key={`${option.sortBy}:${option.order}`}
            onClick={() => handleSort(option.sortBy, option.order)}
            disableRipple
            selected={sortBy === option.sortBy && order === option.order}
          >
            {option.label}
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}

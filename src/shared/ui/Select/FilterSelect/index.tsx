"use client";

import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Image from "next/image"; // импорт next/image

import styles from "./OperatorSelect.module.scss";

interface OperatorSelectProps {
  operator: string;
  setOperator: (value: string) => void;
  data: { name: string; icon?: string; id: number }[];
}

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
    minWidth: 180,
    maxHeight: 200,
    color: "#ffffff",
    backgroundColor: "#212121",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    overflowY: "auto",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "& .MuiMenuItem-root": {
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const FilterSelect = (props: OperatorSelectProps) => {
  const { operator, setOperator, data } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const current = data.find((o) => o.name === operator) || data[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (name: string) => {
    setOperator(name);
    handleClose();
  };

  const buttonStyle = {
    background: "transparent",
    textTransform: "none",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: 500,
    padding: 0,
    minWidth: 140,
    maxWidth: 140,
  };

  const endIcon = (
    <div className={styles.endIcon}>
      <Image
        src="/assets/home/sorting/arrow.svg"
        alt="arrow"
        width={16}
        height={16}
        priority
      />
    </div>
  );

  const boxStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <Button
        aria-controls={open ? "operator-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        sx={buttonStyle}
        disableElevation
        onClick={handleClick}
        endIcon={endIcon}
      >
        <Box sx={boxStyle}>
          {current.icon && (
            <Image
              src={current.icon}
              alt={current.name}
              width={20}
              height={20}
              priority
            />
          )}
          {current.name}
        </Box>
      </Button>
      <StyledMenu
        id="operator-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        container={() => document.body}
        keepMounted
      >
        {data.map((opt) => (
          <MenuItem
            key={opt.id}
            selected={opt.name === operator}
            onClick={() => handleSelect(opt.name)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {opt.icon && (
                <Image
                  src={opt.icon}
                  alt={opt.name}
                  width={20}
                  height={20}
                  priority
                />
              )}
              {opt.name}
            </Box>
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
};

export default FilterSelect;

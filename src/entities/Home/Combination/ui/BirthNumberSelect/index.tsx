import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Image from "next/image";

import styles from "../OperatorSelect/OperatorSelect.module.scss";

interface BirthNumberSelectProps {
  birthNumber: string;
  setBirthNumber: (value: string) => void;
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
    minWidth: 130,
    maxHeight: 250,
    color: "#fff",
    backgroundColor: "#212121",
    boxShadow:
      "0 0 0 0 rgba(255, 255, 255, 0), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    "& .MuiMenu-list": {
      padding: "4px 0",
      maxHeight: 250,
      overflowY: "auto",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    "& .MuiMenuItem-root:active": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity
      ),
    },
  },
}));

const birthNumberOptions = [
  { id: 0, name: "Год рождения", icon: null },
  { id: 1, name: "1960-е", icon: null },
  { id: 2, name: "1970-е", icon: null },
  { id: 3, name: "1980-е", icon: null },
  { id: 4, name: "1990-е", icon: null },
  { id: 5, name: "2000-е", icon: null },
  { id: 6, name: "2010-е", icon: null },
];

const BirthNumberSelect: React.FC<BirthNumberSelectProps> = ({
  birthNumber,
  setBirthNumber,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentOption =
    birthNumberOptions.find((o) => o.name === birthNumber) ??
    birthNumberOptions[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (name: string) => {
    setBirthNumber(name);
    handleClose();
  };

  return (
    <>
      <Button
        aria-controls={open ? "birth-number-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        sx={{
          background: "transparent",
          textTransform: "none",
          color: "#fff",
          borderRadius: "10px",
          fontWeight: 500,
          padding: 0,
          minWidth: 130,
          maxWidth: 130,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        endIcon={
          <div className={styles.endIcon}>
            <Image
              src="/assets/home/sorting/arrow.svg"
              alt="arrow"
              width={16}
              height={16}
            />
          </div>
        }
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {currentOption.icon && (
            <Image
              loading="lazy"
              src={currentOption.icon}
              width={20}
              height={20}
              alt={currentOption.name}
            />
          )}
          {currentOption.name}
        </Box>
      </Button>

      <StyledMenu
        id="birth-number-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        container={() => document.body}
      >
        {birthNumberOptions.map(({ id, name, icon }) => (
          <MenuItem
            key={id}
            selected={name === birthNumber}
            onClick={() => handleSelect(name)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {icon && (
                <Image
                  loading="lazy"
                  src={icon}
                  width={20}
                  height={20}
                  alt={name}
                />
              )}
              {name}
            </Box>
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

export default BirthNumberSelect;

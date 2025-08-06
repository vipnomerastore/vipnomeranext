import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Image from "next/image";

import styles from "./OperatorSelect.module.scss";

interface OperatorSelectProps {
  operator: string;
  setOperator: (value: string) => void;
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
    overflowY: "auto", // Позволяет прокручивать, если много элементов
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

const operatorOptions = [
  { id: 0, name: "Все операторы", icon: null },
  { id: 1, name: "МТС", icon: "/assets/home/operators/mts.svg" },
  { id: 2, name: "Билайн", icon: "/assets/home/operators/beeline.svg" },
  { id: 3, name: "Мегафон", icon: "/assets/home/operators/megafon.svg" },
  { id: 4, name: "Теле 2", icon: "/assets/home/promotion/tele2.svg" },
];

const OperatorSelect: React.FC<OperatorSelectProps> = ({
  operator,
  setOperator,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = Boolean(anchorEl);

  const current =
    operatorOptions.find((o) => o.name === operator) || operatorOptions[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (name: string) => {
    setOperator(name);
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls={open ? "operator-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        sx={{
          background: "transparent",
          textTransform: "none",
          color: "#fff",
          borderRadius: "10px",
          fontWeight: 500,
          padding: 0,
          minWidth: 140,
          maxWidth: 140,
        }}
        disableElevation
        onClick={handleClick}
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
          }}
        >
          {current.icon && (
            <Image
              src={current.icon}
              width={20}
              height={20}
              alt={current.name}
            />
          )}
          {current.name}
        </Box>
      </Button>

      {mounted && (
        <StyledMenu
          id="operator-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          container={() => document.body}
          keepMounted
        >
          {operatorOptions.map((opt) => (
            <MenuItem
              key={opt.id}
              selected={opt.name === operator}
              onClick={() => handleSelect(opt.name)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {opt.icon && (
                  <Image src={opt.icon} alt={opt.name} width={20} height={20} />
                )}
                {opt.name}
              </Box>
            </MenuItem>
          ))}
        </StyledMenu>
      )}
    </div>
  );
};

export default OperatorSelect;

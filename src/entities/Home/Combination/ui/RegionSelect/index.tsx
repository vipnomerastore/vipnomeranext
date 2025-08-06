import { useEffect, useRef, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Image from "next/image";

import styles from "../OperatorSelect/OperatorSelect.module.scss";

interface OperatorSelectProps {
  region: string;
  setRegion: (value: string) => void;
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
    width: 250,
    height: 250,
    color: "#ffffff",
    backgroundColor: "#212121",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    overflowY: "visible",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "& .MuiMenu-list": {
      padding: "8px",
    },
    "& .MuiMenuItem-root": {
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    "& .MuiTextField-root": {
      marginBottom: 8,
      "& .MuiInputBase-root": {
        height: 40,
        borderRadius: "8px",
        backgroundColor: "#2A2A2A",
        color: "#fff",
        padding: "0 8px",
        "& .MuiInputBase-input": {
          padding: "8px",
          fontSize: "0.875rem",
        },
        "& .MuiInputBase-input::placeholder": {
          color: "#787878",
          opacity: 1,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: "2px solid #f5ea8f",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "2px solid #f5ea8f",
        },
      },
    },
  },
}));

const regionOptions = [
  { id: 0, name: "Регионы", icon: null },
  { id: 1, name: "Алтайский край", icon: null },
  { id: 2, name: "Амурская область", icon: null },
  { id: 3, name: "Архангельская область", icon: null },
  { id: 4, name: "Астраханская область", icon: null },
  { id: 5, name: "Байконур", icon: null },
  { id: 6, name: "Белгородская область", icon: null },
  { id: 7, name: "Брянская область", icon: null },
  { id: 8, name: "Владимирская область", icon: null },
  { id: 9, name: "Волгоградская область", icon: null },
  { id: 10, name: "Вологодская область", icon: null },
  { id: 11, name: "Воронежская область", icon: null },
  { id: 12, name: "Еврейская автономная область", icon: null },
  { id: 13, name: "Забайкальский край", icon: null },
  { id: 14, name: "Ивановская область", icon: null },
  { id: 15, name: "Иркутская область", icon: null },
  { id: 16, name: "Кабардино-Балкарская Республика", icon: null },
  { id: 17, name: "Калининградская область", icon: null },
  { id: 18, name: "Калужская область", icon: null },
  { id: 19, name: "Камчатский край", icon: null },
  { id: 20, name: "Кемеровская область", icon: null },
  { id: 21, name: "Кировская область", icon: null },
  { id: 22, name: "Костромская область", icon: null },
  { id: 23, name: "Краснодарский край", icon: null },
  { id: 24, name: "Красноярский край", icon: null },
  { id: 25, name: "Курганская область", icon: null },
  { id: 26, name: "Курская область", icon: null },
  { id: 27, name: "Ленинградская область", icon: null },
  { id: 28, name: "Липецкая область", icon: null },
  { id: 29, name: "Магаданская область", icon: null },
  { id: 30, name: "Москва", icon: null },
  { id: 31, name: "Московская область", icon: null },
  { id: 32, name: "Мурманская область", icon: null },
  { id: 33, name: "Ненецкий автономный округ", icon: null },
  { id: 34, name: "Нижегородская область", icon: null },
  { id: 35, name: "Новгородская область", icon: null },
  { id: 36, name: "Новосибирская область", icon: null },
  { id: 37, name: "Омская область", icon: null },
  { id: 38, name: "Оренбургская область", icon: null },
  { id: 39, name: "Орловская область", icon: null },
  { id: 40, name: "Пензенская область", icon: null },
  { id: 41, name: "Пермский край", icon: null },
  { id: 42, name: "Приморский край", icon: null },
  { id: 43, name: "Псковская область", icon: null },
  { id: 44, name: "Республика Адыгея", icon: null },
  { id: 45, name: "Республика Алтай (Горный Алтай)", icon: null },
  { id: 46, name: "Республика Башкортостан", icon: null },
  { id: 47, name: "Республика Бурятия", icon: null },
  { id: 48, name: "Республика Дагестан", icon: null },
  { id: 49, name: "Республика Ингушетия", icon: null },
  { id: 50, name: "Республика Калмыкия", icon: null },
  { id: 51, name: "Республика Карачаево-Черкессия", icon: null },
  { id: 52, name: "Республика Карелия", icon: null },
  { id: 53, name: "Республика Коми", icon: null },
  { id: 54, name: "Республика Марий Эл", icon: null },
  { id: 55, name: "Республика Мордовия", icon: null },
  { id: 56, name: "Республика Саха (Якутия)", icon: null },
  { id: 57, name: "Республика Северная Осетия - Алания", icon: null },
  { id: 58, name: "Республика Татарстан", icon: null },
  { id: 59, name: "Республика Тыва", icon: null },
  { id: 60, name: "Республика Хакасия", icon: null },
  { id: 61, name: "Ростовская область", icon: null },
  { id: 62, name: "Рязанская область", icon: null },
  { id: 63, name: "Самарская область", icon: null },
  { id: 64, name: "Санкт-Петербург", icon: null },
  { id: 65, name: "Саратовская область", icon: null },
  { id: 66, name: "Сахалинская область", icon: null },
  { id: 67, name: "Свердловская область", icon: null },
  { id: 68, name: "Севастополь", icon: null },
  { id: 69, name: "Смоленская область", icon: null },
  { id: 70, name: "Ставропольский край", icon: null },
  { id: 71, name: "Тамбовская область", icon: null },
  { id: 72, name: "Тверская область", icon: null },
  { id: 73, name: "Томская область", icon: null },
  { id: 74, name: "Тульская область", icon: null },
  { id: 75, name: "Тюменская область", icon: null },
  { id: 76, name: "Удмуртская Республика", icon: null },
  { id: 77, name: "Ульяновская область", icon: null },
  { id: 78, name: "Хабаровский край", icon: null },
  { id: 79, name: "Ханты-Мансийский АО - Югра", icon: null },
  { id: 80, name: "Челябинская область", icon: null },
  { id: 81, name: "Чеченская Республика", icon: null },
  { id: 82, name: "Чувашская Республика", icon: null },
  { id: 83, name: "Чукотский АО", icon: null },
  { id: 84, name: "Ямало-Ненецкий АО", icon: null },
  { id: 85, name: "Ярославская область", icon: null },
];

const RegionSelect: React.FC<OperatorSelectProps> = ({ region, setRegion }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const open = Boolean(anchorEl);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const current =
    regionOptions.find((o) => o.name === region) || regionOptions[0];

  const filteredOptions = regionOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSearchQuery("");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery("");
  };

  const handleSelect = (name: string) => {
    setRegion(name);
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls={open ? "region-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        sx={{
          background: "transparent",
          textTransform: "none",
          color: "#fff",
          borderRadius: "10px",
          fontWeight: 500,
          padding: "0px",
          minWidth: 110, // ✅ Зафиксировано минимальное место
          maxWidth: 200, // ✅ Можно добавить ограничение
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        disableElevation
        onClick={handleClick}
        endIcon={
          <div className={styles.endIcon}>
            <Image
              loading="lazy"
              src="/assets/arrow.svg"
              alt="arrow"
              width={12}
              height={12}
            />
          </div>
        }
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflow: "hidden", // ✅ важно
            textOverflow: "ellipsis", // ✅ важно
            whiteSpace: "nowrap", // ✅ важно
            maxWidth: "100%",
          }}
        >
          {current.icon && (
            <Image loading="lazy" src={current.icon} alt={current.name} />
          )}
          {current.name}
        </Box>
      </Button>

      <StyledMenu
        id="region-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        container={() => document.body}
        disableAutoFocusItem
        onKeyDown={(e) => e.stopPropagation()}
        sx={{ width: 250 }}
      >
        <Box
          sx={{ px: 1.5, py: 1 }}
          onClickCapture={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <TextField
            inputRef={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по регионам"
            fullWidth
            variant="outlined"
          />
        </Box>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => (
            <MenuItem
              key={opt.id}
              selected={opt.name === region}
              onClick={() => handleSelect(opt.name)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {opt.icon && (
                  <Image loading="lazy" src={opt.icon} alt={opt.name} />
                )}
                {opt.name}
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Нет результатов</MenuItem>
        )}
      </StyledMenu>
    </div>
  );
};

export default RegionSelect;

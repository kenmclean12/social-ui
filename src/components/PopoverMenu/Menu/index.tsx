/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  cloneElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Popover, MenuList, type PopoverOrigin } from "@mui/material";
import { menuListStyles } from "./styles";

interface Props {
  trigger: ReactElement<any>;
  children: ReactNode;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}

export function PopoverMenu({
  trigger,
  children,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
  transformOrigin = { vertical: "top", horizontal: "right" },
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      {cloneElement(trigger, {
        onClick: (e: any) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
          trigger.props.onClick?.(e);
        },
      })}
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <MenuList sx={menuListStyles}>{children}</MenuList>
      </Popover>
    </>
  );
}

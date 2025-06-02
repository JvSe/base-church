"use client";
import { ComponentProps, useEffect, useId, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { SendoBase } from "./components/send-base.tsx";

export type IconProps = ComponentProps<"svg"> & {
  size?: number | string;
  nameStar?: "empty" | "full";
  originalColor?: boolean;
  active?: boolean;
  theme?: "dark" | "light";
};

export type FlatIconProps = ComponentProps<"i">;

const iconsDataBase = {
  "sendo-base": SendoBase,
};

export type NameIconsBase = keyof typeof iconsDataBase;

type IconBaseProps = IconProps &
  FlatIconProps & {
    name: NameIconsBase;
    disabled?: boolean;
  };

/**
 * @component
 * @name ComponentName
 * @description Description
 * @preview ![img](data:image/svg+xml;base64,${base64SVG(iconsDataBase)})
 * @prop originalColor - Caso true, mantém a cor original do Figma
 */

export const IconsNextMed = ({
  name,
  disabled,
  theme = "light",
  ...rest
}: IconBaseProps) => {
  const id = useId();
  const isMounted = useIsMounted();
  const [iconIndex, setIconIndex] = useState<keyof typeof icon>("unmounted");

  const IconDark = iconsDataBase[name].Dark;
  const IconLight = iconsDataBase[name].Light;
  const IconDisabled = iconsDataBase[name].Disabled;

  const icon = {
    dark: <IconDark id={`icon-${name}-${id}`} {...rest} />,
    light: <IconLight id={`icon-${name}-${id}`} {...rest} />,
    disabled: <IconDisabled id={`icon-${name}-${id}`} {...rest} />,
    unmounted: null,
  };

  useEffect(() => {
    if (isMounted() && disabled) setIconIndex("disabled");
    else if (isMounted() && theme) setIconIndex(theme as keyof typeof icon);
  }, [isMounted, theme, disabled]);

  return icon[iconIndex];
};

declare module "react-feather" {
  import { ComponentType } from "react";

  export interface IconProps {
    color?: string;
    size?: string | number;
  }

  export const Heart: ComponentType<IconProps>;
  // Adicione outros ícones que você possa usar
}

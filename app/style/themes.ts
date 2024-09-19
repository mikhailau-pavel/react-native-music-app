import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { DarkSchemeColors, LightSchemeColors } from './colors';

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: LightSchemeColors.PRIMARY,
    text: LightSchemeColors.TEXT,
    notification: LightSchemeColors.NOTIFICATION,
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: DarkSchemeColors.PRIMARY,
    text: DarkSchemeColors.TEXT,
    background: DarkSchemeColors.BACKGROUND,
    notification: DarkSchemeColors.NOTIFICATION,
  },
};

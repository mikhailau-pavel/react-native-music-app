enum Colors {
  BLACK = '#000000',
  WHITE = '#FFFFFF',
  DARK_WASHED_RED = '#FF3366',
  LIGHT_WASHED_CYAN = '#33FFCC',
  TOMATO = '#FF6347',
}

export enum LightSchemeColors {
  PRIMARY = Colors.DARK_WASHED_RED,
  TEXT = Colors.BLACK,
  BACKGROUND = Colors.WHITE,
  CARD = Colors.WHITE,
  BORDER = Colors.WHITE,
  NOTIFICATION = Colors.BLACK,
}

export enum DarkSchemeColors {
  PRIMARY = Colors.LIGHT_WASHED_CYAN,
  TEXT = Colors.TOMATO,
  BACKGROUND = Colors.BLACK,
  CARD = Colors.BLACK,
  BORDER = Colors.WHITE,
  NOTIFICATION = Colors.WHITE,
}

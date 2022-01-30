export const shouldSkipIntro = (): boolean => process.env.SKIP_INTRO === 'true';
export const shouldSkipMenu = (): boolean => process.env.SKIP_MENU === 'true';
export const shouldOpenDayScene = (): boolean =>
  process.env.START_DAY_SCENE === 'true';
export const debugMap = (): boolean => process.env.DEBUG_MAP === 'true';

export const shouldSkipIntro = (): boolean => process.env.SKIP_INTRO === 'true';
export const shouldSkipMenu = (): boolean => process.env.SKIP_MENU === 'true';
export const shouldOpenDayScene = (): boolean => {
  if (process.env.START_DAY_SCENE === undefined) {
    return true;
  }

  return process.env.START_DAY_SCENE === 'true';
};
export const debugMap = (): boolean => process.env.DEBUG_MAP === 'true';

import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

// @ts-ignore - type mismatch in tamagui rc versions
const tamaguiConfig = createTamagui(defaultConfig);

export type Conf = typeof tamaguiConfig;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;

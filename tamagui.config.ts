import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

// @ts-ignore - type mismatch in tamagui rc versions
const tamaguiConfig = createTamagui(config);

type AppConfig = typeof config;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;

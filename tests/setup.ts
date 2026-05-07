import '@testing-library/jest-native/extend-expect';
(globalThis as any).__ExpoImportMetaRegistry = {};
(global as any).__ExpoImportMetaRegistry = {};
if (!(globalThis as any).structuredClone) {
    (globalThis as any).structuredClone = (val: any) => JSON.parse(JSON.stringify(val));
}



jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    ...jest.requireActual('react-native-safe-area-context'),
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});

const mockTamagui = () => {
    const React = require('react');
    const { View, Text, ScrollView } = require('react-native');
    const MockComponent = ({ children, ...props }: any) => React.createElement(View, props, children);
    return {
        YStack: MockComponent,
        XStack: MockComponent,
        ZStack: MockComponent,
        Text: ({ children, ...props }: any) => React.createElement(Text, props, children),
        ScrollView: ({ children, ...props }: any) => React.createElement(ScrollView, props, children),
        Card: MockComponent,
        Circle: MockComponent,
        View: MockComponent,
        Button: MockComponent,
        Input: MockComponent,
        TamaguiProvider: ({ children }: any) => children,
        createTamagui: () => ({}),
        getConfig: () => ({}),
        Stack: MockComponent,
    };
};

jest.mock('tamagui', () => mockTamagui());
jest.mock('@tamagui/core', () => mockTamagui());
jest.mock('@tamagui/native', () => mockTamagui());

jest.mock('lucide-react-native', () => {
  const React = require('react');
  return new Proxy({}, {
    get: (target, prop) => {
      return (props: any) => React.createElement('Icon', { ...props, name: prop });
    }
  });
});

jest.mock('react-native-chart-kit', () => ({
  LineChart: () => null,
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

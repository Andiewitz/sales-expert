# Sales Expert CRM 📱

[![Expo SDK](https://img.shields.io/badge/Expo-SDK--54-black?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/ReactNative-0.76+-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![NativeWind](https://img.shields.io/badge/NativeWind-Tailwind--Aesthetics-38B2AC?logo=tailwind-css&logoColor=white)](https://nativewind.dev/)
[![SQLite](https://img.shields.io/badge/Storage-SQLite-003B57?logo=sqlite&logoColor=white)](https://docs.expo.dev/versions/latest/sdk/sqlite/)

A mobile CRM built for sales teams that don't want to deal with bloated enterprise software. Everything runs locally — no backend, no latency, no data going anywhere you didn't put it.

Built with a dark-gold UI because it looked cool and my dad uses it for his business.

---

## what it does

- **Lead pipeline** — track leads through Cold → Warm → Hot → Won/Lost
- **Dashboard** — active deals vs closed won, at a glance
- **Analytics** — 6-month sales performance chart
- **Excel export** — one tap, get a real `.xlsx` file with your pipeline or history
- **Fully offline** — SQLite under the hood, works without internet

---

## stack

- **Expo SDK 54** + React Native 0.76 (New Architecture enabled)
- **NativeWind** for styling (Tailwind, basically)
- **expo-sqlite** for local storage
- **React Navigation** (bottom tabs)
- **react-native-chart-kit** for charts
- **SheetJS** for Excel exports
- **Lucide** icons

---

## getting started

You'll need Node 18+ and either Expo Go on your phone or an Android emulator.

```bash
git clone https://github.com/Andiewitz/sales-expert.git
cd sales-expert-native
npm install
npm start
```

Scan the QR with Expo Go and you're in.

### build an APK

```bash
npm install -g eas-cli
eas build --platform android --profile preview
```

---

## project structure

```
├── assets/           # icons, splash, brand stuff
├── components/       # all the UI
│   ├── Header.tsx
│   ├── Dashboard.tsx
│   ├── LeadsList.tsx
│   ├── History.tsx
│   └── ...           # modals, skeletons, etc
├── services/
│   └── db.ts         # sqlite schema + queries
├── types.ts          # global TS interfaces
└── App.tsx           # root — state, navigation, glue
```

---

## contributing

open to PRs. if you find a bug or want to add something, go for it.

1. fork it
2. `git checkout -b feature/your-thing`
3. `git commit -m 'what you did'`
4. `git push origin feature/your-thing`
5. open a PR

keep it typed (TypeScript), use NativeWind classes over inline styles, and `useMemo`/`useCallback` where it makes sense.

---

## license

MIT — do whatever.
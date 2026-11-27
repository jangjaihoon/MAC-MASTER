import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './src/config/firebase';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { TransactionProvider } from './src/context/TransactionContext';
import { initUserData } from './src/utils/storage';
import HomeScreen     from './src/screens/HomeScreen';
import AddScreen      from './src/screens/AddScreen';
import StatsScreen    from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AssetsScreen   from './src/screens/AssetsScreen';
import BudgetScreen   from './src/screens/BudgetScreen';
import AuthScreen     from './src/screens/AuthScreen';
import DraggableTabBar from './src/components/DraggableTabBar';

const Tab = createBottomTabNavigator();

function Main() {
  const { theme, appTitle } = useTheme();

  useEffect(() => { initUserData(); }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <DraggableTabBar {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: theme.headerBg, elevation: 0, shadowOpacity: 0 },
          headerTintColor: theme.headerText,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      >
        <Tab.Screen name="홈"      component={HomeScreen}     options={{ title: appTitle }} />
        <Tab.Screen name="통계"    component={StatsScreen}    options={{ title: '통계' }} />
        <Tab.Screen name="자산"    component={AssetsScreen}   options={{ title: '자산 현황' }} />
        <Tab.Screen name="예산현황" component={BudgetScreen}   options={{ title: '예산 현황' }} />
        <Tab.Screen name="설정"    component={SettingsScreen} options={{ title: '설정' }} />
        <Tab.Screen name="내역추가" component={AddScreen}     options={{ title: '내역 추가', tabBarButton: () => null }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function AppContent() {
  const { theme: t } = useTheme();
  // undefined = 로딩 중, null = 미로그인, object = 로그인됨
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u ?? null));
    return unsub;
  }, []);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={t.accent} size="large" />
      </View>
    );
  }

  if (!user) return <AuthScreen />;
  return (
    <TransactionProvider>
      <Main />
    </TransactionProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

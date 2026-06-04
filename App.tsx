import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppProvider} from './src/app/AppProvider';
import {RootNavigator} from './src/navigation/RootNavigator';
import {useThemeMode} from './src/hooks/useThemeMode';

const AppContent = () => {
  const {mode, colors} = useThemeMode();

  return (
    <>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <RootNavigator />
    </>
  );
};

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
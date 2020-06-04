import {StatusBar, View} from 'react-native';
import React from 'react';
import {Discovery} from './SnapchatDiscovery';

export default function AnimatedStyleUpdateExample() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        flexDirection: 'column',
      }}>
      <StatusBar barStyle={'light-content'} />
      <Discovery />
    </View>
  );
}

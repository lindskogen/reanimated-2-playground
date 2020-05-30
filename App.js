import {StatusBar, View} from 'react-native';
import React from 'react';
import {Stories} from './InstagramStories';

export default function AnimatedStyleUpdateExample() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        flexDirection: 'column',
      }}>
      <StatusBar barStyle={'light-content'} />
      <Stories />
    </View>
  );
}

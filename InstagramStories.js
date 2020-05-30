import React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Text,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const stories = [
  {
    name: '@alex_photogram',
    source: require('./photos/alexandra-k-NdcH-WxzWgo-unsplash.jpg'),
  },
  {
    name: '@heatherbarnes',
    source: require('./photos/heather-barnes-VHFTd9iM05I-unsplash.jpg'),
  },
  {
    name: '@pinarimsi',
    source: require('./photos/pinar-kucuk-Ae7jQFDTPk4-unsplash.jpg'),
  },
  {
    name: '@sarahjgualtieri',
    source: require('./photos/sarah-gualtieri-qszW3z14hj0-unsplash.jpg'),
  },
  {
    name: '@foodfaithfit',
    source: require('./photos/taylor-kiser-s7Vh1kg-clM-unsplash.jpg'),
  },
  {
    name: '@victoriakosmo',
    source: require('./photos/victoria-shes--IXuIVhA-rE-unsplash.jpg'),
  },
];

const {width} = Dimensions.get('window');
const perspective = 400;
const angle = Math.atan(perspective / (width / 2));

const Page = ({source, name, index, x}) => {
  const style = useAnimatedStyle(() => {
    const offset = width * index;
    const inputRange = [offset - width, offset + width];

    const rotation = interpolate(x.value, inputRange, [angle, -angle], 'clamp');

    const alpha = Math.abs(rotation);
    const gamma = angle - alpha;
    const beta = Math.PI - alpha - gamma;
    const w = width / 2 - ((width / 2) * Math.sin(gamma)) / Math.sin(beta);

    return {
      transform: [
        {perspective},
        {
          translateX: interpolate(
            x.value,
            inputRange,
            [width / 2, -width / 2],
            'clamp',
          ),
        },
        {
          rotateY: rotation,
        },
        {
          translateX: rotation > 0 ? w : -w,
        },
      ],
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <ImageBackground style={StyleSheet.absoluteFill} source={source}>
        <SafeAreaView
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                borderRadius: 100,
                width: 40,
                height: 40,
                backgroundColor: 'black',
              }}
            />
            <View style={{width: 20}} />
            <Text
              style={{
                fontFamily: 'Helvetica Neue',
                fontWeight: '600',
                fontSize: 18,
                color: 'white',
              }}>
              {name}
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </Animated.View>
  );
};

export const Stories = () => {
  const x = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({contentOffset}) => {
      x.value = contentOffset.x;
    },
  });

  return (
    <View style={{flex: 1}}>
      {stories.map((story, index) => (
        <Page
          name={story.name}
          source={story.source}
          x={x}
          index={index}
          key={index}
        />
      ))}
      <Animated.ScrollView
        horizontal
        style={StyleSheet.absoluteFill}
        contentContainerStyle={{width: width * stories.length}}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        snapToInterval={width}
        decelerationRate="fast"
        scrollEventThrottle={16}
      />
    </View>
  );
};

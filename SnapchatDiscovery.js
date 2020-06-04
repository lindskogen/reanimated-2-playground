import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const width = Dimensions.get('window').width / 2 - 16 * 2;

const stories = [
  {
    id: '2',
    source: require('./stories/2.jpg'),
    user: 'derek.russel',
    avatar: require('./avatars/derek.russel.png'),
  },
  {
    id: '4',
    source: require('./stories/4.jpg'),
    user: 'jmitch',
    avatar: require('./avatars/jmitch.png'),
  },
  {
    id: '5',
    source: require('./stories/5.jpg'),
    user: 'monicaa',
    avatar: require('./avatars/monicaa.png'),
  },
  {
    id: '3',
    source: require('./stories/3.jpg'),
    user: 'alexandergarcia',
    avatar: require('./avatars/alexandergarcia.png'),
  },
  {
    id: '1',
    source: require('./stories/1.jpg'),
    user: 'andrea.schmidt',
    avatar: require('./avatars/andrea.schmidt.png'),
  },
  {
    id: '6',
    source: require('./stories/6.jpg'),
    user: 'andrea.schmidt',
    avatar: require('./avatars/andrea.schmidt.png'),
  },
];

const springConfig = {
  damping: 10,
  mass: 1,
  stiffness: 100,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

export const Discovery = () => {
  const [selected, setSelectedStory] = useState(null);

  const onSelectStory = (position, story) => {
    setSelectedStory({story, position});
  };

  return (
    <View style={styles.rootContainer}>
      <ScrollView>
        <View style={styles.content} contentInsetAdjustmentBehavior="automatic">
          {stories.map((story) => (
            <StoryThumbnail
              key={story.id}
              selected={selected ? selected.story.id === story.id : false}
              onPress={(position) => onSelectStory(position, story)}
              {...{story}}
            />
          ))}
        </View>
      </ScrollView>
      {selected && (
        <StoryModal
          story={selected.story}
          position={selected.position}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </View>
  );
};

const {width: wWidth, height: wHeight} = Dimensions.get('window');

const StoryModal = ({story, position, onClose}) => {
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);
  const width = useSharedValue(position.width);
  const height = useSharedValue(position.height);

  useEffect(() => {
    translateX.value = withSpring(0, springConfig);
    translateY.value = withSpring(0, springConfig);
    width.value = withSpring(wWidth, springConfig);
    height.value = withSpring(wHeight, springConfig);

    setTimeout(() => {
      console.log(JSON.stringify(position, null, 2));
      translateX.value = withSpring(position.x, springConfig);
      translateY.value = withSpring(position.y, springConfig);
      width.value = withSpring(position.width, springConfig);
      height.value = withSpring(position.height, springConfig);
    }, 2000);
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      borderRadius: 5,
      width: width.value,
      height: height.value,
      transform: [
        {
          translateY: translateY.value,
        },
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  // const gestureHandler = useAnimatedGestureHandler({
  //   onActive: ({translationX, translationY}) => {
  //     translateX.value = translationX;
  //     translateY.value = translationY;
  //     width.value = interpolate(
  //       translateY.value,
  //       [wHeight / 4, wHeight - position.height],
  //       [wWidth, position.width],
  //     );
  //     height.value = interpolate(
  //       translationY.value,
  //       [wHeight / 4, wHeight - position.height],
  //       [wHeight, position.height],
  //     );
  //   },
  //   onEnd: ({velocityY}) => {
  //     if (velocityY <= 0) {
  //       translateX.value = withSpring(0, springConfig);
  //       translateY.value = withSpring(0, springConfig);
  //       width.value = withSpring(wWidth, springConfig);
  //       height.value = withSpring(wHeight, springConfig);
  //     } else {
  //       translateX.value = withSpring(position.x, springConfig, onClose);
  //       translateY.value = withSpring(position.y, springConfig, onClose);
  //       width.value = withSpring(position.width, springConfig, onClose);
  //       height.value = withSpring(position.height, springConfig, onClose);
  //     }
  //   },
  // });

  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler onGestureEvent={() => {}}>
        <Animated.View style={style}>
          <Image source={story.source} style={styles.image} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const StoryThumbnail = ({story, onPress, selected}) => {
  const thumbnailRef = useRef(null);

  const handlePress = () => {
    thumbnailRef.current.measureInWindow((x, y, width, height) => {
      onPress({x, y, width, height});
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {!selected && (
          <Image
            ref={thumbnailRef}
            source={story.source}
            style={styles.image}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  rootContainer: {flex: 1},
  content: {
    paddingTop: 64,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  container: {
    width,
    height: width * 1.77,
    marginTop: 16,
    borderRadius: 5,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
    resizeMode: 'cover',
    borderRadius: 5,
  },
});

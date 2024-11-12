import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Video from 'react-native-video';
import { DefaultStyles } from '@/components/styles';
import { Lesson } from '@/lib/models';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigations';

type Props = NativeStackScreenProps<RootStackParamList, 'ResumeCourse'>;

const ResumeCourseScreen = ({ route }: Props) => {
  const { lesson } = route.params; // lesson olarak alınıyor

  const renderVideoContent = () => {
    const videoLesson = lesson?.find(
      (lessonItem): lessonItem is Lesson =>
        lessonItem !== undefined && lessonItem.type === 'video',
    );

    if (!videoLesson || !videoLesson.lexical) return null;

    let videoSource;
    try {
      const parsedLexical = JSON.parse(videoLesson.lexical);
      videoSource = parsedLexical?.source;
    } catch (error) {
      console.error('Failed to parse lexical:', error);
      return null;
    }

    if (!videoSource || typeof videoSource !== 'string') return null;

    return (
      <View style={styles.videoContainer}>
        <Text style={styles.heading}>{videoLesson.title}</Text>
        <Video
          source={{ uri: videoSource }}
          style={styles.videoPlayer}
          controls={true}
          resizeMode="cover"
          paused={true}
        />
      </View>
    );
  };

  return <>{renderVideoContent()}</>;
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    ...DefaultStyles.fonts.semiBold,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: 'red',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
});

export default ResumeCourseScreen;

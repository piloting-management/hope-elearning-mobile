import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Video from 'react-native-video'; // Sadece Video import edildi
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultStyles } from '@/components/styles';
import { Lesson } from '@/lib/models';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigations';

type Props = NativeStackScreenProps<RootStackParamList, 'ResumeCourse'>;

const ResumeCourseScreen = ({ route }: Props) => {
  const { lesson } = route.params;
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(true); // Videonun duraklatılmış başlangıcı
  const videoRef = useRef<React.ElementRef<typeof Video>>(null); // Ref tanımı

  const videoKey = `video-position-${lesson?.[0]?.id}`; // Benzersiz anahtar

  useEffect(() => {
    const loadPosition = async () => {
      try {
        const savedPosition = await AsyncStorage.getItem(videoKey);
        if (savedPosition !== null) {
          const position = parseFloat(savedPosition);
          console.log(`Depodan yüklenen konum: ${position}`);
          setPosition(position);
        } else {
          console.log('Depodan konum bulunamadı.');
        }
      } catch (error) {
        console.error('Video konumu yüklenirken hata oluştu:', error);
      }
    };

    loadPosition();
  }, [videoKey]);

  const handleVideoProgress = (data: { currentTime: number }) => {
    console.log(`Anlık oynatma süresi: ${data.currentTime}`);
    setPosition(data.currentTime);
    AsyncStorage.setItem(videoKey, data.currentTime.toString()).catch(error =>
      console.error('Video konumu kaydedilirken hata oluştu:', error),
    );
    console.log(`Anlık oynatma süresi depoya kaydedildi: ${data.currentTime}`);
  };

  const handleVideoLoad = () => {
    // Video yüklendiğinde kaydedilen konuma gitme
    if (position > 0 && videoRef.current) {
      console.log(`Kaydedilen konuma gidiliyor: ${position}`);
      videoRef.current.seek(position); // seek metodu
    } else {
      console.log('Kaydedilen bir konum yok veya videoRef tanımlı değil.');
    }
    setPaused(false); // Videoyu oynatmaya başlama
  };

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
      console.error('Lexical parse edilirken hata oluştu:', error);
      return null;
    }

    if (!videoSource || typeof videoSource !== 'string') return null;

    return (
      <View style={styles.videoContainer}>
        <Text style={styles.heading}>{videoLesson.title}</Text>
        <Video
          ref={videoRef} // Video referansı
          source={{ uri: videoSource }}
          style={styles.videoPlayer}
          controls={true}
          resizeMode="cover"
          paused={paused} // Başlangıçta duraklatıldı
          onProgress={handleVideoProgress}
          onLoad={handleVideoLoad} // onLoad kullanımı
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

import { DefaultStyles } from '@/components/styles';
import { TextButton } from '@/components/ui/Button';
import { CustomImage } from '@/components/ui/CustomImage';
import { CustomWebView } from '@/components/ui/CustomWebView';
import { Divider } from '@/components/ui/Divider';
import { ErrorView } from '@/components/ui/ErrorView';
import { Loading } from '@/components/ui/Loading';
import { Spacer } from '@/components/ui/Spacer';
import { Text } from '@/components/ui/Text';
import { useAppSelector } from '@/lib/hooks';
import { getCourseBySlug, getEnrolledCourses } from '@/lib/services/CourseApi';
import { uppercaseFirstChar } from '@/lib/utils';
import { RootStackParamList } from '@/navigations';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ChartNoAxesColumnIncreasingIcon, StarIcon } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { selectTheme } from '../themeSlice';
import EnrollCourseButton from '@/components/EnrollCourseButton';
import { Chapter, Lesson } from '../../lib/models';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

const avatarSize = 48;

const CourseDetailScreen = ({ navigation, route }: Props) => {
  const { colors } = useAppSelector(selectTheme);
  const insets = useSafeAreaInsets();
  const headerHidden = useRef(false);

  const { slug } = route.params;
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeTab, setActiveTab] = useState('Description');
  const tabs = ['Description', 'Syllabus'];

  // Fetching course details
  const { data, error, isPending, isFetching, isLoadingError, refetch } =
    useQuery({
      queryKey: ['/content/courses', slug],
      queryFn: ({ signal }) => getCourseBySlug(slug, signal),
      enabled: false,
    });

  useEffect(() => {
    if (data?.chapters) {
      const allLessons = data.chapters
        .flatMap(chapter => chapter.lessons)
        .filter((lesson): lesson is Lesson => lesson !== undefined);
      setLessons(allLessons);
    }
  }, [data]);

  useEffect(() => {
    const checkEnrollment = async () => {
      const user = auth().currentUser;
      if (user) {
        const token = await user.getIdToken();
        const enrolledCourses = await getEnrolledCourses(token);

        const isUserEnrolled = enrolledCourses.contents.some(
          (course: { course: { slug: string } }) => course.course.slug === slug,
        );
        setIsEnrolled(isUserEnrolled);
      }
    };

    checkEnrollment();

    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      isPending && refetch();
    });

    return () => {
      interactionPromise.cancel();
    };
  }, [refetch, isPending, slug]);

  const content = () => {
    if (isPending) {
      return (
        <SafeAreaView style={styles.container}>
          <Loading />
        </SafeAreaView>
      );
    }

    if (error && isLoadingError) {
      return (
        <SafeAreaView style={styles.container}>
          <ErrorView
            error={error}
            action={() => {
              refetch();
            }}
          />
        </SafeAreaView>
      );
    }

    const renderLessons = (chapters: Chapter[] | undefined) => {
      return chapters?.map(chapter => (
        <View key={chapter.id} style={styles.accordionContainer}>
          <Text style={styles.accordionTitle}>{chapter.title}</Text>
          {chapter.lessons?.map((lesson: Lesson) => (
            <View key={lesson.id} style={styles.lessonItem}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
            </View>
          ))}
        </View>
      ));
    };

    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              colors={[colors.primary]}
              tintColor={'gray'}
              onRefresh={() => {
                refetch();
              }}
            />
          }
          onScroll={evt => {
            const limit = 300;
            const ne = evt.nativeEvent;
            const offset = ne.contentOffset.y;
            if (offset > limit && !headerHidden.current) {
              navigation.setOptions({
                title: data.title ?? '',
              });
              headerHidden.current = true;
            } else if (offset < limit && headerHidden.current) {
              navigation.setOptions({
                title: '',
              });
              headerHidden.current = false;
            }
          }}>
          <View style={styles.container}>
            <View style={styles.coverContainer}>
              <CustomImage
                source={
                  data.cover
                    ? { uri: data.cover }
                    : require('@/assets/images/placeholder.jpg')
                }
                style={{
                  ...styles.cover,
                  borderColor: colors.border,
                }}
                resizeMode="cover"
              />
            </View>

            <Spacer orientation="vertical" spacing={16} />

            <Text style={{ ...styles.title }}>{data.title}</Text>

            <Spacer orientation="vertical" spacing={12} />

            {/* <View style={styles.propsContainer}>
              <View style={styles.propsItem}>
                <StarIcon color="#ffb703" fill="#ffb703" size={16} />
                <Text style={styles.propsText}>
                  {data.meta?.rating ?? '0.0'}
                </Text>
              </View>
              <View style={styles.propsItem}>
                <ChartNoAxesColumnIncreasingIcon color="gray" size={16} />
                <Text style={styles.propsText}>
                  {uppercaseFirstChar(data.level)}
                </Text>
              </View>

              <View style={{ flex: 1 }} />

              <View
                style={{ ...styles.accessView, borderColor: colors.success }}>
                <Text style={{ ...styles.accessText, color: colors.success }}>
                  {uppercaseFirstChar(data.access)}
                </Text>
              </View>
            </View> */}

            <View style={styles.tabContainer}>
              {tabs.map(tab => (
                <Text
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}>
                  {tab}
                </Text>
              ))}
            </View>

            {activeTab === 'Description' && (
              <View style={styles.descriptionContainer}>
                <Text>{data.excerpt}</Text>
              </View>
            )}

            {activeTab === 'Syllabus' && (
              <ScrollView contentContainerStyle={styles.syllabusContainer}>
                {renderLessons(data.chapters)}
              </ScrollView>
            )}

            <Spacer orientation="vertical" spacing={28} />
          </View>
        </ScrollView>
        <Divider orientation="horizontal" stroke={0.25} />
        <View
          style={{
            ...styles.footerContainer,
            paddingBottom: insets.bottom + 16,
            backgroundColor: colors.card,
          }}>
          <View style={{ flex: 1 }}>
            <TextButton
              variant="default"
              title="Resume Course"
              onPress={() => {
                const lessons =
                  data.chapters?.flatMap(chapter => chapter.lessons) || [];
                navigation.navigate('ResumeCourse', { lesson: lessons });
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            {!isEnrolled && <EnrollCourseButton course={data} />}
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <Divider orientation="horizontal" stroke={0.5} />
      {content()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  coverContainer: {
    aspectRatio: 16 / 9,
  },
  cover: {
    flex: 1,
    aspectRatio: 16 / 9,
    borderRadius: DefaultStyles.values.borderRadius,
    borderWidth: 0.7,
  },
  title: {
    fontSize: 20,
    ...DefaultStyles.fonts.semiBold,
  },
  accessView: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: DefaultStyles.values.borderRadius,
  },
  accessText: {
    ...DefaultStyles.fonts.medium,
  },
  propsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  propsItem: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  propsText: {
    fontSize: 16,
    color: 'gray',
    ...DefaultStyles.fonts.regular,
  },
  footerContainer: {
    flexDirection: 'row',
    alignContent: 'stretch',
    padding: 16,
    gap: 10,
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Tabları sola yapıştırır
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#666',
  },
  activeTab: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#6200ee', // Aktif sekme alt çizgi rengi
  },
  descriptionContainer: {
    paddingVertical: 16,
  },
  syllabusContainer: {
    paddingVertical: 16,
  },
  accordionContainer: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f1f1f1', // Chapter'ı daha belirgin yapmak için arka plan
  },
  accordionTitle: {
    fontSize: 20, // Daha büyük ve belirgin font boyutu
    fontWeight: 'bold',
    color: '#333',
  },
  lessonItem: {
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    marginLeft: 8, // Lesson'ları chapter'dan biraz içeri çekmek için
  },
  lessonTitle: {
    fontSize: 14, // Daha küçük ve soft
    fontWeight: '400',
    color: '#555',
  },
});

export default CourseDetailScreen;

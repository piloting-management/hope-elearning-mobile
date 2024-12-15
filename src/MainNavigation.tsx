import { getDefaultHeaderHeight } from '@react-navigation/elements';
import {
  NavigationContainer,
  useNavigationContainerRef,
  useRoute,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookmarkIcon, Share2Icon } from 'lucide-react-native';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { ToastConfig } from 'react-native-toast-message';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MainTabs from './MainTabs';
import { DefaultStyles } from './components/styles';
import { CustomStatusBar } from './components/ui/CustomStatusBar';
import { ToastErrorLayout, ToastInfoLayout } from './components/ui/ToastLayout';
import PostDetailScreen from './features/blog/PostDetailScreen';
import CourseDetailScreen from './features/course/CourseDetailScreen';
import CourseListHeaderRight from './features/course/CourseListHeaderRight';
import CourseListHeaderTitle from './features/course/CourseListHeaderTitle';
import CourseListScreen from './features/course/CourseListScreen';
import { selectTheme } from './features/themeSlice';
import { useAppSelector } from './lib/hooks';
import { RootStackParamList } from './navigations';
import ResumeCourseScreen from './features/course/ResumeCourseScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import React, { useState } from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import FloatingButtonWithForm from './components/ui/FloatingButtonWithForm';

const Stack = createNativeStackNavigator<RootStackParamList>();
// const Drawer = createDrawerNavigator();
const screen = Dimensions.get('window');

const StackNavigator = () => {
  const theme = useAppSelector(selectTheme);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        navigationBarColor: theme.colors.card,
        animation: 'slide_from_right',
        headerTitleStyle: {
          fontSize: 18,
          ...DefaultStyles.fonts.medium,
        },
      }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          title: 'Back',
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="BlogDetail"
        component={PostDetailScreen}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: '',
          headerRight: props => {
            return (
              <Item
                title="Share"
                iconName="share"
                IconComponent={Share2Icon as any}
                color={props.tintColor}
              />
            );
          },
        })}
      />
      <Stack.Screen
        name="CourseList"
        component={CourseListScreen}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: 'Courses',
          headerTitleAlign: 'left',
          headerTitle: CourseListHeaderTitle,
          headerRight: CourseListHeaderRight,
        })}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: '',
          headerRight: props => {
            return (
              <HeaderButtons left>
                <Item
                  title="Bookmark"
                  iconName="bookmark"
                  IconComponent={BookmarkIcon as any}
                  color={props.tintColor}
                />
                <Item
                  title="Share"
                  iconName="share"
                  IconComponent={Share2Icon as any}
                  color={props.tintColor}
                />
              </HeaderButtons>
            );
          },
        })}
      />
      <Stack.Screen
        name="ResumeCourse"
        component={ResumeCourseScreen}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: '',
          headerRight: props => {
            return (
              <HeaderButtons left>
                <Item
                  title="Bookmark"
                  iconName="bookmark"
                  IconComponent={BookmarkIcon as any}
                  color={props.tintColor}
                />
                <Item
                  title="Share"
                  iconName="share"
                  IconComponent={Share2Icon as any}
                  color={props.tintColor}
                />
              </HeaderButtons>
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};

// const DrawerNavigation = () => {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         drawerStyle: {
//           backgroundColor: '#fff',
//           width: 250,
//         },
//       }}>
//       <Drawer.Screen name="Home" component={StackNavigator} />
//       <Drawer.Screen name="Profile" component={ProfileScreen} />
//     </Drawer.Navigator>
//   );
// };

const MainNavigation = () => {
  const navigationRef = useNavigationContainerRef();
  const theme = useAppSelector(selectTheme);

  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  
  const insets = useSafeAreaInsets();

  const headerHeight = getDefaultHeaderHeight(screen, false, insets.top);

  const toastTopOffset = headerHeight + 10;

  const toastConfig: ToastConfig = {
    error: ToastErrorLayout,
    info: ToastInfoLayout,
  };

 // FloatingButtonWithForm'un gösterileceği ekranlar
  const floatingButtonVisibleRoutes = ['Home','Blogs','Learnings'];

  return (
    <>
      <NavigationContainer ref={navigationRef} theme={theme}  onStateChange={() => {
    const route = navigationRef.getCurrentRoute();
    setCurrentRoute(route?.name || null);
  }}>
        <CustomStatusBar />
        {/* <DrawerNavigation /> */}
        <StackNavigator />
      </NavigationContainer>
      {floatingButtonVisibleRoutes.includes(currentRoute || '') && (
        <FloatingButtonWithForm />
      )}
      <Toast
        config={toastConfig}
        topOffset={toastTopOffset}
        visibilityTime={5000}
      />
    </>
  );
};

export default MainNavigation;

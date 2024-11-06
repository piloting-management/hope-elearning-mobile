import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BellIcon, MoonIcon, SunIcon } from 'lucide-react-native';
import {
  BookOpenIcon,
  HomeIcon,
  NewspaperIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import {
  BookOpenIcon as BookOpenSolidIcon,
  HomeIcon as HomeSolidIcon,
  NewspaperIcon as NewspaperSolidIcon,
  UserIcon as UserSolidIcon,
} from 'react-native-heroicons/solid';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { DefaultStyles } from './components/styles';
import { HeaderLogo } from './components/ui/HeaderLogo';
import PostListHeaderRight from './features/blog/PostListHeaderRight';
import PostListScreen from './features/blog/PostListScreen';
import HomeScreen from './features/home/HomeScreen';
import MyCoursesScreen from './features/learning/MyCoursesScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import { selectTheme, setDarkMode, setLightMode } from './features/themeSlice';
import { useAppDispatch, useAppSelector } from './lib/hooks';
import { BottomTabParamList } from './navigations';
// import auth from '@react-native-firebase/auth';
import { LogOut } from 'lucide-react-native';
import { Alert } from 'react-native';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabs = () => {
  const dispatch = useAppDispatch();
  const { dark, colors } = useAppSelector(selectTheme);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: 18,
          ...DefaultStyles.fonts.medium,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitleAlign: 'left',
          headerTitle: props => <HeaderLogo {...props} />,
          tabBarIcon: props => {
            if (props.focused) {
              return <HomeSolidIcon {...props} />;
            }
            return <HomeIcon {...props} />;
          },
          headerRight: props => (
            <HeaderButtons>
              <Item
                title="Notification"
                iconName="notification"
                IconComponent={BellIcon as any}
                color={props.tintColor}
              />
              <Item
                title="Theme"
                iconName="mode"
                IconComponent={(dark ? MoonIcon : SunIcon) as any}
                color={props.tintColor}
                onPress={() => {
                  if (dark) {
                    dispatch(setLightMode());
                  } else {
                    dispatch(setDarkMode());
                  }
                }}
              />
              <Item
                title="Logout"
                iconName="log-out"
                IconComponent={LogOut as any} // 'lucide-react-native' paketindeki LogOut simgesini kullanıyoruz
                color={props.tintColor}
                // onPress={() => {
                //   auth()
                //     .signOut()
                //     .then(() => {
                //       Alert.alert('Başarıyla çıkış yaptınız!');
                //     })
                //     .catch(error => {
                //       Alert.alert(
                //         'Çıkış sırasında hata oluştu!',
                //         error.message,
                //       );
                //     });
                // }}
              />
            </HeaderButtons>
          ),
        }}
      />
      <Tab.Screen
        name="Blogs"
        component={PostListScreen}
        options={{
          tabBarIcon: props => {
            if (props.focused) {
              return <NewspaperSolidIcon {...props} />;
            }
            return <NewspaperIcon {...props} />;
          },
          headerRight: PostListHeaderRight,
        }}
      />
      <Tab.Screen
        name="Learnings"
        component={MyCoursesScreen}
        options={{
          headerTitle: 'My Courses',
          tabBarIcon: props => {
            if (props.focused) {
              return <BookOpenSolidIcon {...props} />;
            }
            return <BookOpenIcon {...props} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: props => {
            if (props.focused) {
              return <UserSolidIcon {...props} />;
            }
            return <UserIcon {...props} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

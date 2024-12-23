import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import { useAppSelector } from '@/lib/hooks';
import { selectTheme } from './features/themeSlice';
import { RootState } from './lib/store';
import { Category, Course, Subject } from './lib/models';

const { width } = Dimensions.get('window');

type MenuItem = {
  title: string;
  route?: string; // Route yönlendirme için
  subMenu?: MenuItem[];
};

type DrawerContentProps = {
  toggleDrawer: () => void;
  navigation: any;
};

const DrawerContent: React.FC<DrawerContentProps> = ({
  toggleDrawer,
  navigation,
}) => {
  const { colors } = useAppSelector(selectTheme);

  const categories = useAppSelector(
    (state: RootState) => state.content.categories
  );

  const subjects = useAppSelector((state: RootState) => state.content.subjects);

  const courses = useAppSelector((state: RootState) => state.content.courses);

  const [currentMenu, setCurrentMenu] = useState<MenuItem[] | null>(null);
  const pan = useRef(new Animated.Value(0)).current;
  const menuData: MenuItem[] = categories.map((category: Category) => {
    const categorySubjects = subjects.filter(
      (subject: Subject) => subject.categoryId === category.id
    );

    return {
      title: category.name,
      subMenu: categorySubjects.map((subject) => {
        const subjectCourses = courses.filter(
          (course: Course) => course.subjectId === subject.id
        );

        return {
          title: subject.name,
          subMenu: subjectCourses.map((course) => ({
            title: course.title,
            route: 'CourseDetail',
            params: { courseId: course.id },
          })),
        };
      }),
    };
  });

  const handleMenuClick = (item: MenuItem) => {
    if (item.subMenu) {
      setCurrentMenu(item.subMenu);
    } else if (item.route) {
      // navigation.navigate(item.route, item.params); // Sayfa yönlendirme
      toggleDrawer(); // Drawer'ı kapat
    }
  };

  const goBackToMainMenu = () => {
    setCurrentMenu(null);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dx < 0) {
        pan.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx < -50) toggleDrawer();
      else Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
    },
  });

  const menuItems = currentMenu || menuData;

  return (
    <TouchableWithoutFeedback onPress={toggleDrawer}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.drawer,
            { backgroundColor: colors.card, transform: [{ translateX: pan }] },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Header */}
          <SafeAreaView
            style={[styles.header, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.headerText}>Menu</Text>
          </SafeAreaView>

          {/* Menu */}
          <View style={styles.menuContainer}>
            {currentMenu && (
              <TouchableOpacity
                onPress={goBackToMainMenu}
                style={[styles.backButton, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.backText, { color: '#fff' }]}>← Back</Text>
              </TouchableOpacity>
            )}
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleMenuClick(item)}
              >
                <Text style={[styles.menuText, { color: colors.primary }]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <TouchableOpacity onPress={toggleDrawer} style={styles.footer}>
            <Text style={[styles.closeText, { color: colors.primary }]}>
              Close
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  drawer: {
    width: width * 0.7,
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
    borderTopRightRadius: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  menuText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DrawerContent;

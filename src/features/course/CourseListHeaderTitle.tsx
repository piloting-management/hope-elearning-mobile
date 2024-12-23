import { DefaultStyles } from '@/components/styles';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  getDefaultHeaderHeight,
  HeaderTitleProps,
} from '@react-navigation/elements';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { selectTheme } from '../themeSlice';
import { setSearchQuery } from '@/features/contentSlice';
import { XIcon } from 'lucide-react-native';

const screen = Dimensions.get('window');

function CourseListHeaderTitle(props: HeaderTitleProps) {
  const headerHeight = getDefaultHeaderHeight(screen, false, 0);
  const { colors } = useAppSelector(selectTheme);
  const searchQuery = useAppSelector((state) => state.content.searchQuery);
  const dispatch = useAppDispatch();

  const handleSearchChange = (text: string) => {
    dispatch(setSearchQuery(text));
  };
  const clearSearch = () => {
    dispatch(setSearchQuery(''));
  };
  const searchInsets = Platform.select({
    ios: {
      height: 8,
      width: 100,
    },
    android: {
      height: 12,
      width: 128,
    },
    default: {
      height: 0,
      width: 0,
    },
  });

  const searchHeight = headerHeight - searchInsets.height;
  const searchWidth = screen.width - searchInsets.width;

  return (
    <View
      style={{
        ...styles.container,
        height: searchHeight,
        width: searchWidth,
        borderRadius: searchHeight / 2,
      }}
    >
      <TextInput
        style={{ ...styles.input, color: colors.text }}
        placeholderTextColor={'dimgray'}
        placeholder="Search courses..."
        selectionColor={colors.primary}
        cursorColor={colors.primary}
        autoCorrect={false}
        onChangeText={handleSearchChange}
        value={searchQuery}
      />
      {searchQuery && searchQuery.trim().length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <Text style={{ color: colors.text }}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Yatay hizalama
    alignItems: 'center', // Dikey ortalama
    paddingHorizontal: 16,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
  },
  input: {
    flex: 1,
    ...DefaultStyles.fonts.regular,
  },
  clearButton: {
    marginLeft: 8, // TextInput'tan boşluk
    padding: 4, // Daha küçük padding
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CourseListHeaderTitle;

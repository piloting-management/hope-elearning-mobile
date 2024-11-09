import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Divider } from '@/components/ui/Divider';
import auth from '@react-native-firebase/auth';
import LoginScreen from '../login/LoginScreen';
import { useAppSelector } from '@/lib/hooks';
import { selectTheme } from '../../features/themeSlice';

const ProfileScreen = () => {
  const [user, setUser] = useState(auth().currentUser);
  const { colors } = useAppSelector(selectTheme);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authUser => {
      setUser(authUser);
    });
    return subscriber;
  }, []);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  // Stil oluşturma fonksiyonu
  const styles = getStyles(colors);

  return (
    <>
      <Divider orientation="horizontal" stroke={0.5} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">
        {user ? (
          <View style={styles.profileContainer}>
            <Text style={styles.userName}>
              {user.displayName || 'Kullanıcı'}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        ) : (
          <LoginScreen />
        )}
      </ScrollView>
      {user && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

// Dinamik stil fonksiyonu
const getStyles = (colors: { background: any; primary: any; text: any }) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    profileContainer: {
      padding: 20,
      alignItems: 'center',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    userEmail: {
      fontSize: 18,
      marginTop: 10,
      color: 'gray',
    },
    footer: {
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.background, // colors'ı burada kullanıyoruz
    },
    logoutButton: {
      backgroundColor: colors.primary || '#FF3B30',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: colors.text || '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default ProfileScreen;

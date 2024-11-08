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

const ProfileScreen = () => {
  const [user, setUser] = useState(auth().currentUser);

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
          <LoginScreen /> // Oturum açılmamışsa LoginScreen'i göster
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

const styles = StyleSheet.create({
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
    backgroundColor: '#f5f5f5',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;

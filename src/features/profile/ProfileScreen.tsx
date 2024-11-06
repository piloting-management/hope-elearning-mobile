import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Divider } from '@/components/ui/Divider';
// import auth from '@react-native-firebase/auth';
import LoginScreen from '../login/LoginScreen';

const ProfileScreen = () => {
  // const [user, setUser] = useState(auth().currentUser); // Başlangıçta mevcut kullanıcıyı al

  useEffect(() => {
    // Kullanıcı oturum durumunu izlemek için bir subscriber
    // const subscriber = auth().onAuthStateChanged(user => {
    //   setUser(user); // Kullanıcı durumunu güncelle
    // });
    // Component unmount edildiğinde subscriber'ı temizle
    // return subscriber;
  }, []);

  const handleSignOut = async () => {
    try {
      // await auth().signOut(); // Firebase üzerinden oturumu kapat
      // setUser(null); // Oturum kapandıktan sonra kullanıcıyı null yap
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  return (
    <>
      <Divider orientation="horizontal" stroke={0.5} />
      {/* <ScrollView
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
      )} */}
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

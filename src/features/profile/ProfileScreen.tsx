import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
} from 'react-native';
import { Divider } from '@/components/ui/Divider';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from '../login/LoginScreen';
import { useAppSelector } from '@/lib/hooks';
import { selectTheme } from '../../features/themeSlice';
import { verifyUserWithApi } from '@/lib/services/LoginApi';
import { getUniqueId } from 'react-native-device-info';
import ApprovalModal from '@/components/ui/Approval';
import TitleModal from '@/components/ui/TitleModal';

const ProfileScreen = () => {
  const [user, setUser] = useState(auth().currentUser);
  const [isVerified, setIsVerified] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // Dinamik mesaj için state
  const { colors } = useAppSelector(selectTheme);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState<string | null>(null); // Sadece durum tutuyoruz
  const [forceUpdate, setForceUpdate] = useState(false); // Modal'ı zorla açmak için

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [titleModalVisible, setTitleModalVisible] = useState(false);

  const openApprovalModal = () => setApprovalModalVisible(true);
  const closeApprovalModal = () => setApprovalModalVisible(false);

  const openTitleModal = () => setTitleModalVisible(true);
  const closeTitleModal = () => {
    setTitleModalVisible(false);
    setForceUpdate(false); // Modal kapatıldığında güncellemeyi sıfırla
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser) {
        verifyUser(authUser);
      }
    });
    return subscriber;
  }, []);

  const handleMailSend = (userEmail: string) => {
    const subject = encodeURIComponent(`Sorun: ${userEmail}`);
    const body = encodeURIComponent(
      'Merhaba, cihazımın başka bir kullanıcıya ait olduğunu belirten bir hata aldım. Lütfen bu sorunu çözmeme yardımcı olun.'
    );

    const mailtoURL = `mailto:account@thepiloting.com?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoURL).catch((err) => {
      console.error('Mail gönderme hatası:', err);
      Alert.alert(
        'Mail Gönderilemiyor',
        'E-posta gönderimi sırasında bir hata oluştu. Lütfen cihazınızda varsayılan e-posta uygulamasının kurulu olduğundan emin olun.'
      );
    });
  };

  const verifyUser = async (authUser: FirebaseAuthTypes.User) => {
    try {
      const deviceId = await getUniqueId();

      const response = await verifyUserWithApi(
        authUser.uid,
        authUser.email || '',
        deviceId,
        false
      );

      if (response.success) {
        setIsVerified(true); // Kullanıcı doğrulandıysa isVerified true yapılır
        openTitleModal(); // Doğrulama başarılıysa öğrenci durumu modalı açılır
      } else if (response.requiresApproval) {
        setModalMessage(response.message); // Backend’den gelen mesaj set edilir
        openApprovalModal(); // Kullanıcı onay gerektiriyorsa approval modalı açılır
      } else {
        // Kullanıcı mailto bağlantısı ile yönlendirilecek
        Alert.alert('Hata', `${response.message}`, [
          {
            text: 'Mail Gönder',
            onPress: () => {
              const userEmail = authUser.email || 'belirtilmemiş';
              handleMailSend(userEmail); // Mail gönderimini tetikle
            },
          },
          { text: 'Tamam', style: 'cancel' },
        ]);

        await handleSignOut(); // Kullanıcıyı çıkış yaptır
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Hata', 'Doğrulama sırasında bir hata oluştu.');
      await handleSignOut();
    }
  };

  const handleApprove = async () => {
    try {
      setModalVisible(false); // Modal'ı kapat
      const deviceId = await getUniqueId();

      const approvalResult = await verifyUserWithApi(
        user?.uid || '',
        user?.email || '',
        deviceId,
        true
      );

      if (approvalResult.success) {
        setIsVerified(true);
        Alert.alert('Başarılı!', approvalResult.message);
      } else {
        Alert.alert('Hata', approvalResult.message);
        await handleSignOut();
      }
    } catch (error) {
      console.error('Approval error:', error);
      Alert.alert('Hata', 'Bir hata oluştu.');
    }
  };

  const handleCancel = async () => {
    setModalVisible(false); // Modal'ı kapat
    await handleSignOut(); // Kullanıcıyı logout et
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
      setIsVerified(false);
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  const styles = getStyles(colors);

  return (
    <>
      <Divider orientation="horizontal" stroke={0.5} />
      <ApprovalModal
        visible={approvalModalVisible}
        message={modalMessage}
        onApprove={() => {
          setApprovalModalVisible(false);
          // Approval işlemleri...
        }}
        onCancel={handleSignOut}
      />
      <TitleModal
        visible={titleModalVisible}
        onClose={closeTitleModal}
        colors={colors}
        onStatusChange={(newStatus) => setTitle(newStatus)}
        forceUpdate={forceUpdate}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {user && isVerified ? (
          <>
            <View style={styles.profileContainer}>
              <Text style={styles.userName}>
                {user.displayName || 'Kullanıcı'}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <TouchableOpacity
                onPress={() => {
                  setForceUpdate(true); // Güncelleme amacıyla modal'ı aç
                  openTitleModal();
                }}
              >
                <Text style={styles.userStatus}>{title}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <LoginScreen />
        )}
      </ScrollView>
      {user && isVerified && (
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
    userStatus: {
      fontSize: 16,
      color: 'gray',
      marginTop: 10,
    },
    footer: {
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
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
    updateStatusButton: {
      backgroundColor: colors.primary || '#007BFF',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    updateStatusButtonText: {
      color: colors.text || '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default ProfileScreen;

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, Alert } from 'react-native';
import { Button } from '@/components/ui/Button';
import { ToastAndroid } from 'react-native';
import { Course } from '@/lib/models';
// import auth from '@react-native-firebase/auth';
import { enrollCourse } from '@/lib/services/CourseApi'; // Import the new method
import { useNavigation } from '@react-navigation/native'; // Navigation kullanımı için

type EnrollCourseButtonProps = {
  course: Course; // course prop'unu zorunlu olarak alıyor
  children?: React.ReactNode;
};

const EnrollCourseButton: React.FC<EnrollCourseButtonProps> = ({
  course,
  children,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  // const [currentUser, setCurrentUser] = useState(auth().currentUser);
  const [sessionCookie, setSessionCookie] = useState<string | null>(null);
  const navigation = useNavigation(); // Navigation'ı burada doğru şekilde tanımladık

  useEffect(() => {
    const fetchTokenAndSession = async () => {
      // const user = auth().currentUser;
      // setCurrentUser(user);
      // if (user) {
      //   const token = await user.getIdToken();
      //   setUserToken(token);
      //   const fetchedSessionCookie = 'YOUR_SESSION_COOKIE';
      //   setSessionCookie(fetchedSessionCookie);
      // }
    };

    fetchTokenAndSession();

    // const subscriber = auth().onAuthStateChanged(user => {
    //   setCurrentUser(user);
    //   if (user) {
    //     user.getIdToken().then(setUserToken);
    //   }
    // });

    // return subscriber;
  }, []);

  const handleEnrollment = async () => {
    // if (!currentUser) {
    //   Alert.alert(
    //     'Yetkisiz erişim',
    //     'Bu işlemi gerçekleştirmek için giriş yapmalısınız.',
    //   );
    //   return;
    // }

    try {
      setLoading(true);

      // course.id'yi kullanarak kayıt işlemini başlatıyoruz
      const response = await enrollCourse(course.id);
      console.log('response', response);
      if (response?.success || response) {
        // Success durumunda bildirim göster
        Alert.alert('Başarılı', 'Kurs kaydı başarıyla tamamlandı.');
        // Başarılı kayıt sonrası geri dön
        navigation.goBack(); // Eğer navigate etmek istiyorsan, navigation'ı burada doğru şekilde kullan
      } else {
        throw new Error('Kurs kaydı sırasında bir hata oluştu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Kurs kaydı başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onPress={handleEnrollment}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        children || <Text>Enroll</Text>
      )}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6200ea',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EnrollCourseButton;

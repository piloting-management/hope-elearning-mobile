import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, Alert } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Course } from '@/lib/models';
import auth from '@react-native-firebase/auth';
import { enrollCourse } from '@/lib/services/CourseApi';
import { useNavigation } from '@react-navigation/native';

type EnrollCourseButtonProps = {
  course: Course;
  children?: React.ReactNode;
};

const EnrollCourseButton: React.FC<EnrollCourseButtonProps> = ({
  course,
  children,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(auth().currentUser);
  const [sessionCookie, setSessionCookie] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTokenAndSession = async () => {
      const user = auth().currentUser;
      setCurrentUser(user);
      if (user) {
        const token = await user.getIdToken();
        setUserToken(token);
        const fetchedSessionCookie = 'YOUR_SESSION_COOKIE';
        setSessionCookie(fetchedSessionCookie);
      }
    };

    fetchTokenAndSession();

    const subscriber = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        user.getIdToken().then(setUserToken);
      }
    });

    return subscriber;
  }, []);

  const handleEnrollment = async () => {
    if (!currentUser) {
      Alert.alert(
        'Yetkisiz erişim',
        'Bu işlemi gerçekleştirmek için giriş yapmalısınız.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await enrollCourse(course.id);
      if (response?.success || response) {
        Alert.alert('Başarılı', 'Kurs kaydı başarıyla tamamlandı.');
        navigation.goBack();
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

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/userSlice';
import FacebookLogin from './FacebookLogin';
import { useAppSelector } from '@/lib/hooks';
import { selectTheme } from '../themeSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useAppSelector(selectTheme);
  const dispatch = useDispatch();

  // Hataları kullanıcılara göstermek için bir fonksiyon
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Geçersiz e-posta formatı.';
      case 'auth/user-disabled':
        return 'Bu kullanıcı hesabı devre dışı bırakılmış.';
      case 'auth/user-not-found':
        return 'Bu e-posta ile kayıtlı bir kullanıcı bulunamadı.';
      case 'auth/wrong-password':
        return 'Hatalı şifre girdiniz.';
      case 'auth/too-many-requests':
        return 'Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin.';
      default:
        return 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.';
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      dispatch(
        setUser({
          displayName: user.displayName || '',
          email: user.email || '',
          emailVerified: user.emailVerified,
          token: await user.getIdToken(),
          uid: user.uid,
          photoURL: user.photoURL,
        }),
      );

      Alert.alert('Giriş başarılı!');
    } catch (e: any) {
      const errorMessage = getErrorMessage(e.code);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Sign In</Text>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={colors.highlight}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={colors.highlight}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, { backgroundColor: colors.primary }]}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={[styles.orText, { color: colors.text }]}>OR</Text>
        <View style={styles.line} />
      </View>
      <FacebookLogin />
      <TouchableOpacity>
        <Text style={[styles.signUpText, { color: colors.primary }]}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  signUpText: {
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default LoginScreen;

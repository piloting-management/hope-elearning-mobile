import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Alert,
  View,
} from 'react-native';

const FloatingButtonWithForm = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSendMessage = () => {
    console.log('Mesaj Gönderildi:', message);
    setMessage('');
    setModalVisible(false);
    Alert.alert('Mesajınız gönderildi!');
  };

  return (
    <>
      {/* Floating Button */}
      <View
        style={StyleSheet.absoluteFill} // Tüm ekranı kaplayan görünmez bir View
        pointerEvents="box-none" // Diğer içeriklere müdahale etmiyor
      >
        <TouchableOpacity
          style={[styles.floatingButton, { transform: [{ scale }] }]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => setModalVisible(true)}
        >
             <Text style={styles.floatingButtonText}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Bize Ulaşın</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Mesajınızı yazın"
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <View style={styles.buttonContainer}>
                <Button title="Gönder" onPress={handleSendMessage} />
                <Button
                  title="Kapat"
                  color="red"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 90, // Tab bar ile çakışmasın diye
        right: 20,
        backgroundColor: '#2196F3',
        width: 70,
        height: 60,
        borderTopLeftRadius: 50, // Diğer köşeler yuvarlak
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 100,
    },floatingButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      textInput: {
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
});

export default FloatingButtonWithForm;

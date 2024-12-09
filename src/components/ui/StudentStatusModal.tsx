import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Modern dropdown
import { getStudentStatusList, updateStudentStatus } from '@/lib/services/UserApi';

interface StudentStatusModalProps {
  visible: boolean;
  onClose: () => void;
  colors: { background: string; primary: string; text: string };
  onStatusChange: (status: string) => void; // Yeni durumu dışarı aktarmak için
  forceUpdate?: boolean;
}

const StudentStatusModal: React.FC<StudentStatusModalProps> = ({
  visible,
  onClose,
  colors,
  onStatusChange,
  forceUpdate = false,
}) => {
  const [studentStatusList, setStudentStatusList] = useState<{ label: string; value: string }[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown'un açık/kapalı durumu
  const [isInitialized, setIsInitialized] = useState(false); // İlk API kontrolü için flag

  const fetchStudentStatusList = async () => {
    try {
      setIsLoading(true);
  
      const response = await getStudentStatusList();
  
      if (!response || !response.statuses || !Array.isArray(response.statuses)) {
        throw new Error('Yanıt beklenen formatta değil');
      }
  
      const formattedStatuses = response.statuses.map((status: string) => ({
        label: status,
        value: status,
      }));
      const defaultOption = { label: 'Seçiniz', value: '' };
      setStudentStatusList([defaultOption, ...formattedStatuses]);
      onStatusChange(response.currentStatus)
      if (!forceUpdate && response.currentStatus) {
        // Güncelleme zorlanmamışsa ve mevcut durum varsa modalı kapat
        onClose();
        return;
      }
  
      setSelectedStatus(response.currentStatus || '');
      setIsInitialized(true);
    } catch (error) {
      console.error('Öğrenci durumu listesi alınamadı:', error);
      Alert.alert('Hata', 'Öğrenci durumu listesi alınamadı.');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (visible && !isInitialized) {
      fetchStudentStatusList();
    }
  }, [visible]);
  

  const handleSaveStatus = async () => {
    try {
      setIsLoading(true);
      if (!selectedStatus || selectedStatus === '') {
        Alert.alert('Hata', 'Lütfen bir durum seçin.');
        return;
      }

      const response = await updateStudentStatus(selectedStatus);
      onStatusChange(selectedStatus); 
      Alert.alert('Başarılı');
      onClose(); // Modal'ı kapat
    } catch (error) {
      console.error('Öğrenci durumu güncellenemedi:', error);
      Alert.alert('Hata', 'Öğrenci durumu güncellenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(colors);

  // Eğer modal API kontrolünden sonra açılmayacaksa hiçbir şey render edilmez
  if (!isInitialized) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.title}>
          {forceUpdate ? 'Öğrenci statüsü güncelle' : 'Öğrencinin statüsü?'}
        </Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary || '#0000ff'} />
          ) : (
            <DropDownPicker
              open={dropdownOpen} // Dinamik state ile kontrol
              setOpen={setDropdownOpen} // Dropdown'u açıp kapatacak fonksiyon
              value={selectedStatus}
              items={studentStatusList}
              setValue={setSelectedStatus}
              placeholder="Seçiniz"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={5000}
              multiple={false}
            />
          )}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveStatus}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: { background: string; primary: string; text: string }) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.text,
    },
    dropdown: {
      width: '100%',
      backgroundColor: '#fff',
      borderColor: '#ccc',
      marginBottom: 20,
    },
    dropdownContainer: {
      borderColor: '#ccc',
    },
    saveButton: {
      backgroundColor: colors.primary || '#007BFF',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    saveButtonText: {
      color: colors.text || '#fff',
      fontWeight: 'bold',
    },
    cancelButton: {
      marginTop: 10,
    },
    cancelButtonText: {
      color: colors.primary || '#007BFF',
    },
  });

export default StudentStatusModal;

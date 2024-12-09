import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const App = () => {
  const [commitments, setCommitments] = useState([]);
  const [newCommitment, setNewCommitment] = useState('');
  const [selectedCommitment, setSelectedCommitment] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [manualDate, setManualDate] = useState('');

  const addCommitment = () => {
    if (newCommitment.trim()) {
      const date = manualDate ? new Date(manualDate) : new Date();
      setCommitments([...commitments, { id: Date.now().toString(), title: newCommitment, date }]);
      setNewCommitment('');
      setManualDate('');
    } else {
      Alert.alert('Erro', 'Digite um compromisso válido.');
    }
  };

  const onCommitmentPress = (commitment) => {
    setSelectedCommitment(commitment);
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedCommitment.date;
    setShowDatePicker(false);
    setCommitments(commitments.map(c => 
      c.id === selectedCommitment.id ? { ...c, date: currentDate } : c
    ));
    setSelectedCommitment(null);
  };

  const deleteCommitment = (id) => {
    setCommitments(commitments.filter(c => c.id !== id));
  };

  const renderCommitment = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 75 }} onPress={() => deleteCommitment(item.id)}>
          <Text style={{ color: 'white' }}>Apagar</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity onPress={() => onCommitmentPress(item)}>
        <Text>{item.title} - {item.date.toDateString()}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput 
        placeholder="Novo Compromisso"
        value={newCommitment}
        onChangeText={setNewCommitment}
        style={{ borderWidth: 1, padding: 8, width: '80%', marginBottom: 10 }}
      />
      <TextInput 
        placeholder="Data (YYYY-MM-DD)"
        value={manualDate}
        onChangeText={setManualDate}
        style={{ borderWidth: 1, padding: 8, width: '80%', marginBottom: 10 }}
      />
      <Button title="Adicionar Compromisso" onPress={addCommitment} />
      <FlatList
        data={commitments}
        renderItem={renderCommitment}
        keyExtractor={(item) => item.id}
        style={{ width: '100%', marginTop: 20 }}
      />
      {showDatePicker && (
        <DateTimePicker
          value={selectedCommitment.date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </GestureHandlerRootView>
  );
};

export default App;

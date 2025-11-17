import React, { forwardRef } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const AccessibleInput = forwardRef(({ label, value, onChangeText, placeholder, ...props }, ref) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        ref={ref}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={label || placeholder}
        accessibilityHint={`Digite ${label || placeholder}`}
        {...props}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { marginBottom: 15, width: '100%' },
  label: { fontSize: 14, marginBottom: 5, fontWeight: 'bold', color: '#333' },
  input: {
    height: 44, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, paddingHorizontal: 10, fontSize: 16, backgroundColor: '#fff',
  },
});

export default AccessibleInput;
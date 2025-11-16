import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const AccessibleButton = ({ label, onPress, style, children, ...props }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.touchableArea, style]}
      accessibilityLabel={label}
      accessibilityRole="button"
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableArea: {
    minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center',
  },
});

export default AccessibleButton;
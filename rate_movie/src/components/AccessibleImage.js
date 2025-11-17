import React from 'react';
import { Image } from 'react-native';

const AccessibleImage = ({ alt, source, style, ...props }) => {
  return (
    <Image
      source={source}
      style={style}
      accessible={true}
      accessibilityLabel={alt || "Imagem sem descrição"}
      accessibilityRole="image"
      {...props}
    />
  );
};

export default AccessibleImage;
import React from 'react';
import { View, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';

import styles from '../config/styles';

function Gallery({ captures = [] }) {
  return (
    <ScrollView horizontal={true} style={[styles.galleryContainer]}>
      {captures.map(({ uri }) => (
        <TouchableWithoutFeedback >
          <View style={styles.galleryImageContainer} key={uri}>
            <Image source={{ uri }} style={styles.galleryImage} />
          </View>
        </TouchableWithoutFeedback>
      ))}
    </ScrollView>
  );
}
export default Gallery;

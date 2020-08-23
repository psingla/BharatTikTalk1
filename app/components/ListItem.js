import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

import colors from '../config/colors';
import AppButton from './Button';
import { Colors } from 'react-native/Libraries/NewAppScreen';

function ListItem({ title, subtitle, image, time, caption=null, onpress=null, leftImage=null }) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.discrptions}>
          <Text style={styles.subtitle }>{subtitle}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        
      </View>
      <View style={{height:5,width:100 ,marginLeft: 'auto' }}>
        {caption && <AppButton onPress={()=>onpress()} title={caption} />}
        </View>
        { leftImage && <Image style={styles.image} source={leftImage} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  title: {
    color: colors.medium,
  },
  subtitle: {
    fontWeight: '500',
    color: colors.white,
    width:150
  },
  discrptions: {
    flexDirection: 'row',
    maxWidth:'80%'
  },
  time: {
    color: colors.medium,
    marginLeft:4
  },
});

export default ListItem;

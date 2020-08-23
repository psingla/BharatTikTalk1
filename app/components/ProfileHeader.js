import React from 'react';
import {  View, StyleSheet } from 'react-native';
import { AntDesign, MaterialIcons,FontAwesome  } from '@expo/vector-icons';
import Text from '../components/Text';
import colors from '../config/colors';

function ProfileHeader({onPress, headerText, leftIcon,isSettingVisible=true}) {
  return (
    <View style={[styles.header]}>
      <AntDesign style={{ position: 'absolute', left: 10, top: 10 }} name={leftIcon} size={24} onPress={onPress} color={colors.white} />
      <Text>{headerText}</Text>
      {/* <MaterialIcons name='arrow-drop-down' size={24} color={colors.white} /> */}
      {isSettingVisible && <FontAwesome style={{ position: 'absolute', right: 13, top: 12 }} name='ellipsis-v' size={24} color={colors.white} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dadada',
  },
});
export default ProfileHeader;

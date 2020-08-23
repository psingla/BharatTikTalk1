import React from 'react'; 
import { StyleSheet, View } from 'react-native';

import AppText from '../components/Text';
import Screen from '../components/Screen';
function BlankScreen(pros) {
 return (
 <Screen style={styles.container}>
     <AppText>Comming Sooon!!!</AppText>
 </Screen>
 );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default BlankScreen;
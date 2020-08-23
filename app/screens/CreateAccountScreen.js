import React from 'react';
import AuthContext from '../auth/context';
import { View, Text, Button } from 'react-native';
import styles from '../config/styles';
const CreateAccountScreen = () => {
  const { signUp } = React.useContext(AuthContext);

  return (
    <View style={styles.alignCenter}>
      <Text>Create Account Screen</Text>
      <Button title='Sign Up' onPress={() => signUp()} />
    </View>
  );
};

export default CreateAccountScreen;

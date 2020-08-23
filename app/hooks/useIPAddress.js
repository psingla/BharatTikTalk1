import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export default useNetwork = () => {
  const [ipAddress, setIpAddress] = useState('');
  const getIpAddress = async () => {
    setIpAddress(await Network.getIpAddressAsync());
  };

  useEffect(() => {
    getIpAddress();
  }, []);

  return ipAddress;
};

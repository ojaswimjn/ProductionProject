import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import  { width, height } from '../../app/(tabs)/index'
const menuItems = [
  { title: 'Schedule', icon: 'clock-outline', route: '/app/(tabs)/profileScreen.tsx' },
  { title: 'Recycle', icon: 'recycle', route: '/app/(tabs)/scannerScreen.tsx' },
  { title: 'Tips', icon: 'lightbulb-outline', route: '/tips' },
  { title: 'Tips', icon: 'lightbulb-outline', route: '/tips' },
  { title: 'Blog', icon: 'file-document-outline', route: '/blog' },
  { title: 'Donate', icon: 'hand-heart-outline', route: '/donate' }
];

const GridMenu = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.button} 
          onPress={() => router.push(item.route as any)}
        >
          <Icon name={item.icon} size={24} color="black" />
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: '#E8F6EF',
    width: width * 0.91,
    alignSelf: 'center',
    paddingTop: '12%',
   
  },
  button: {
    width: '30%',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    marginVertical: 6,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2B4B40',
  },
});

export default GridMenu;

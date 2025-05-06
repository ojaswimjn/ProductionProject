import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


const categories = [
  {
    name: 'Paper',
    image: require('../../assets/images/staticPaper.jpg'),
  },
  {
    name: 'Glass',
    image: require('../../assets/images/staticGlass.jpg'),
  },
  {
    name: 'Cardboard',
    image: require('../../assets/images/staticCardboard.webp'),
  },
  {
    name: 'Metal',
    image: require('../../assets/images/staticMetal.jpg'),
  },
  {
    name: 'Plastic',
    image: require('../../assets/images/staticPlastic.jpg'),
  },
  {
    name: 'Trash',
    image: require('../../assets/images/staticTrash.jpg'),
  },
];

const RecyclableSliderGrid = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity onPress={() => router.push('/pointsReedemptionScreen')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map((category, index) => (
        <TouchableOpacity key={index} style={styles.card}>
            <Image source={category.image} style={styles.image} />
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'transparent']}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
            style={styles.gradientOverlay}
            />
            <View style={styles.labelWrapper}>
            <Text style={styles.label}>{category.name}</Text>
            </View>
        </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecyclableSliderGrid;

const styles = StyleSheet.create({
  container: {
    // marginVertical: 0,
    paddingHorizontal: 10,
    marginBottom: '15%',
    marginTop: '-3%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: '#aaa',
  },
  card: {
    marginRight: 18,
    width: 120,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderRadius: 16,
  },
  
  labelWrapper: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  


  
});

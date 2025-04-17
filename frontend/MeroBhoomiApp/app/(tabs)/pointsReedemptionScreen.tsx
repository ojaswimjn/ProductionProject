import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { Button, View, StyleSheet, Image, Text, ScrollView, Dimensions  } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASEURL } from "../authDisplayService";
import { getUserProfile } from "../services/authDisplayProfile";
import { getRewardsPoint } from "../services/getRewardsPointService";

const { width, height } = Dimensions.get('window');

const PointsAndReedemptionScreen = () => {
  const [totalWasteItems, setTotalWasteItem] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);

  const [categoryCounts, setCategoryCounts] = useState<{ [key: number]: number }>({});

  const categories = [
    { id: 7, name: 'Paper', image: require('../../assets/images/staticPaper.jpg') },
    { id: 8, name: 'Glass', image: require('../../assets/images/staticGlass.jpg') },
    { id: 9, name: 'Cardboard', image: require('../../assets/images/staticCardboard.webp') },
    { id: 10, name: 'Metal', image: require('../../assets/images/staticMetal.jpg') },
    { id: 11, name: 'Plastic', image: require('../../assets/images/staticPlastic.jpg') },
    { id: 12, name: 'Trash', image: require('../../assets/images/staticTrash.jpg') },
  ];

  useFocusEffect(
    useCallback(() => {
      const fetchWasteItems = async () => {
        try {
          const userProfile = await getUserProfile();
          const user_id = userProfile.id;
  
          const userReward = await getRewardsPoint();
          const rewardPoints = userReward.reduce((total: number, reward: any) => {
            return total + (reward.points || 0);
          }, 0);
          setRewardPoints(rewardPoints);
  
          const response = await fetch(`${API_BASEURL}/wasteitem/user/?user_id=${user_id}`);
          const data = await response.json();
  
          setTotalWasteItem(data.length);
  
          const counts = data.reduce((acc: { [key: number]: number }, item: any) => {
            acc[item.category_id] = (acc[item.category_id] || 0) + 1;
            return acc;
          }, {});
          setCategoryCounts(counts);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
  
      fetchWasteItems();
    }, [])
  );
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Your Recycling Summary</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Recycled Items:</Text>
        <Text style={styles.summaryValue}>{totalWasteItems}</Text>
        <Text style={styles.summaryTitle}>Total Reward Points:</Text>
        <Text style={styles.summaryValue}>{rewardPoints}</Text>
      </View>

      <Text style={styles.subHeading}>Progress</Text>

      {categories.map(({ id, name, image }) => (
        <View key={id} style={styles.itemCard}>
          <Image source={image} style={styles.itemImage} resizeMode="cover" />
          <View>
            <Text style={styles.itemText}>{name}</Text>
            <Text style={styles.countText}>Recycled: {categoryCounts[id] || 0}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: height * 0.06,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fefefe',
    paddingTop: 80,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2B4B40',
    
  },
  subHeading: {
    fontSize: width * 0.05,
    fontWeight: '600',
    // marginVertical: height * 0.02,
    marginTop: height *0.04,
    marginBottom: height*0.01,
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#E8F1EE',
    borderRadius: width * 0.04,
    padding: width * 0.06,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: width * 0.045,
    fontWeight: '500',
    color: '#444',
    marginTop: height * 0.015,
  },
  summaryValue: {
    fontSize: width * 0.065,
    fontWeight: '800',
    color: '#2B4B40',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: width * 0.03,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    alignItems: 'center',
    shadowColor: '#aaa',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 3,
    elevation: 4,
  },
  itemImage: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.02,
    marginRight: width * 0.04,
  },
  itemText: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#222',
  },
  countText: {
    fontSize: width * 0.04,
    color: '#666',
  },
});

export default PointsAndReedemptionScreen;

import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { Button, View, StyleSheet, Image, Text, ScrollView, Dimensions  } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon'; 

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASEURL } from "../authDisplayService";
import { getUserProfile } from "../services/authDisplayProfile";
import { getRewardsPoint } from "../services/getRewardsPointService";

const { width, height } = Dimensions.get('window');

interface LeaderboardEntry {
  user_id: number;
  total_items: number;
  total_points: number;
}


const PointsAndReedemptionScreen = () => {
  const [totalWasteItems, setTotalWasteItem] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);

  const [categoryCounts, setCategoryCounts] = useState<{ [key: number]: number }>({});

  const [congratsMessage, setCongratsMessage] = useState('');



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


          const leaderboardResponse = await fetch(`${API_BASEURL}/wasteitem/leaderboard/`);
          const leaderboard: LeaderboardEntry[] = await leaderboardResponse.json();

          if (leaderboard.length > 0) {
            const topRecycler = leaderboard.reduce((prev, curr) => 
              curr.total_items > prev.total_items ? curr : prev
            );

            const topPointsHolder = leaderboard.reduce((prev, curr) =>
              curr.total_points > prev.total_points ? curr : prev
            );

            if (user_id === topRecycler.user_id && user_id === topPointsHolder.user_id) {
              setCongratsMessage("Congratulations!🎉 You're leading the board in both recycling and reward points! Keep on recycling.");
            } else if (user_id === topRecycler.user_id) {
              setCongratsMessage("You're the top recycler! Keep up the great work!");
            } else if (user_id === topPointsHolder.user_id) {
              setCongratsMessage("You've earned the most reward points! Fantastic job!");
            } else {
              setCongratsMessage(""); // No message if not leading
            }

          }

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

      {congratsMessage !== '' && (
        <>
        <ConfettiCannon
          count={100}
          origin={{ x: width / 2, y: -20 }}
          autoStart={true}
          fallSpeed={3000}
          explosionSpeed={500}
          fadeOut={true}
        />
        <View style={styles.messageContainer}>
          <Image
            source={require('../../assets/images/trophy.png')}
            style={styles.trophyImage}
            resizeMode="contain"
          ></Image>
          <Text style={styles.messageText}>{congratsMessage}</Text>
        </View>
        </>
      )}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Recycled Items:</Text>
        <Text style={styles.summaryValue}>♻️ {totalWasteItems}</Text>
        <Text style={styles.summaryTitle}>Total Reward Points:</Text>
        <Text style={styles.summaryValue}>🪙 {rewardPoints}</Text>

        
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
  trophyImage: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginBottom: 10,
  },
  
  messageContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation:2,
  },
  messageText: {
    fontSize: 16,
    color: '#2B4B40',
    textAlign: 'center',
    fontWeight: 'bold',
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

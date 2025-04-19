import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground,ActivityIndicator, Alert,   Dimensions,} from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { API_BASEURL } from "../../app/authDisplayService";
import { getUserProfile } from "@/app/services/authDisplayProfile";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const { width, height } = Dimensions.get("window"); // Get the screen dimensions

interface WasteItem {
  waste_item_id: number;
  accuracy_score: number;
  identified_date: string;
  category_id: number;
  image_id: number;
};


const DataDashboard = () => {
  const [totalWasteItems, setTotalWasteItem] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<{ [key: number]: number }>({});
  const [recycledDaysCount, setRecycledDaysCount] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try{
        const userProfile = await getUserProfile();
        const user_id = userProfile.id;

        const response = await fetch(`${API_BASEURL}/wasteitem/user/?user_id=${user_id}`);

        const data = await response.json();
        console.log(data)

        setTotalWasteItem(data.length);

        const counts = data.reduce((acc: { [key: number]: number }, item: any) => {
          acc[item.category_id] = (acc[item.category_id] || 0) + 1;
          return acc;
        }, {});
        setCategoryCounts(counts);

        if (data.length === 0) {
          setRecycledDaysCount('activity not found');
          return;
        }
        

        const latestDate: Date = data.reduce((latest: Date, item: any) => {
          const current = new Date(item.identified_date);
          return current > latest ? current : latest;
        }, new Date(0));
        
        console.log("Latest Recycled Date:", latestDate.toLocaleDateString())

        const todaysDate = new Date();
        const timeDiff = todaysDate.getTime() - latestDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

        if (dayDiff === 0) {
          setRecycledDaysCount('today')
          // console.log("Latest Recycled Date: Today");
        } else {
          setRecycledDaysCount(`${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`)
          // console.log(`Latest Recycled Date: ${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`);
        }



        

      }catch(error){
        console.error("Error fetching data in datadashboard component: ", error);
      }
    }

    fetchUserId();
  }, []);



  return (
    <View style={styles.container}>
      <ImageBackground source={require("../../assets/images/secondProfile-bg.png")} style={styles.profileBox} imageStyle={{ borderRadius: 16 }}>
        <View style={styles.topTextBox}>
          <Text style={styles.title}>No. of Items Recycled</Text>
          <Text style={styles.subtitle}>Thank you for making an effort in recycling!</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="timer" size={18} color="#555" style={styles.icon} />
          <Text style={styles.lastRecycled}>Last Recycled {recycledDaysCount}</Text>
        </View>

        <Text style={styles.count}>{totalWasteItems}</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: '3%',
    // marginBottom: '1%'

    // backgroundColor: "#ffffff",
  },
  profileBox: {
    width: width * 0.9,
    height: 200,
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  topTextBox: {
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2%'

  },
  icon: {
    marginRight: 5,
    color: "#fff",
  },
  lastRecycled: {
    fontSize: 15,
    color: "#ffffff",
  },
  count: {
    position: "absolute",
    bottom: 20,
    right: 20,
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default DataDashboard;

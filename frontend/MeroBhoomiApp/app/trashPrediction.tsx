import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet } from "react-native";
import { API_BASEURL } from "./authDisplayService";
import {getUserProfile} from "./services/authDisplayProfile"
import axios from "axios";
import { useEffect, useState } from "react";
import {getRewardsPoint} from "./services/getRewardsPointService"

export default function TrashPrediction() {
  const { image, response } = useLocalSearchParams();
  // Parse response back into an object
  const parsedResponse = response ? JSON.parse(response as string) : null;


  const [points, setPoints ]=useState(0);


  useEffect(()=>{
    if(parsedResponse){
      updateRewardPoints(parsedResponse)
    }
  },[])

  const updateRewardPoints = async(parsedResponse: any) =>{
      const accuracy_score = parsedResponse.accuracy_score;

      let pointsToAdd =0;
      if(accuracy_score>0.90){
        pointsToAdd=10;
      }
      else if(accuracy_score>0.7 && accuracy_score<0.90){
        pointsToAdd=5;
      }
      else{
        pointsToAdd=0;
      }

      try{
        const userProfile = await getUserProfile();
        const userId = userProfile.id;
        console.log("ussserrrrsss_id:",userId)

        
        console.log("pointsto adsd",parsedResponse.accuracy_score)
        const description = `From waste type: ${parsedResponse.category_name}`

        const response= await axios.patch(`${API_BASEURL}/reward/updatereward/`,
        {
          user_id : userId,
          points:pointsToAdd,
          description: description
        },
        {
          headers: {'Content-Type': 'application/json'}
        })

        setPoints(response.data.points)
        console.log("Reward points updated successfullyyyyy:", response.data.points);


      }catch(error: any){
        console.error("Error updating reward points:", error);
        alert("Failed to update reward points.");
  
      }
    }
    
    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trash Prediction</Text>

          {parsedResponse && (
            <>
            <View>
          <Text>Category: {parsedResponse.category_name}</Text>
          <Text>Accuracy Score: {parsedResponse.accuracy_score}</Text>
          <Text>Predicted Class Indexx: {parsedResponse.predicted_class_index}</Text>
          <Text>
</Text>
          </View>

          
            </>
        
        
      )
      }

        <Text>Current Points: {points}</Text>
\

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" ,backgroundColor: '#ffff'},
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  image: { width: 900, height: 200, borderRadius: 10, marginBottom: 20 },
});

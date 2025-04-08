import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { API_BASEURL } from "./authDisplayService";
import { getUserProfile } from "./services/authDisplayProfile";
import axios from "axios";
import { useEffect, useState } from "react";
import { getRewardsPoint } from "./services/getRewardsPointService";

export default function TrashPrediction() {
  const { image, response } = useLocalSearchParams();
  const parsedResponse = response ? JSON.parse(response as string) : null;

  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (parsedResponse) {
      updateRewardPoints(parsedResponse);
    }
  }, []);

  const updateRewardPoints = async (parsedResponse: any) => {
    const accuracy_score = parsedResponse.accuracy_score;

    let pointsToAdd = 0;
    if (accuracy_score > 0.9) {
      pointsToAdd = 10;
    } else if (accuracy_score > 0.7 && accuracy_score < 0.9) {
      pointsToAdd = 5;
    } else {
      pointsToAdd = 0;
    }

    try {
      const userProfile = await getUserProfile();
      const userId = userProfile.id;

      const description = `From waste type: ${parsedResponse.category_name}`;

      const response = await axios.patch(
        `${API_BASEURL}/reward/updatereward/`,
        {
          user_id: userId,
          points: pointsToAdd,
          description: description,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setPoints(response.data.points);
    } catch (error: any) {
      console.error("Error updating reward points:", error);
      alert("Failed to update reward points.");
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Your Trash Prediction</Text>

        {parsedResponse && (
          <View style={styles.predictionContainer}>
            <Image
              source={{ uri: `${API_BASEURL}${parsedResponse.image_url}` }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.predictionDetails}>
              <Text style={styles.predictionText}>
                Category: {parsedResponse.category_name}
              </Text>
              <Text style={styles.predictionText}>
                Accuracy: {parsedResponse.accuracy_score}
              </Text>
              <Text style={styles.predictionText}>
                Class Index: {parsedResponse.predicted_class_index}
              </Text>
              <Text style={styles.recyclingNote}>
                Recycling this type of item helps reduce waste and conserve
                resources.
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.pointsEarned}>Points Earned: {points}</Text>

        <View style={styles.pointsContainer}>
          <View style={styles.pointsLeft}>
            <Text style={styles.earnedText}>You earned {points} points</Text>
            <Text style={styles.totalText}>Total: {points}</Text>
            <Text style={styles.coinInfo}>
              For each recycled item, you get a different amount of coins.
            </Text>
          </View>
          <Image
            source={require("../assets/images/coins.jpg")} // replace with your image path
            style={styles.coinImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.tipContainer}>
          <Text style={styles.tipHeader}>♻️ Recycling Tip</Text>
          <Text style={styles.tipText}>
            Always rinse recyclable containers to avoid contamination. Sorting
            clean materials increases recycling efficiency!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#f5f5f5",
  },
  mainContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  predictionContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  predictionDetails: {
    flex: 1,
    justifyContent: "center",
  },
  predictionText: {
    fontSize: 16,
    marginBottom: 4,
  },
  recyclingNote: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  pointsEarned: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  pointsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
  },
  pointsLeft: {
    flex: 1,
  },
  earnedText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  coinInfo: {
    fontSize: 13,
    color: "#888",
    marginTop: 8,
  },
  coinImage: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  tipContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 30,
  },
  tipHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#555",
  },
});

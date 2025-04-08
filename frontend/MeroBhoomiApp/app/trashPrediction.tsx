import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet } from "react-native";
import { API_BASEURL } from "./authDisplayService";
import { getUserProfile } from "./services/authDisplayProfile";
import axios from "axios";
import { useEffect, useState } from "react";

export default function TrashPrediction() {
  const { image, response } = useLocalSearchParams();
  // Parse response back into an object
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
    } else if (accuracy_score > 0.7 && accuracy_score <= 0.9) {
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
      console.log("Reward points updated successfully:", response.data.points);
    } catch (error: any) {
      console.error("Error updating reward points:", error);
      alert("Failed to update reward points.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Title */}
      <Text style={styles.title}>Your Trash Prediction</Text>

      {/* White Container with Shadow */}
      <View style={styles.whiteContainer}>
        {/* Left Side - Image */}
        <View style={styles.leftSide}>
          {parsedResponse && (
            <Image
              source={{
                uri: `${API_BASEURL}${parsedResponse.image_url}`,
              }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Right Side - Prediction Details */}
        <View style={styles.rightSide}>
          {parsedResponse && (
            <>
              <Text style={styles.predictionText}>
                Category: {parsedResponse.category_name}
              </Text>
              <Text style={styles.predictionText}>
                Accuracy Score: {parsedResponse.accuracy_score.toFixed(2)}
              </Text>
              <Text style={styles.predictionText}>
                Predicted Class Index: {parsedResponse.predicted_class_index}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Recycling Importance Message */}
      <Text style={styles.importanceText}>
        Recycling this type of waste is crucial for reducing landfill waste and
        conserving natural resources.
      </Text>

      {/* Points Earned */}
      <Text style={styles.pointsEarned}>Points Earned: {points}</Text>

      {/* Points Summary Container */}
      <View style={styles.pointsContainer}>
        {/* Left Side - Points Details */}
        <View style={styles.pointsLeftSide}>
          <Text style={styles.pointsText}>Points Earned: {points}</Text>
          <Text style={styles.pointsText}>Total Points: {points}</Text>
          <Text style={styles.coinsInfo}>
            For each recycled item, you get a different amount of coins.
          </Text>
        </View>

        {/* Right Side - Coins Image */}
        <View style={styles.pointsRightSide}>
          <Image
            source={require("./assets/coins.png")} // Replace with your static image path
            style={styles.coinsImage}
          />
        </View>
      </View>

      {/* Recycling Tips Container */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Recycling Tips</Text>
        <Text style={styles.tip}>
          - Always rinse containers before recycling.
        </Text>
        <Text style={styles.tip}>
          - Remove caps and lids from bottles and jars.
        </Text>
        <Text style={styles.tip}>
          - Flatten cardboard boxes to save space.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  whiteContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  leftSide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rightSide: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  predictionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  importanceText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  pointsEarned: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pointsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  pointsLeftSide: {
    flex: 2,
    justifyContent: "center",
  },
  pointsRightSide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  coinsInfo: {
    fontSize: 12,
    color: "#555",
  },
  coinsImage: {
    width: 80,
    height: 80,
  },
  tipsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tip: {
    fontSize: 14,
    marginBottom: 5,
  },
});
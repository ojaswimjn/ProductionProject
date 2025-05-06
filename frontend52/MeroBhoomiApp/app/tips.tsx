// app/tips.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import TipCard from "../components/home/TipsCard";
import { useRouter } from "expo-router";

const tipsData = [
  {
    id: 1,
    title: "Waste Reduction Tip",
    short: "Simple ways to reduce daily waste.",
    detail:
      "Reducing waste starts with making conscious choices every day. Opt for reusable bags, bottles, and containers instead of single-use items. Try buying in bulk to reduce packaging waste and plan your meals to avoid food wastage. Repair and repurpose old items instead of discarding them immediately. Small habits like refusing plastic straws, unsubscribing from junk mail, and avoiding excessive packaging can make a significant impact over time.",
    image: require("../assets/images/WasteReduction.webp"),
  },
  {
    id: 2,
    title: "Recycling Tip",
    short: "Maximize your recycling impact.",
    detail:
      "Effective recycling requires a bit more than tossing things into the bin. First, make sure your recyclables are clean and dry – food residue can contaminate an entire batch. Separate materials like paper, plastic, and metal according to your local recycling rules. Avoid recycling items like greasy pizza boxes, plastic bags, or broken glass unless your facility specifically accepts them. Learning your local recycling codes and participating in community recycling programs can amplify your efforts.",
    image: require("../assets/images/recyclingTip.jpeg"),
  },
  {
    id: 3,
    title: "Composting Tip",
    short: "Turn waste into nutrient-rich compost.",
    detail:
      "Composting is a natural process that transforms organic waste into rich soil fertilizer. Start by collecting kitchen scraps like fruit and vegetable peels, eggshells, coffee grounds, and tea bags. Avoid adding meat, dairy, or oily foods as they can attract pests. Balance your compost with 'greens' (wet, nitrogen-rich materials) and 'browns' (dry, carbon-rich materials like leaves or cardboard). Regularly turn the pile to provide oxygen, and in a few months, you’ll have nutrient-rich compost perfect for your garden.",
    image: require("../assets/images/compostingTip.jpg"),
  },
  {
    id: 4,
    title: "Waste Awareness Tip",
    short: "Be mindful of waste impact.",
    detail:
      "Understanding how your waste affects the environment is crucial for change. Most of the waste we produce ends up in landfills or oceans, contributing to pollution and harming wildlife. Be aware of your consumption patterns, and practice the 5Rs – Refuse, Reduce, Reuse, Recycle, and Rot. Educate yourself and others about the environmental costs of waste and participate in cleanup drives, waste audits, or awareness campaigns to spread the message. Change starts with awareness, and awareness starts with you.",
    image: require("../assets/images/wasteAwarenessTip.jpg"),
  },
];

export default function TipsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Waste Management Tips</Text>
        {tipsData.map((tip) => (
          <TipCard
            key={tip.id}
            image={tip.image}
            title={tip.title}
            shortText={tip.short}
            onPress={() =>
              router.push({
                pathname: "/tipDetail",
                params: {
                  title: tip.title,
                  detail: tip.detail,
                  image: Image.resolveAssetSource(tip.image).uri,
                },
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#2B4B40",
  },
});

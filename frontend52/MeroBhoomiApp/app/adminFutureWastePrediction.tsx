import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { API_BASEURL } from './authDisplayService';
import { Stack } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

interface Prediction {
  date: String;
  predicted_weight: number;
}

export default function FutureWasteChart() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${API_BASEURL}/future-waste-predict/`);
      const data = await response.json();
      setPredictions(data.predictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4f46e5" />;
  }

  // Prepare the data
  const chartData = {
    labels: predictions.map((item) => {
      const date = new Date(item.date.toString());
      return `${date.getDate()}/${date.getMonth() + 1}`; // Format like 2/5, 6/5
    }),
    datasets: [
      {
        data: predictions.map((item) => item.predicted_weight),
        strokeWidth: 2,
      },
    ],
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Waste Prediction Rate',
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Predicted Waste Collection</Text>
        <Text style={styles.subtitle}>(May 2025)</Text>
          
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={chartData}
            width={Math.max(screenWidth - 32, predictions.length * 50)} // Adjust width dynamically
            height={550}
            yAxisSuffix="kg"
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // Purple-ish line
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#4f46e5',
              },
            }}
            style={styles.chart}
          />
        </ScrollView>  
        
      </ScrollView>
    </>
  );
}

// Styles at the bottom
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
    textAlign: 'center',
    color: '#2B4B40'
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    color: '#2B4B40'
  },
  chart: {
    marginVertical: 8,
  },
});
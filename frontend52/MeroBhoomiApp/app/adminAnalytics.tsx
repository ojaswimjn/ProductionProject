import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { API_BASEURL } from './authDisplayService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Stack } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

interface WasteDataItem {
  date: string;
  total_weight: number;
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(43, 75, 64, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 1,
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#2B4B40"
  }
};

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  const [summaryInfo, setSummaryInfo] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [barChartData, setBarChartData] = useState<any>(null);

  useEffect(() => {
    fetchChartData(currentMonth);
  }, [currentMonth]);

  const fetchChartData = async (month: dayjs.Dayjs) => {
    setLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASEURL}/scheduled-waste-summary/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const allData: WasteDataItem[] = res.data;

        // For the selected month (used in line chart)
        const filtered = allData.filter((item: WasteDataItem) =>
        dayjs(item.date).isSame(month, 'month')
        );

      const labels = filtered.map((item: WasteDataItem) => dayjs(item.date).format('DD'));
      const data = filtered.map((item: WasteDataItem) => item.total_weight);
      const labeledDates = filtered.map((item: WasteDataItem) => ({
        label: dayjs(item.date).format('MMM D'),
        value: item.total_weight
      }));

      const total = data.reduce((acc: number, val: number) => acc + val, 0);
      const average = (total / data.length).toFixed(2);
      const max = Math.max(...data);
      const maxIndex = data.indexOf(max);
      const peakDate = labeledDates[maxIndex]?.label;

      setSummaryInfo({
        total: total.toFixed(2),
        average,
        peakDate,
        peakValue: max
      });

      setChartData({
        labels: labeledDates.map(item => item.label),
        datasets: [{ data }]
      });

      const monthsOfYear = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMM'));
      const monthlyData = monthsOfYear.map((monthLabel, index) => {
  const totalWeightForMonth = allData
    .filter(item => dayjs(item.date).month() === index)
    .reduce((acc, item) => acc + item.total_weight, 0);
  return parseFloat(totalWeightForMonth.toFixed(2));
});

      setBarChartData({
        labels: monthsOfYear,
        datasets: [{ data: monthlyData }]
      });

    } catch (err) {
      console.error("Failed to fetch analytics data", err);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousMonth = () => setCurrentMonth(prev => prev.subtract(1, 'month'));
  const goToNextMonth = () => setCurrentMonth(prev => prev.add(1, 'month'));

  return (
    <>
        <Stack.Screen 
                options={{
                headerShown: true, 
                title: 'Analytics', 
                }} 
            />

        <ScrollView style={styles.container}>
        <Text style={styles.heading}>Waste Analytics</Text>

        <View style={styles.navigation}>
            <TouchableOpacity onPress={goToPreviousMonth}><Text style={styles.navArrow}>{"<"}</Text></TouchableOpacity>
            <Text style={styles.monthText}>{currentMonth.format("MMMM YYYY")}</Text>
            <TouchableOpacity onPress={goToNextMonth}><Text style={styles.navArrow}>{">"}</Text></TouchableOpacity>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#2B4B40" />
        ) : chartData && chartData.datasets[0].data.length > 0 ? (
            <>
            <View style={styles.summaryRow}>
                <View style={styles.summaryBox}>
                <Icon name="package-variant" size={26} color="#2B4B40" />
                <Text style={styles.label}>Total Waste</Text>
                <Text style={styles.value}>{summaryInfo.total} kg</Text>
                </View>

                <View style={styles.summaryBox}>
                <Icon name="chart-line" size={26} color="#2B4B40" />
                <Text style={styles.label}>Avg/Day</Text>
                <Text style={styles.value}>{summaryInfo.average} kg</Text>
                </View>

                <View style={styles.summaryBox}>
                <Icon name="calendar-star" size={26} color="#2B4B40" />
                <Text style={styles.label}>Peak</Text>
                <Text style={styles.value}>{summaryInfo.peakDate} ({summaryInfo.peakValue} kg)</Text>
                </View>
            </View>

            <Text style={styles.sectionHeading}> Scheduled Waste (kg)</Text>
            {/* <Text > (waste collected in a day )</Text> */}

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                  data={chartData}
                  width={screenWidth - 20}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
              />
            </ScrollView>
            

            <Text style={styles.sectionHeading}>Monthly Summary (kg)</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={barChartData}
                    width={screenWidth * 1.5} // or adjust to 1000 if needed
                    height={220}
                    chartConfig={chartConfig}
                    yAxisLabel=""
                    yAxisSuffix="kg"
                    style={styles.charts}
                />
                </ScrollView>
            </>
        ) : (
            <Text style={styles.noData}>No data available for this month.</Text>
        )}
        </ScrollView>
    </>    
  );
};

export default AdminAnalytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B4B40',
    textAlign: 'center',
    marginBottom: 16,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navArrow: {
    fontSize: 20,
    color: '#2B4B40',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B4B40',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#E8F1EE',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    elevation:2
  },
  label: {
    fontSize: 13,
    color: '#2B4B40',
    marginTop: 6,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A3B32',
    marginTop: 2,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 10,
    marginTop: 12,
    marginRight:12,
  },
  charts: {
    borderRadius: 10,
    marginTop: 12,
    marginRight:29,
  },
  sectionHeading: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#2B4B40',
    marginBottom: 6,
  },
  noData: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
    marginTop: 40,
  },
});

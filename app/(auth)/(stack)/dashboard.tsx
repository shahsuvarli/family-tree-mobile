import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function DashboardScreen() {
  const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

  return (
    <View>
      <PieChart
        data={data}
        focusOnPress
        showText
        textColor="black"
        showValuesAsLabels
      />
    </View>
  );
}

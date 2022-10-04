import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Button,
  TextInput,
} from "react-native";

const CountryComponent = (props) => {
  const { source, title, largestCountry, area, language } = props;
  return (
    <View style={styles.containerTwo}>
      <View>
        <TouchableOpacity>
          <Image source={{ uri: `${source}` }} style={styles.firstImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.view}>
        <View>
          <Text style={styles.text}>{title}</Text>
          <Text style={styles.text}>{language} </Text>
        </View>
        <View style={{ flex: 1, marginBottom: 10 }}>
          <Text style={styles.text}>{area} </Text>
        </View>
      </View>
      <View style={styles.view}>
        <Text style={styles.text}>Largest Neighbour</Text>
        <Image
          source={{ uri: `${largestCountry}` }}
          style={styles.secondImage}
        />
      </View>
    </View>
  );
};

export default function App() {
  const [processing, setProcessing] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [fetchedCountry, setFetchedCountry] = useState({
    title: "Sweden",
    source: "https://flagcdn.com/w320/se.png",
    area: "42286",
    language: "Swedish",
  });

  function compareLargestBorderArea(a, b) {
    return a.area < b.area ? 1 : a.area > b.area ? -1 : 0;
  }

  function getFetchedInputCountry() {
    fetch(`https://restcountries.com/v3/name/${countryValue}`)
      .then((countryItem) => countryItem.json())
      .then((fetchedData) => {
        fetchedCountry.title = fetchedData[0].name.common;
        fetchedCountry.language = Object.values(fetchedData[0].languages);
        fetchedCountry.border = fetchedData[0].borders.toString();
        fetchedCountry.source = fetchedData[0].flags[1];
        fetchedCountry.area = fetchedData[0].area;
        fetch(
          `https://restcountries.com/v3/alpha?codes=${fetchedCountry.border}`
        )
          .then((countryItem) => countryItem.json())
          .then((fetchedData) => {
            fetchedCountry.area = fetchedData[0].area;
            const sortBorderCountry = fetchedData.sort(
              compareLargestBorderArea
            );
            const borderFlag = sortBorderCountry[0].flags[1];
            fetchedCountry.border = borderFlag;
            processing ? setProcessing(false) : setProcessing(true);
          });
        setRequestedCountry(fetchedCountry);
      });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <TextInput
          placeholder="Search for a country"
          style={styles.input}
          onChangeText={(text) => setCountryValue(text)}
        />
        <View>
          <CountryComponent
            title={fetchedCountry.title}
            source={fetchedCountry.source}
            area={fetchedCountry.area}
            language={fetchedCountry.language}
            largestCountry={fetchedCountry.border}
          />
        </View>
      </ScrollView>
      <View>
        <Button
          title="Fetch Country Info"
          onPress={() => getFetchedInputCountry(countryValue)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    flex: 1,
  },

  containerTwo: {
    flexDirection: "row",
    borderColor: "#000",
    backgroundColor: "white",
  },
  input: {
    height: 45,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "lightblue",
  },

  view: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },

  firstImage: {
    width: 90,
    height: 90,
    flex: 1,
    marginLeft: 10,
  },

  secondImage: {
    width: 100,
    height: 40,
    marginLeft: 10,
    flex: 1,
  },
});

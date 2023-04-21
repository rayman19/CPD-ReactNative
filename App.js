import React, {useState} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
  TouchableHighlight,
  Modal
} from 'react-native';

export default function App() {

const apiurl = "https://api.kinopoisk.dev/movie"
const token = "Y9ES0TP-V5EMRJ4-QCW5HQ4-J513DRJ"

const [state, setState] = useState({
  name: "Введите название...",
  results: [],
  selected: {},
  selectedRating: {}
});

const search = () => {
  axios(apiurl + 
        "?search=" + state.name + 
        "&field=name" + 
        "&isStrict=false" +
        "&token=" + token).then(({ data }) => {
    let results = data.docs
    setState(prevState => {
      return {...prevState, results: results}
    })
  })
}

 
const openPopup = id => {
  axios(apiurl + 
        "?search=" + id +
        "&field=id" +
        "&token=" + token).then(({ data }) => {
    let result = data;
    setState(prevState => {
      return {...prevState, selected: result, selectedRating: result.rating}
    })
  })
}

  return (
    <View style={styles.container}>

      <StatusBar style={styles.statusBar}
        barStyle="light-content"
        backgroundColor="#223343"
      />

      <Text style={styles.title}>Кинопоиск</Text>

      <TextInput 
        style={styles.searchbox}
        onChangeText={text => setState(prevState => {
          return {...prevState, name: text}
        })}
        onSubmitEditing={search}
        value={state.name}
      />

      <ScrollView style={styles.results}>
        {state.results.map(result => (

          <TouchableHighlight 
            key={result.id} 
            onPress={() => openPopup(result.id)}
            style={styles.result}
          > 
            <View>

              <Image 
                source={{uri: result.poster.url}}
                style={{
                  overflow: 'hidden',
                  width: "100%",
                  height: 420
                }}
                resizeMode="cover"
              />

              <Text style={styles.heading}>{result.name}</Text>

            </View>
          </TouchableHighlight>
        ))}

      </ScrollView>

 
      <Modal
        animationType="fade"
        transparent={false}
        visible={(typeof state.selected.name != "undefined")}
      >
        
        <View style={styles.popup}>
          <Text style={styles.popname}>{state.selected.name}</Text>
          <Text style={{marginBottom: 10}}>Год: {state.selected.year}</Text>

          {state.selectedRating.tmdb == 0 || state.selectedRating.tmdb == null
            ? null
            : <Text style={{marginBottom: 10}}>Рейтинг TMDb: {state.selectedRating.tmdb}</Text>
          }

          {state.selectedRating.imdb == 0 || state.selectedRating.imdb == null
            ? null
            : <Text style={{marginBottom: 10}}>Рейтинг IMDb: {state.selectedRating.imdb}</Text>
          }

          {state.selectedRating.kp == 0 || state.selectedRating.kp == null
            ? null
            : <Text style={{marginBottom: 10}}>Рейтинг Кинопоиска: {state.selectedRating.kp}</Text>
          }

          {state.selected.slogan == null
            ? null
            : <Text style={{marginBottom: 10, textAlign: "justify"}}>{"Слоган: " + "\n"}{state.selected.slogan}</Text>
          }

          {state.selected.description == null
            ? null
            : <Text style={{marginBottom: 10, textAlign: "justify"}}>{"Описание: " + "\n"}{state.selected.description}</Text>
          }
        </View>

        <TouchableHighlight
          onPress={() => setState(prevState => {
            return {...prevState, selected: {} }
          })}
          style={styles.button}
        >
          <View>
            <Text style={styles.buttonText}>Назад</Text>
          </View>
        </TouchableHighlight>      
      
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#223343",
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20
  },
 
  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20
  },
  searchbox: {
    fontSize: 20,
    fontWeight: '300',
    padding: 20,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 30
  },
  result: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 3/2,
    borderColor: "white",
    marginBottom: 20,
    width: '75%',
    alignSelf: 'center'
  },
  results: {
    flex: 1,
    width: '100%',
    marginBottom: 30
  },
  heading: {
    flex: 1,
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    padding: 20,
    backgroundColor: '#445565'
  },
  popup: {
    padding: 20
  },
  popname: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10
  },
  button: {
    backgroundColor: '#445565',
    padding: 20,
    borderRadius: 20,
    alignSelf: 'center',
    width: '90%',
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    fontSize: 20, 
    fontWeight: '700', 
    color: '#FFF',
    textAlign: "center"
  }
});

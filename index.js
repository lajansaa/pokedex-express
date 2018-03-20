const express = require('express');
const handlebars = require('express-handlebars');
const hbsHelpers = require('handlebars-helpers');
const jsonfile = require('jsonfile');
const app = express();

// Set handlebars to be the default view engine
app.engine('handlebars', handlebars.create().engine);
app.set('view engine', 'handlebars');

let pokemonArr;
jsonfile.readFile('pokedex.json', (err, obj) => {
  pokemonArr = obj.pokemon;
});

let requestLocation = '/*';

let handleRequest = (request, response) => {
  let input = request.params[0].split("/");
  let search = input[0];
  let searchTerm = input[1];

  switch(search) {
    case "":
      const allPokemonNames = {"name": []};
      pokemonArr.forEach((pokemon) => {
        allPokemonNames.name.push(pokemon.name);
      });
      
      response.render('home', allPokemonNames);
      break;

    case "names":
      let pokemonFound = false;
      for (let i = 0; i < pokemonArr.length; i++) {
        if (pokemonArr[i].name == searchTerm) {
          pokemonFound = true;
          pokemonArr[i]["pokemonFound"] = pokemonFound;
          const searchPokemon = {"info": pokemonArr[i]};
          response.render('pokemon_info', searchPokemon);
          return;
        }
      }
      if (pokemonFound == false) {
        request.params["pokemonFound"] = pokemonFound;
        response.render('pokemon_info', request.params);
      }
      break;

    case "types":
      const pokemonTypes = {"type_name": searchTerm,
                       "pokemon_name": []
                      };
      pokemonArr.forEach((pokemon) => {
        if (pokemon.type.includes(searchTerm)) {
         pokemonTypes.pokemon_name.push(pokemon.name);
        }
      });
      response.render('pokemon_type', pokemonTypes);
      break;
  }
}

app.get(requestLocation, handleRequest).listen(3000);

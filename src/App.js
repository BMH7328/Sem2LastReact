import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Characters from "./Characters";
import CharactersAdd from "./CharactersAdd";
import CharactersEdit from "./CharactersEdit";
import Weapons from "./Weapons";
import WeaponsAdd from "./WeaponsAdd";
import WeaponsEdit from "./WeaponsEdit";
import FavoriteCart from "./FavoriteCart";
import FavoritesAdd from "./FavoritesAdd";
import Favorites from "./Favorites";
import Weapontypes from "./Weapontypes";
import WeapontypesAdd from "./WeapontypesAdd";
import Regions from "./Regions";
import RegionsAdd from "./RegionsAdd";
import Elements from "./Elements";
import ElementsAdd from "./ElementsAdd";
import View from "./View";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters_add" element={<CharactersAdd />} />
        <Route path="/characters/:id" element={<CharactersEdit />} />
        <Route path="/weapons" element={<Weapons />} />
        <Route path="/weapons_add" element={<WeaponsAdd />} />
        <Route path="/weapons/:id" element={<WeaponsEdit />} />
        <Route path="/favoritecart" element={<FavoriteCart />} />
        <Route path="/favoritesadd" element={<FavoritesAdd />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/weapontypes" element={<Weapontypes />} />
        <Route path="/weapontypes_add" element={<WeapontypesAdd />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/regions_add" element={<RegionsAdd />} />
        <Route path="/elements" element={<Elements />} />
        <Route path="/elements_add" element={<ElementsAdd />} />
        <Route path="/views/:id" element={<View />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';

import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/navbar.component";
import Main from "./components/main.component";
import AdminPanel from "./components/adminPanel.component";
import CreateMemorial from "./components/createMemorial.component";
import Search from "./components/search.component";
import Tribute from "./components/tribute.component";

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/" exact component={Main} />
      {localStorage.getItem('username')==="admin" && <Route path="/adminPanel" component={AdminPanel} />}
      <Route path="/createMemorial" component={CreateMemorial} />
      <Route path="/search" component={Search} />
      <Route path="/tribute/:id" component={Tribute} />
    </Router>
  );
}

export default App;

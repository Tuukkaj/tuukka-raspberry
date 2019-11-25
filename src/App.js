import React from "react";
import StopSelector from "./components/StopSelector.js";
import PageSwitcher from "./components/PageSwitcher.js";
import {HashRouter, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Route component={PageSwitcher} />

      <Switch>
        <Route path="/manage" component={StopSelector}/>
        <Route path="/" component={() => <h1>Times</h1>}/>
      </Switch>
    </HashRouter>
  );
}

export default App;

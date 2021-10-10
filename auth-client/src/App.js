import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PermissionPage from './components/PermisionPage/PermisionPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
         Urr
        </header>
      </div>
      <Switch>
        <Route path="/permission">
          <PermissionPage />
        </Route>
        <Route exact path="/">
          <p>home</p>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

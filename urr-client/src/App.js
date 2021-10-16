import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import AuthPage from './components/AuthPage/AuthPage';
import WelcomePage from './components/WelcomePage/WelcomePage';
import { v4 as uuid } from 'uuid';

function App() {
  const state = uuid();
  console.log('State UUID:', typeof state, state);
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          Urr-client
        </header>
      </div>
      <Switch>
        <Route path="/auth">
          <AuthPage state={state} />
        </Route>
        <Route exact path="/welcome">
          <WelcomePage state={state} />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    </Router>
  );
}

export default App;

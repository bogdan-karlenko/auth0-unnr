import React, { useEffect } from 'react';
import './AuthPage.css';

const AuthPage = ({ state }) => {
  const clientId = 'bbd10678-a71c-45d7-a6d3-6029b1c48b1e';
  const authServerURI = 'http://localhost:3000/authorize';
  const authUri = `${authServerURI}?client_id=${clientId}&redirect_uri=${'http://localhost:3002/welcome'}&scope=permission:login&state=${state}`;
  useEffect(() => {
    window.location.replace(authUri)
  }, [authUri]);
  return (
  <div className="AuthPage" data-testid="AuthPage">
    <p>You are being redirected to authentication page.</p>
    <p>If nothing happends please <a href={authUri}>click here</a></p>
  </div>
  );
};

AuthPage.propTypes = {};

AuthPage.defaultProps = {};

export default AuthPage;

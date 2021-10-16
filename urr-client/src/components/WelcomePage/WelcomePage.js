import React, { useCallback, useEffect, useState } from 'react';
import styles from './WelcomePage.module.css';
import { useHistory, useLocation } from 'react-router';
import axios from 'axios';

const clientId = 'bbd10678-a71c-45d7-a6d3-6029b1c48b1e';
const clientSecret = '0yAwgWZzlW';

const WelcomePage = ({ state }) => {
  const history = useHistory();
  const search = useLocation().search;
  const outerState = new URLSearchParams(search).get('state');
  const code = new URLSearchParams(search).get('code');
  if (!outerState || !code || outerState !== state) {
    history.push('/auth');
  }

  const [token, setToken] = useState('');
  const [userData, setUserData] = useState('');

  const tokenUri = 'http://localhost:3000/token';
  const userInfoUri = 'http://localhost:3004/info';

  const getToken = useCallback(async () => {
      const response = await axios({
        method: "POST",
        url: tokenUri,
        auth: {
          username: clientId,
          password: clientSecret,
        },
        data: {
          code,
        },
        validateStatus: null,
      });
      console.log('tokenResponse:', response.data);
      setToken(response.data.access_token);
    }, [code]);

  const getUserData = async (accessToken) => {
    const response = await axios({
      method: "GET",
      url: userInfoUri,
      headers: {
        authorization: "bearer " + accessToken,
      },
    });
    console.log('userDataResponse:', response);
    setUserData(response.data);
  };

  useEffect(() => {
    getToken();
  }, [getToken]);

  useEffect(() => {
    getUserData(token);
  }, [token])

  return (
    <div className={styles.WelcomePage} data-testid="WelcomePage">
      WelcomePage Component
      {userData}
    </div>
  );
};

WelcomePage.propTypes = {};

WelcomePage.defaultProps = {};

export default WelcomePage;

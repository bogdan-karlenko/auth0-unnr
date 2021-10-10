import React from 'react';
import PropTypes from 'prop-types';
import './PermisionPage.css';
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';

const PermisionPage = () => {
  const history = useHistory();
  const search = useLocation().search;
  const clientId = new URLSearchParams(search).get('c');
  const requestId = new URLSearchParams(search).get('r');
  if(!clientId || !requestId) {
    history.push('/');
  }
  return (
  <div className="PermisionPage" data-testid="PermisionPage">
    <form action="http://localhost:3000/approve" method="post">
      <label for="userName">Username: </label>
      <input type="text" name="userName" /><br />
      <label for="password">Password: </label>
      <input type="text" name="password" /><br />
      <input type="hidden" name="requestId" value={requestId} />
      <input type="submit" value="Approve" />
    </form>
  </div>
  );
};

PermisionPage.propTypes = {};

PermisionPage.defaultProps = {};

export default PermisionPage;

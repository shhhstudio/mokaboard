import React from 'react';
import { Router } from '@reach/router';
import Layout from '@/components/Layout';
import PrivateRoute from '@/components/PrivateRoute';
import Login from '@/pages/login';
import Profile from '@/pages/profile';

const App: React.FC = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/profile" component={Profile} />
      <Login path="/app/login" />
    </Router>
  </Layout>
);

export default App;

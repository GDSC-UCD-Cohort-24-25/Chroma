import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import BudgetPage from '../pages/BudgetPage';
import SignUp from '../pages/SignupPage';
import SignIn from '../pages/SigninPage';
import Setup from '../pages/SetupPage';
import Layout from './layout';
import PrivateRoute from './PrivateRoute';
import ProfilePage from '../Profile';

function App() {
  return (
    <Routes>
      
      <Route path="/signUp" element={<Layout><SignUp /></Layout>} />
      <Route path="/Profile" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/signIn" element={<Layout><SignIn /></Layout>} />
      <Route path="/" element={<Layout><LandingPage /></Layout>} />

      {/* Protected */}
      <Route path="/setup" element={<PrivateRoute><Layout><Setup /></Layout></PrivateRoute>} />
      <Route path="/budget" element={<PrivateRoute><Layout><BudgetPage /></Layout></PrivateRoute>} />
    </Routes>
  );
}

export default App;

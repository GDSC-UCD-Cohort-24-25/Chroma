import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import BudgetPage from './BudgetPage';
import SignUp from './SignupPage';
import SignIn from './SigninPage';
import Setup from './SetupPage';
import Layout from './layout';
import ProfilePage from './Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/setup" element={ <Layout><Setup /></Layout>}/>
        <Route path="/signUp" element={<Layout><SignUp /></Layout>} />
        <Route path="/signIn" element={<Layout><SignIn /></Layout>} />
        <Route path="/budget" element={<Layout><BudgetPage /></Layout>} />
        <Route path="/Profile" element={<Layout><ProfilePage /></Layout>} />
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
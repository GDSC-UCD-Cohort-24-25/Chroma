import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import BudgetPage from './BudgetPage';
import SignUp from './SignupPage';
import SignIn from './SigninPage';
import Setup from './SetupPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
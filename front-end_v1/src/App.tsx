import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import BudgetPage from './BudgetPage';
import SignUp from './SignupPage';
import SignIn from './SigninPage';
import Setup from './SetupPage';

// import SetupStepTwo from './SetupPage2';
// import SetupStepThree from './SetupPage3';
import Layout from './layout';
import { AuthProvider } from './AuthContext';


function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="/setuptwo" element ={<SetupStepTwo />}/>
        <Route path="/setupthree" element ={<SetupStepThree />}/>


        <Route path="/setup" element={ <Layout><Setup /></Layout>}/>
        <Route path="/signUp" element={<Layout><SignUp /></Layout>} />
        <Route path="/signIn" element={<Layout><SignIn /></Layout>} />
        <Route path="/budget" element={<Layout><BudgetPage /></Layout>} />
        <Route path="/" element={<Layout><LandingPage /></Layout>} />

      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;

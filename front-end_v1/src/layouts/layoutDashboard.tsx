import Header from '../header';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../AuthContext'; // Adjust the import path as necessary

function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth(); // Use the AuthContext to get authentication status

  if (!isAuthenticated) {
    return <Navigate to="/signIn" />;  // If not authenticated, redirect to login
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">Welcome back, user! {children}</main> {/* Display a welcome message */}
    </div>
  );
}

export default Layout;

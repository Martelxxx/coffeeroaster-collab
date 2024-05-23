// Importing necessary libraries and components
import React from  'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import SubscriptionForm from './components/SubscriptionForm';  // Adjust the path as necessary
import Home from './components/Home';                          // Home component (if separate)
import About from './components/About';                        // About component (if you have one)
import './App.css';  // Global styles

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Navigation bar for easy navigation */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/subscribe">Subscribe</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>

        {/* Routing setup */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/subscribe">
            <SubscriptionForm />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};


// Export the App component
export default App;

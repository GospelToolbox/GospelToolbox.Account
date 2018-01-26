import React from 'react'  
import {  
  HashRouter as Router,
  Route,
  NavLink
} from 'react-router-dom'
import ProfileView from './ProfileView'
import OrganizationsView from './OrganizationsView'

const App = (props) => (  
  
  <Router>
    <div className="container">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <NavLink exact className="nav-link" to="/">Profile</NavLink>
        </li>
        <li className="nav-item">
        <NavLink className="nav-link" to="/organizations" >Organizations</NavLink>
        </li>
      </ul>

      <Route
        exact
        path='/'
        component={ProfileView}
      />
      <Route
        path='/organizations'
        component={OrganizationsView}
      />
    </div>
  </Router>
)

// You will need this on the bottom of each component file
// to make it available through ES6 'import' statements.

export default App  
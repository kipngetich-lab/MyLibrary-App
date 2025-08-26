import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom' 




import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ component: Component, roles = [], ...rest }) { const { user } = useContext(AuthContext)

return ( <Route {...rest} render={props => { if (!user) { return <Redirect to={{ pathname: '/login', state: { from: props.location } }} /> } if (roles.length && !roles.includes(user.role)) { return <div className="p-6">You do not have permission to view this page.</div> } return <Component {...props} /> }} /> ) }
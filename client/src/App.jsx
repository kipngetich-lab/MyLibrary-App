import React, { useContext, useEffect } from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BookList from './pages/Books/BookList'
import BookForm from './pages/Books/BookForm'
import BookDetails from './pages/Books/BookDetails'
import UserManagement from './pages/Users/UserManagement'
import LendReturn from './pages/Lending/LendReturn'
import Reservations from './pages/Reservations/Reservations'
import SearchPage from './pages/Search/SearchPage'
import Reports from './pages/Reports/Reports'
import Opac from './pages/OPAC/Opac'
import Notifications from './pages/Notifications/Notifications'
import Acquisitions from './pages/Acquisitions/Acquisitions'
import { AuthContext } from './context/AuthContext'

export default function App() {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    // sync dark mode from localStorage
    const dark = localStorage.getItem('dark') === 'true';
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <Switch>
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>

          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/books/new" component={BookForm} roles={['admin','librarian']} />
          <ProtectedRoute path="/books/edit/:id" component={BookForm} roles={['admin','librarian']} />
          <ProtectedRoute path="/books/:id" component={BookDetails} />
          <ProtectedRoute path="/books" component={BookList} />

          <ProtectedRoute path="/users" component={UserManagement} roles={['admin','librarian']} />
          <ProtectedRoute path="/lend" component={LendReturn} roles={['admin','librarian']} />
          <ProtectedRoute path="/reservations" component={Reservations} />
          <ProtectedRoute path="/search" component={SearchPage} />
          <ProtectedRoute path="/reports" component={Reports} roles={['admin','librarian']} />
          <Route path="/opac" component={Opac} />
          <ProtectedRoute path="/notifications" component={Notifications} roles={['admin','librarian']} />
          <ProtectedRoute path="/acquisitions" component={Acquisitions} roles={['admin','librarian']} />

          <Route path="*">
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold">404 - Not Found</h2>
              <p className="mt-4"><Link to="/">Go Home</Link></p>
            </div>
          </Route>
        </Switch>
      </main>
      <Footer />
    </div>
  )
}
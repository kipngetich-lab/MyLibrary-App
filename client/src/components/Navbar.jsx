import React, { useContext, useState } from 'react'
import { Link, NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FaBook, FaSearch, FaBell, FaBars, FaTimes } from 'react-icons/fa'
import DarkToggle from './DarkToggle'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const history = useHistory()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    history.push('/login')
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center space-x-3">
          {/* Hamburger menu only on mobile */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <Link to="/dashboard" className="flex items-center space-x-2">
            <FaBook className="text-indigo-600 dark:text-indigo-300" />
            <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">MyLibrary</span>
          </Link>
        </div>

        {/* Horizontal nav only on md+ */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/books"
            className="text-gray-700 dark:text-gray-200 hover:underline"
            activeClassName="font-bold"
          >
            Books
          </NavLink>
          <NavLink
            to="/search"
            className="text-gray-700 dark:text-gray-200 hover:underline"
            activeClassName="font-bold"
          >
            Search
          </NavLink>
          <NavLink
            to="/opac"
            className="text-gray-700 dark:text-gray-200 hover:underline"
            activeClassName="font-bold"
          >
            OPAC
          </NavLink>
          <NavLink
            to="/reports"
            className="text-gray-700 dark:text-gray-200 hover:underline"
            activeClassName="font-bold"
          >
            Reports
          </NavLink>
          <NavLink
            to="/notifications"
            className="text-gray-700 dark:text-gray-200 hover:underline"
            activeClassName="font-bold"
          >
            Notifications
          </NavLink>
        </nav>

        <div className="flex items-center space-x-4">
          <DarkToggle />
          <Link
            to="/search"
            className="hidden md:inline-flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Search"
          >
            <FaSearch />
          </Link>

          {user ? (
            <>
              <Link
                to="/notifications"
                className="hidden md:inline-flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Notifications"
              >
                <FaBell />
              </Link>
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-gray-800 dark:text-gray-100">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:underline focus:outline-none"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto flex flex-col space-y-2 py-3 px-4">
            <Link
              to="/books"
              className="block text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setOpen(false)}
            >
              Books
            </Link>
            <Link
              to="/search"
              className="block text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setOpen(false)}
            >
              Search
            </Link>
            <Link
              to="/opac"
              className="block text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setOpen(false)}
            >
              OPAC
            </Link>
            <Link
              to="/reports"
              className="block text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setOpen(false)}
            >
              Reports
            </Link>
            <Link
              to="/notifications"
              className="block text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setOpen(false)}
            >
              Notifications
            </Link>
            {user ? (
              <button
                onClick={() => {
                  handleLogout()
                  setOpen(false)
                }}
                className="text-left text-red-600 focus:outline-none"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block text-indigo-600 hover:underline"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
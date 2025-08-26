import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Chat from '../components/Chat'

export default function Dashboard() {
  const [recentBorrows, setRecentBorrows] = useState([])
  const [recentReturns, setRecentReturns] = useState([])
  const [recentReservations, setRecentReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        setLoading(true)
        setError(null)

        // Fetch active loans (borrows)
        const borrowsRes = await fetch('/api/lend', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        })
        if (!borrowsRes.ok) throw new Error('Failed to fetch borrows')
        const borrowsData = await borrowsRes.json()
        setRecentBorrows(borrowsData.filter(l => l.status === 'active').slice(0, 5))

        // Fetch all loans and filter returned ones
        const loansRes = await fetch('/api/lend', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        })
        if (!loansRes.ok) throw new Error('Failed to fetch loans')
        const loansData = await loansRes.json()
        setRecentReturns(loansData.filter(l => l.status === 'returned').slice(0, 5))

        // Fetch reservations
        const resvRes = await fetch('/api/reservations', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        })
        if (!resvRes.ok) throw new Error('Failed to fetch reservations')
        const resvData = await resvRes.json()
        setRecentReservations(resvData.slice(0, 5))
      } catch (err) {
        setError(err.message || 'Error loading recent activity')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Welcome to the Library Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Use the menu to manage books, users, lending, and acquisitions. Use OPAC to allow public search.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/books" className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded">
              Manage Books
            </Link>
            <Link to="/users" className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
              User Management
            </Link>
            <Link to="/lend" className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              Lend / Return
            </Link>
            <Link to="/acquisitions" className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded">
              Acquisitions
            </Link>
          </div>
        </div>

        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Recent Activity</h3>

          {loading && <p className="text-gray-600 dark:text-gray-400">Loading recent activity...</p>}

          {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

          {!loading && !error && (
            <>
              {/* Recent Borrows */}
              <section className="mb-4">
                <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Recent Borrows</h4>
                {recentBorrows.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No recent borrows.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentBorrows.map((loan) => (
                      <li key={loan._id} className="py-2 flex justify-between">
                        <div>
                          <span className="font-medium">{loan.member?.name || 'Unknown Member'}</span> borrowed{' '}
                          <span className="italic">"{loan.book?.title || 'Unknown Book'}"</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(loan.issueDate).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Recent Returns */}
              <section className="mb-4">
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Recent Returns</h4>
                {recentReturns.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No recent returns.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentReturns.map((loan) => (
                      <li key={loan._id} className="py-2 flex justify-between">
                        <div>
                          <span className="font-medium">{loan.member?.name || 'Unknown Member'}</span> returned{' '}
                          <span className="italic">"{loan.book?.title || 'Unknown Book'}"</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Recent Reservations */}
              <section>
                <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Recent Reservations</h4>
                {recentReservations.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No recent reservations.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentReservations.map((resv) => (
                      <li key={resv._id} className="py-2 flex justify-between">
                        <div>
                          <span className="font-medium">{resv.user?.name || 'Unknown User'}</span> reserved{' '}
                          <span className="italic">"{resv.book?.title || 'Unknown Book'}"</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(resv.createdAt).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      <div>
        <Chat />
      </div>
    </div>
  )
}
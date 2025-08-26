import React from 'react'
import RealTimeSearch from '../../components/RealTimeSearch'
import { useHistory } from 'react-router-dom'

export default function SearchPage() {
  const history = useHistory()
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Search Catalog</h2>
      <RealTimeSearch onSelect={(book) => history.push(`/books/${book._id}`)} />
    </div>
  )
}
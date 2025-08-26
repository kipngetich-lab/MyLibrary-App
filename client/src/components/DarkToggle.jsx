import React, { useState, useEffect } from 'react'

export default function DarkToggle() { 
	const [dark, setDark] = useState(() => localStorage.getItem('dark') === 'true')

useEffect(() => { 
	if (dark) 
		document.documentElement.classList.add('dark')
	else 
		document.documentElement.classList.remove('dark') 
		localStorage.setItem('dark', dark) }, [dark])

return ( 
	<button onClick={() => setDark(d => !d)} className="p-2 rounded bg-gray-100 dark:bg-gray-700" aria-label="Toggle dark mode" > {dark ? '🌙' : '☀️'} </button> 
	) 
}
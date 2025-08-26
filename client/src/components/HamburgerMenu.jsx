import React from 'react'

export default function HamburgerMenu(
	{ open }) { 
	return ( 
		<div className="w-8 h-8 flex items-center justify-center"> 
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-800 dark:text-gray-100"> 
				<path d={open ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				</path> 
			</svg> 
		</div> ) 
	}
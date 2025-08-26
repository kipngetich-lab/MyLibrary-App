import React from 'react'

export default function Footer() { return ( <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4"> <div className="container text-center text-sm text-gray-600 dark:text-gray-300"> © {new Date().getFullYear()} MyLibrary — All rights reserved </div> </footer> ) }
import React from 'react'

export default function header() {


const routes = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/aboutUs' },
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' },
]

  return (
    <header className="w-full h-16 border-b flex justify-center items-center">
 {
    routes.map((route) => (
      <a key={route.name} href={route.path} className="mx-4">
        {route.name}
      </a>
    ))
 }
        </header>
  )
}

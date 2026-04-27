"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import logo from '../assets/image.png'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg">
            <img src={logo} alt="Courtify Logo" className="h-10 w-10"/>
          </div>
          <span className="text-xl font-bold text-green-600">Courtify</span>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Button 
            variant="ghost" 
            className="text-gray-900 hover:bg-green-50"  
            onClick={() => navigate('/auth/login')}
          >
            Login
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"  
            onClick={() => navigate('/auth/signup')}
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-green-50 rounded-lg transition-colors text-gray-900"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-green-600" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="flex flex-col gap-2 px-6 py-4">
            <Button 
              variant="ghost" 
              className="w-full text-gray-900 hover:bg-green-50" 
              onClick={() => navigate('/auth/login')}
            >
              Login
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"  
              onClick={() => navigate('/auth/signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { Building2, Plus, X, Check } from 'lucide-react'
import { getDepartments, addDepartment } from '@/lib/mockData'

interface DepartmentSelectProps {
  value: string[]
  onChange: (value: string[]) => void
}

export default function DepartmentSelect({ value, onChange }: DepartmentSelectProps) {
  const [departments, setDepartments] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredDepartments, setFilteredDepartments] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadDepartments()
  }, [])

  useEffect(() => {
    // Filter departments based on input, excluding already selected ones
    const available = departments.filter(d => !value.includes(d))
    if (inputValue.trim()) {
      const filtered = available.filter(d =>
        d.toLowerCase().includes(inputValue.toLowerCase())
      )
      setFilteredDepartments(filtered)
    } else {
      setFilteredDepartments(available)
    }
  }, [inputValue, departments, value])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadDepartments = () => {
    const deps = getDepartments()
    setDepartments(deps)
  }

  const handleSelect = (dept: string) => {
    if (!value.includes(dept)) {
      onChange([...value, dept])
    }
    setInputValue('')
  }

  const handleRemove = (dept: string) => {
    onChange(value.filter(d => d !== dept))
  }

  const handleAddNew = () => {
    if (!inputValue.trim()) return

    const newDept = inputValue.trim()
    addDepartment(newDept)
    if (!value.includes(newDept)) {
      onChange([...value, newDept])
    }
    setInputValue('')
    loadDepartments()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const exactMatch = filteredDepartments.find(
        d => d.toLowerCase() === inputValue.toLowerCase()
      )
      if (exactMatch) {
        handleSelect(exactMatch)
      } else if (inputValue.trim()) {
        handleAddNew()
      }
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemove(value[value.length - 1])
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Selected tags and input */}
      <div
        className="flex flex-wrap gap-2 min-h-[48px] p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((dept) => (
          <span
            key={dept}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
          >
            <Building2 className="w-3 h-3" />
            {dept}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove(dept)
              }}
              className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "部署を選択または入力..." : ""}
          className="flex-1 min-w-[120px] px-2 py-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="animate-scaleIn absolute z-50 w-full mt-2 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto">
          {/* Add new option if input doesn't match existing */}
          {inputValue.trim() && !departments.includes(inputValue.trim()) && (
            <button
              type="button"
              onClick={handleAddNew}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Plus className="w-4 h-4" />
              「{inputValue.trim()}」を追加
            </button>
          )}

          {/* Department list */}
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => handleSelect(dept)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="flex-1 text-left">{dept}</span>
              </button>
            ))
          ) : inputValue.trim() ? null : (
            <div className="px-4 py-2 text-sm text-slate-500">
              全ての部署が選択されています
            </div>
          )}
        </div>
      )}

      {/* Quick select tags (show only when nothing selected and dropdown closed) */}
      {value.length === 0 && !isOpen && (
        <div className="flex flex-wrap gap-2 mt-3">
          {departments.slice(0, 6).map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => handleSelect(dept)}
              className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {dept}
            </button>
          ))}
          {departments.length > 6 && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(true)
                inputRef.current?.focus()
              }}
              className="px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              +{departments.length - 6} more
            </button>
          )}
        </div>
      )}
    </div>
  )
}


import React from "react"
import { Button } from "./components/ui/button"
import { Checkbox } from "./components/ui/checkbox"
import { Label } from "./components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Input } from "./components/ui/input"
import {  Search, X } from "lucide-react"
import { useEffect, useState } from "react"

export function FilterSidebar({ filters, setFilters, categories }) {
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']
  const [searchInput, setSearchInput] = useState(filters.searchQuery || '')
  const [hasFilters, setHasFilters] = useState(false)

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({...filters, searchQuery: searchInput.toLowerCase().trim()})
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  // filter
  useEffect(() => {
    setHasFilters(
      !!filters.searchQuery ||
      filters.category !== 'all' ||
      filters.jobType !== 'all' ||
      filters.remoteOnly
    )
  }, [filters])

  const handleReset = () => {
    setSearchInput('')
    setFilters({
      searchQuery: '',
      category: "all",
      jobType: "all",
      remoteOnly: false
    })
  }

  return (
    <div className="w-72 p-4 bg-white rounded-lg shadow-md border border-gray-200 sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-sky-800">Search & Filter</h3>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReset}
            className="text-sky-600 hover:text-sky-800"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, company..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <X 
              className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => setSearchInput('')}
            />
          )}
        </div>

        {/* Category Filter */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Job Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({...filters, category: value})}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Type  */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Job Type</Label>
          <Select
            value={filters.jobType}
            onValueChange={(value) => setFilters({...filters, jobType: value})}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Remote Only  */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remote-only" 
            checked={filters.remoteOnly}
            onCheckedChange={(checked) => 
              setFilters({...filters, remoteOnly: Boolean(checked)})
            }
          />
          <Label htmlFor="remote-only" className="cursor-pointer">Remote Only</Label>
        </div>
      </div>
    </div>
  );
}
export default FilterSidebar;
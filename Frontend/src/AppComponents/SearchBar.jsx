import { Input } from '@/components/ui/input'
import { setSearchValue } from '@/redux/authSlice'
import { Search } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'

const SearchBar = () => {
  const dispatch = useDispatch();
  return (
   <div className="px-4 bg-purple-100 flex items-center rounded-lg mb-4">
    <Search className="inline-block mr-2" />
    <input
        type="text"
        placeholder="Search..."
        className="p-2 rounded-lg border-none bg-transparent outline-none focus:outline-none focus:ring-0 placeholder:text-slate-600"
        onChange={(e)=>{dispatch(setSearchValue(e.target.value))}}
    />
    </div>
  )
}

export default SearchBar

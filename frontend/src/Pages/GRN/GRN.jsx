import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateGRN from '../../components/GRN_Pages/CreateGRN'
import ListGRN from '../../components/GRN_Pages/ListGRN'
import SearchGRN from '../../components/GRN_Pages/SearchGRN'

const GRN = () => {
    return (
        <div>
            <Routes>
                <Route path='create-grn' element={<CreateGRN />} />
                <Route path='list-grn' element={<ListGRN />} />
                <Route path='search-grn' element={<SearchGRN />} />
            </Routes>
        </div>
    )
}

export default GRN
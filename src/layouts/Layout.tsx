import React from 'react'
import { Outlet } from 'react-router-dom'
import { Footer, Header } from '../components/Header'


const Layout = () => {
    return (
        <>
            <div >
                <Header />
                <div className="w-[81.89vw] mx-auto pb-[2.907vh]">
                <Outlet />
                <Footer />
                </div>
            </div>
        </>
    )
}

export default Layout

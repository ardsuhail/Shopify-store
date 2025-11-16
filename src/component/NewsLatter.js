"use client"
import React, { useState, useEffect } from 'react'
import { LoaderCircle } from 'lucide-react'

const NewsLatter = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "email": email
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("/api/subscriber", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.success){
                    setLoading(false);
                    alert("Subscribed successfully!");
                    setEmail('');
                } else {
                    setLoading(false);
                    alert(`Subscription failed: ${result.message}`);
                }

                console.log(result)
            })
            .catch((error) => {
                setLoading(false);
                alert("An error occurred. Please try again later..");
                console.error(error)
            });

    }
    return (
        <>
 <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                            <p className="text-sm font-semibold text-gray-800 mb-2">Newsletter</p>
                            <p className="text-xs text-gray-600 mb-3">Get updates on new arrivals and special offers</p>
                            <form onSubmit={handleSubmit}  method='POST' className="flex gap-2">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email" 
                                    className="flex-1 px-3 py-2 w-40 sm:w-full text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                                <button  type='submit' className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                                   {loading?<div className='flex gap-3 justify-center items-center'  >
                                    <LoaderCircle className="w-5 h-5 animate-spin mx-auto"/> <p className='animate-pulse ' >Please wait...</p>
                                   </div>:"Join"} 
                                </button>
                            </form>
                        </div>
        </>
    )
}

export default NewsLatter

"use client"
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const variantId = searchParams.get('id')
  const quantity = searchParams.get('quantity') || 1

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  console.log('Submitting checkout for:', variantId, 'quantity',quantity) // 🧩 DEBUG LINE
  const res = await fetch('/api/createCheckout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variantId, quantity })
  })
  const data = await res.json()
console.log('Full Shopify Response:', JSON.stringify(data, null, 2))
// 🧩 DEBUG LINE
  if (data.url) window.location.href = data.url
}


  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-5">Checkout</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Full Name" onChange={handleChange} className="border p-2" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2" required />
        <input name="address" placeholder="Address" onChange={handleChange} className="border p-2" required />
        <input name="city" placeholder="City" onChange={handleChange} className="border p-2" required />
        <input name="zip" placeholder="Zip Code" onChange={handleChange} className="border p-2" required />
        <button type='submit' className="bg-purple-600 cursor-pointer text-white py-2 rounded-lg">Proceed to Payment</button>
      </form>
    </div>
  )
}

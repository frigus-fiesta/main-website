/* eslint-disable no-unused-vars */
"use client"

import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Script from 'next/script';
import axios from 'axios';

// import Header from '@/components/Header';
// import Footer from '@/components/Footer';

const MinimalBackground = () => (
  <div className="pointer-events-none absolute left-0 top-0 -z-10 size-full">
    <svg
      className="absolute size-full opacity-30"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1920 1080"
    >
      <circle cx="300" cy="200" r="150" fill="url(#gradient1)" opacity="0.1" />
      <circle cx="1400" cy="300" r="200" fill="url(#gradient2)" opacity="0.1" />
      <circle cx="800" cy="700" r="180" fill="url(#gradient3)" opacity="0.1" />
      <defs>
        <radialGradient id="gradient1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <radialGradient id="gradient2">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <radialGradient id="gradient3">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

const GoldAnimatedBackground = () => (
  <div className="pointer-events-none absolute left-0 top-0 -z-10 size-full">
    <svg
      className="absolute size-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1920 1080"
    >
      <path
        d="M 0 200 C 300 400, 600 100, 900 300 S 1200 500, 1500 200"
        stroke="#FFD700"
        strokeWidth="2.5"
        fill="none"
        opacity="0.13"
      />
      <path
        d="M 200 800 C 500 600, 800 900, 1100 700 S 1400 500, 1700 800"
        stroke="#FFB300"
        strokeWidth="1.5"
        fill="none"
        opacity="0.13"
      />
      <path
        d="M 400 100 C 700 300, 1000 50, 1300 250 S 1600 400, 1900 150"
        stroke="#FFECB3"
        strokeWidth="1.5"
        fill="none"
        opacity="0.13"
      />
      <path
        d="M 100 900 C 400 700, 700 950, 1000 750 S 1300 550, 1600 900"
        stroke="#FFC107"
        strokeWidth="1.5"
        fill="none"
        opacity="0.13"
      />
    </svg>
  </div>
);

type Currency = 'USD' | 'INR' | 'RAZORPAY';

export default function PaymentPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [eventFee, setEventFee] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [phonePeLoading, setPhonePeLoading] = useState(false);

  useEffect(() => { 
    setIsVisible(true); 
  }, []);

  useEffect(() => {
    const isValid = formData.name.length > 0 && formData.email.length > 0 && formData.phone.length > 0;
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setEventFee(value);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && isFormValid) {
      setCurrentStep(2);
    } else if (currentStep === 2 && parseFloat(eventFee) > 0) {
      setCurrentStep(3);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCurrencyToggle = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

  const formatPrice = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return selectedCurrency === 'USD' ? '$0' : '₹0';
    
    return selectedCurrency === 'USD' 
      ? `$${numAmount.toFixed(2)}` 
      : `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  // handle Razorpay payment gateway
  const handleRazorpay = async () => {
    const amount = parseFloat(eventFee);
    if (isNaN(amount) || amount <= 0) return;

    setIsProcessing(true);

    try {
      // Create order on backend
      const res = await fetch('/api/razorpay-create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount * 100 }), // amount in paise
      });

      const data = await res.json();
      if (!data.id) throw new Error('Failed to create Razorpay order.');

      // const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      // if (!razorpayKey) throw new Error('Razorpay key not configured.');

      const PaymentData = {
        key: process.env.RAZORPAY_LIVE_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Frigus Fiesta',
        description: `Event Payment - ${formData.name}`,
        order_id: data.id,
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyRes = await fetch('/api/razorpay-verify-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.isOk) {
              alert('Payment successful! Thank you. You will receive a confirmation email shortly.');
              setFormData({ name: '', email: '', phone: '' });
              setEventFee('');
              setCurrentStep(1);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            alert('Payment verification error. Please try again.');
          }
          setIsProcessing(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#FFD700',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            alert('Payment cancelled.');
          },
        },
      };

      // Check if Razorpay is loaded
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const payment = new (window as any).Razorpay(PaymentData);
        payment.open();
      } else {
        alert('Razorpay SDK not loaded. Please refresh and try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('There was an error processing your payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePhonePePayment = async (e:any) => {
    e.preventDefault();
    setIsProcessing(true);
    const mobile = formData.phone;
    const amount = parseFloat(eventFee);
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    // Prepare the data
    const data = {
      name: formData.name,
      amount: amount,
      mobile,
      transactionId: "T" + Date.now(),
      baseUrl,
    };

    try {
      // Initiate payment
      const response = await axios.post(`${baseUrl}/api/phonepe-initiate`, data);

      // Redirect user to PhonePe payment page
      if (
        response.data &&
        response.data.data.instrumentResponse.redirectInfo.url
      ) {
        window.location.href =
          response.data.data.instrumentResponse.redirectInfo.url;
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // PhonePe payment handler
  const old_handlePhonePePayment = async () => {
    setPhonePeLoading(true);
    try {
      const orderId = `ORDER_${Date.now()}`;
      const callbackUrl = `${window.location.origin}/payment-callback`;
      const response = await fetch('/api/phonepe-initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(eventFee) * 100, // in paisa
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          orderId,
          callbackUrl,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to initiate PhonePe payment.');
        setPhonePeLoading(false);
      }
    } catch (error) {
      console.error('PhonePe payment error:', error);
      alert('PhonePe payment failed. Please try again.');
      setPhonePeLoading(false);
    }
  };

  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <>
      <Script 
        type='text/javascript'
        src='https://checkout.razorpay.com/v1/checkout.js'
        strategy="lazyOnload"
      />
      <div className="relative min-h-screen">
        <MinimalBackground />
        <GoldAnimatedBackground/>
        {/* <Header /> */}
        <div className="relative z-10 px-6 py-12 pt-40">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className={`mb-4 text-4xl font-bold text-black transition-all duration-1000 ease-out md:text-5xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>Book Your <span className='text-yellow-500'>Event</span></h1>
            <p className={`text-lg text-amber-700 transition-all delay-300 duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>Simple, secure, and straightforward</p>
          </div>
        </div>
        <div className="relative z-10 px-6 pb-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex justify-center">
              <div className="flex rounded-2xl bg-white/80 p-2 shadow-lg backdrop-blur-sm">
                <button
                onClick={() => handleCurrencyToggle('USD')}
                className={`rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 ${selectedCurrency === 'USD' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-700 hover:bg-amber-50'}`}
              >
                  🇺🇸 USD (PayPal)
                </button>
                <button
                onClick={() => handleCurrencyToggle('INR')}
                className={`rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 ${selectedCurrency === 'INR' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-700 hover:bg-amber-50'}`}
                >
                  🇮🇳 INR (PhonePe)
                </button>
                <button
                onClick={() => handleCurrencyToggle('RAZORPAY' as Currency)}
                className={`rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 ${selectedCurrency === 'RAZORPAY' ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-50'}`}
                >
                  🪒 INR (Razorpay)
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 px-6 pb-12">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex size-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${currentStep >= step ? 'bg-amber-500 text-white shadow-lg' : 'border-2 border-amber-200 bg-white text-amber-500'}`}>{step}</div>
                  {step < 3 && (
                  <div className={`h-0.5 w-16 transition-all duration-300 ${currentStep > step ? 'bg-amber-500' : 'bg-amber-200'}`} />
                )}
                </div>
            ))}
            </div>
            <div className="mt-4 flex justify-center space-x-16 text-sm text-amber-700">
              <span className={currentStep >= 1 ? 'font-medium' : ''}>Details</span>
              <span className={currentStep >= 2 ? 'font-medium' : ''}>Event Fee</span>
              <span className={currentStep >= 3 ? 'font-medium' : ''}>Payment</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 px-6 pb-20">
          <div className="mx-auto max-w-2xl">
            {currentStep === 1 && (
            <div className="animate-fade-in rounded-3xl bg-white/80 p-12 shadow-xl backdrop-blur-sm">
              <h2 className="mb-8 text-center text-2xl font-light text-amber-900">Your Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-800">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-0 px-6 py-4 text-amber-900 ring-1 ring-amber-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Enter your full name"
                    required
                    />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-800">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-0 px-6 py-4 text-amber-900 ring-1 ring-amber-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Enter your email address"
                    required
                    />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-800">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-0 px-6 py-4 text-amber-900 ring-1 ring-amber-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Enter your phone number"
                    required
                    />
                </div>
              </div>
              <div className="mt-10 text-center">
                <button
                  onClick={handleNextStep}
                  disabled={!isFormValid}
                  className={`rounded-2xl px-8 py-4 font-medium transition-all duration-300 ${isFormValid ? 'bg-yellow-500 text-white hover:bg-yellow-400 hover:shadow-lg' : 'cursor-not-allowed bg-yellow-200 text-amber-500'}`}
                  >
                  Continue to Event Fee
                </button>
              </div>
            </div>
          )}
            {currentStep === 2 && (
            <div className="animate-fade-in rounded-3xl bg-white/80 p-12 shadow-xl backdrop-blur-sm">
              <h2 className="mb-8 text-center text-2xl font-light text-amber-900">Enter Event Fee</h2>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-800">
                    Event Fee ({selectedCurrency === 'USD' ? 'USD' : 'INR'})
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-medium text-amber-700">
                      {selectedCurrency === 'USD' ? '$' : '₹'}
                    </span>
                    <input
                      type="text"
                      value={eventFee}
                      onChange={handleFeeChange}
                      className="w-full rounded-2xl border-0 py-4 pl-12 pr-6 text-xl text-amber-900 ring-1 ring-amber-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="0.00"
                      required
                      />
                  </div>
                  <p className="mt-2 text-sm text-amber-600">
                    Enter the amount you want to pay for your event
                  </p>
                </div>
                {eventFee && parseFloat(eventFee) > 0 && (
                  <div className="rounded-2xl bg-amber-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700">Total Amount:</span>
                      <span className="text-2xl font-bold text-amber-900">
                        {formatPrice(eventFee)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-10 flex justify-center space-x-4">
                <button
                  onClick={handleBackStep}
                  className="rounded-2xl bg-amber-100 px-6 py-3 text-amber-700 transition-all duration-300 hover:bg-amber-200"
                >
                  Back to Details
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!eventFee || parseFloat(eventFee) <= 0}
                  className={`rounded-2xl px-8 py-4 font-medium transition-all duration-300 ${eventFee && parseFloat(eventFee) > 0 ? 'bg-yellow-500 text-white hover:bg-yellow-400 hover:shadow-lg' : 'cursor-not-allowed bg-yellow-200 text-amber-500'}`}
                  >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}
            {currentStep === 3 && eventFee && (
            <div className="animate-fade-in rounded-3xl bg-white/80 p-12 shadow-xl backdrop-blur-sm">
              <h2 className="mb-8 text-center text-2xl font-light text-amber-900">Complete Payment</h2>
              <div className="mb-8 rounded-2xl bg-amber-50 p-6">
                <h3 className="mb-4 font-semibold text-amber-900">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Customer:</span>
                    <span className="text-amber-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Email:</span>
                    <span className="text-amber-900">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Phone:</span>
                    <span className="text-amber-900">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Payment Method:</span>
                    <span className="text-amber-900">
                      {selectedCurrency === 'USD' && 'PayPal'}
                      {selectedCurrency === 'INR' && 'PhonePe'}
                      {selectedCurrency === 'RAZORPAY' && 'Razorpay'}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-amber-200 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-amber-700">Total:</span>
                      <span className="text-xl text-amber-900">
                        {formatPrice(eventFee)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedCurrency === 'USD' ? (
                <div className="mb-6">
                  {!paypalReady && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="mb-4 size-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
                      <span className="text-amber-700">Loading PayPal...</span>
                    </div>
                  )}
                  <PayPalScriptProvider options={{ 
                    clientId: PAYPAL_CLIENT_ID || '', 
                    currency: selectedCurrency,
                    intent: "capture"
                  }}>
                    <PayPalButtons
                      style={{ 
                        layout: "vertical", 
                        color: "gold", 
                        shape: "rect", 
                        label: "pay",
                        height: 50
                      }}
                      forceReRender={[selectedCurrency, eventFee]}
                      createOrder={(data, actions) => {
                        const price = parseFloat(eventFee);
                        
                        return actions.order?.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                value: price.toFixed(2),
                                currency_code: selectedCurrency
                              },
                              description: `Event Payment - ${formData.name}`
                            }
                          ]
                        }) || Promise.resolve("");
                      }}
                      onInit={() => setPaypalReady(true)}
                      onApprove={async (data, actions) => {
                        try {
                          const details = await actions.order?.capture();
                          const payerName = details?.payer?.name?.given_name || formData.name;
                          alert(`Payment successful! Thank you ${payerName}. You will receive a confirmation email shortly.`);
                          // Reset form
                          setFormData({ name: '', email: '', phone: '' });
                          setEventFee('');
                          setCurrentStep(1);
                          setPaypalReady(false);
                        } catch (error) {
                          console.error('Payment failed:', error);
                          alert('Payment failed. Please try again.');
                        }
                      }}
                      onError={(err) => {
                        console.error('PayPal error:', err);
                        alert('Payment error occurred. Please try again.');
                      }}
                      />
                  </PayPalScriptProvider>
                </div>
              ) : selectedCurrency === 'INR' ? (
                <div className="mb-6">
                  <button
                    onClick={handlePhonePePayment}
                    disabled={phonePeLoading}
                    className={`w-full rounded-2xl px-6 py-4 font-medium transition-all duration-300 ${phonePeLoading ? 'cursor-not-allowed bg-purple-300 text-purple-600' : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'}`}
                  >
                    {phonePeLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-2 size-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing PhonePe Payment...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2 text-2xl">📱</span>
                        Pay with PhonePe - {formatPrice(eventFee)}
                      </div>
                    )}
                  </button>
                  <p className="mt-2 text-center text-xs text-amber-600">
                    You will be redirected to PhonePe to complete the payment
                  </p>
                </div>
              ) : selectedCurrency === 'RAZORPAY' ? (
                <div className="mb-6">
                  <button
                    onClick={handleRazorpay}
                    disabled={isProcessing}
                    className={`w-full rounded-2xl px-6 py-4 font-medium transition-all duration-300 ${isProcessing ? 'cursor-not-allowed bg-green-300 text-green-700' : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'}`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-2 size-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing Razorpay Payment...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2 text-2xl">🪒</span>
                        Pay with Razorpay - {formatPrice(eventFee)}
                      </div>
                    )}
                  </button>
                  <p className="mt-2 text-center text-xs text-green-700">
                    You will be redirected to Razorpay to complete the payment
                  </p>
                </div>
              ) : null}
              <div className="text-center">
                <button
                  onClick={handleBackStep}
                  className="rounded-2xl bg-amber-100 px-6 py-3 text-amber-700 transition-all duration-300 hover:bg-amber-200"
                >
                  Back to Event Fee
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
        <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
          }
          `}</style>
        {/* <Footer /> */}
      </div>
    </>
  );
}
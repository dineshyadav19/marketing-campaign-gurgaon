import { useState } from 'react';
import './App.css';
import askSvg from './assets/ask.svg';
import headerSvg from './assets/header.svg';
import companyLogo from './assets/image.png';
import logo from './assets/logo.png';
import paySvg from './assets/pay.svg';
import reportSvg from './assets/report.svg';

let FLOW_API_URL = import.meta.env.VITE_APP_API_URL;
const CHECKOUT_RAZORPAY_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function App() {
  const [showCalendlyLink, setShowCalendlyLink] = useState(false);
  async function displayRazorpay() {
    const res = await loadScript(CHECKOUT_RAZORPAY_URL);

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const data = await fetch(FLOW_API_URL, {
      method: 'POST',
    }).then((res) => res.json());

    const options = {
      key: 'rzp_test_N48bOgOWcG6zL1',
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: 'Book Your Slot for an Expert Visit',
      description: 'Thank you for consulting with us',
      image: logo,
      handler: function (response: any) {
        if (response.razorpay_signature) {
          setShowCalendlyLink(true);
        }
      },
      prefill: {
        name: '',
        email: '',
        phone_number: '',
      },
    };
    const _window = window as any;
    const paymentObject = new _window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <>
      <div className="header">
        <img src={companyLogo} alt="companyLogo" className="header--img" />
      </div>
      <div className="main">
        <img src={headerSvg} alt="company-logo" />
        <h1>Welcome !</h1>
        <p>
          We're empowering people like you to become solar heroes with our
          end-to-end solar solutions.
        </p>
        <div className="steps">
          <div className="steps--block">
            <div className="steps--block-img">
              <img src={paySvg} alt="pay" />
            </div>
            <div className="steps--block-content">
              <h4>Pay Rs. 49</h4>
              <p>Book a slot for our expert’s visit to your home at Rs. 49</p>
            </div>
          </div>
          <div className="steps--block">
            <div className="steps--block-img">
              <img src={reportSvg} alt="report" />
            </div>
            <div className="steps--block-content">
              <h4>Get a detailed report</h4>
              <p>
                Solar potential of your rooftop, valid for all solar companies.
              </p>
            </div>
          </div>
          <div className="steps--block">
            <div className="steps--block-img">
              <img src={askSvg} alt="ask" />
            </div>
            <div className="steps--block-content">
              <h4>Clear all your doubts</h4>
              <p>
                Get clarity on installation, electricity bill, savings,
                maintenance, and more!
              </p>
            </div>
          </div>
        </div>
        <div>
          {showCalendlyLink ? (
            <a
              className="button"
              href="https://calendly.com/dinesh-y/site-survey?month=2022-11"
            >
              Book a Slot Now
            </a>
          ) : (
            <a
              className="button"
              onClick={displayRazorpay}
              target="_blank"
              rel="noopener noreferrer"
            >
              Make Payment
            </a>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

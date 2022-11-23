import { useState } from 'react';
import './App.css';
import askSvg from './assets/ask.svg';
import headerSvg from './assets/header.svg';
import companyLogo from './assets/image.png';
import logo from './assets/logo.png';
import paySvg from './assets/pay.svg';
import reportSvg from './assets/report.svg';

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
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const data = await fetch('http://localhost:3002/razorpay', {
      method: 'POST',
    }).then((t) => t.json());

    console.log(data);

    const options = {
      //TODO: Change this with env files
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
        console.log(response.razorpay_payment_id);
        console.log(response.razorpay_order_id);
        console.log(response.razorpay_signature);
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
    <div className="App">
      <div className="header">
        <img src={companyLogo} alt="companyLogo" className="header--img" />
      </div>
      <div className="content">
        <img src={headerSvg} alt="company-logo" />
        <h1>Welcome to SunEdison!</h1>
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
              <p>Book a slot for our expert’s visit to your home.</p>
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
            <div
              className="steps--block-content"
              style={{ marginLeft: '20px' }}
            >
              <h4>Get in touch to know more</h4>
              <p>
                Get answers to all your questions about installation,
                electricity bill savings, maintenance, and more!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="action--btn">
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
  );
}

export default App;

import '../styles/globals.css'
import { RecoilRoot } from 'recoil';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Router from 'next/router';
import axios from 'axios';
import { useState } from 'react';
import Head from 'next/head';

Router.onRouteChangeStart = () => {
  NProgress.start()
};
Router.onRouteChangeComplete = () => {
  NProgress.done()
};

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState("none");

  axios.interceptors.request.use(function(config) {
    setLoading("flex");
    return config;
  }, function(error) {
    return Promise.reject(error);
  });
  axios.interceptors.response.use(function(response) {
    setLoading("none");
    return response;
  }, function(error) {
    return Promise.reject(error);
  });

  return (
    <RecoilRoot>
      <Head>
        <title>{process.env.TITLE}</title>
      </Head>
      <div className="progress">
        <div className="loader"></div>
      </div>
      <Component {...pageProps} />

      <style jsx>{`
        .progress{
          width: 100%;
          height: 100vh;
          position: fixed;
          background: rgba(0, 0, 0, .5);
          display: ${loading};
          align-items: center;
          justify-content: center;
          z-index: 9999999;
        }
        .loader {
          border: 16px solid #f3f3f3;
          border-radius: 50%;
          border-top: 16px solid #FCC816;
          width: 200px;
          height: 200px;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </RecoilRoot>
  )
}

export default MyApp

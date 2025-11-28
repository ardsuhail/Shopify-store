"use client";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function getSessionId() {
  if (typeof window === "undefined") return null;
  let sid = localStorage.getItem("sv_session");
  if (!sid) {
    sid = uuidv4();
    localStorage.setItem("sv_session", sid);
  }
  return sid;
}

// IP detection function for client-side (optional)
async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return ''; // Server-side IP detection par bharosa karo
  }
}

export default function Tracking() {
  useEffect(() => {
    const sessionId = getSessionId();
    
    const sendTrack = async () => {
      try {
        const utm = {
          utm_source: new URLSearchParams(window.location.search).get("utm_source") || "",
          utm_medium: new URLSearchParams(window.location.search).get("utm_medium") || "",
          utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign") || ""
        };
        const fbclid = new URLSearchParams(window.location.search).get("fbclid") || "";

        // Client-side IP (optional)
        const clientIP = await getClientIP();

        console.log('🚀 Sending track data with session:', sessionId);

        const trackResponse = await fetch("/api/live-views/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            url: window.location.pathname + window.location.search,
            title: document.title,
            referrer: document.referrer || "",
            utm,
            fbclid,
            ip: clientIP, // Ab IP bhej rahe hain
            ua: navigator.userAgent
          })
        });

        const result = await trackResponse.json();
        console.log('✅ Track response:', result);

      } catch (err) {
        console.error('❌ Track error:', err);
      }
    };

    // send initial pageview
    sendTrack();

    // heartbeat every 15s
    const heartbeat = async () => {
      try {
        const heartbeatResponse = await fetch("/api/live-views/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            url: window.location.pathname + window.location.search,
            ip: await getClientIP(), // IP bhejo heartbeat me bhi
            ua: navigator.userAgent
          })
        });

        const result = await heartbeatResponse.json();
        console.log('💓 Heartbeat response:', result);

      } catch (err) {
        console.error('💔 Heartbeat error:', err);
      }
    };

    const hbInterval = setInterval(heartbeat, 15000);
    // send once right away
    heartbeat();

    // Track route changes (Next.js)
    const handleRouteChange = () => {
      setTimeout(sendTrack, 100);
    };

    // Next.js route change listeners
    window.addEventListener('popstate', handleRouteChange);
    
    // Override pushState and replaceState for Next.js navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleRouteChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleRouteChange();
    };

    // cleanup on unmount
    return () => {
      clearInterval(hbInterval);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
}
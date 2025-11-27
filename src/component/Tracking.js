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

        await fetch("/api/live-views/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            url: window.location.pathname + window.location.search,
            title: document.title,
            referrer: document.referrer || "",
            utm,
            fbclid,
            ip: "", // optional; server can detect
            ua: navigator.userAgent
          })
        });
      } catch (err) {
        // ignore errors
      }
    };

    // send initial pageview
    sendTrack();

    // heartbeat every 15s
    const heartbeat = async () => {
      try {
        await fetch("/api/live-views/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            url: window.location.pathname,
            ua: navigator.userAgent
          })
        });
      } catch (err) {}
    };

    const hbInterval = setInterval(heartbeat, 15000);
    // send once right away
    heartbeat();

    // cleanup on unmount
    return () => clearInterval(hbInterval);
  }, []);

  return null;
}

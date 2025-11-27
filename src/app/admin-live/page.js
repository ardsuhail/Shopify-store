"use client";
import { useEffect, useState } from "react";

export default function AdminLive() {
  const [live, setLive] = useState({ count: 0, byUrl: {} });

  useEffect(() => {
    let mounted = true;
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/live-views/live");
        const data = await res.json();
        if (mounted) setLive(data);
      } catch (err) {}
    };

    fetchLive();
    const iv = setInterval(fetchLive, 5000); // every 5s
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">Live Visitors</h3>
      <div className="text-4xl font-bold">{live.count}</div>
      <div className="mt-3">
        {Object.entries(live.byUrl || {}).map(([url, c]) => (
          <div key={url} className="text-sm text-gray-600">
            {url} — {c}
          </div>
        ))}
      </div>
    </div>
  );
}

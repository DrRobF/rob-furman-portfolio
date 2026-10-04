'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { productionHosts, pageEvent, linkEvent, trafficSource } from '../../lib/site-analytics.mjs';

const exclusionKey = 'drrob_analytics_exclude';

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!productionHosts.includes(window.location.hostname)) return;
    const mode = new URLSearchParams(window.location.search).get('analytics');
    let excluded = mode === 'off';
    try {
      if (mode === 'off') window.localStorage.setItem(exclusionKey, '1');
      if (mode === 'on') window.localStorage.removeItem(exclusionKey);
      excluded = excluded || window.localStorage.getItem(exclusionKey) === '1';
    } catch { /* Storage restrictions must not interfere with navigation. */ }
    if (excluded) return;

    // Clarity's queue accepts events before the remote script finishes loading.
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    if (!document.getElementById('clarity-script')) {
      const script = document.createElement('script');
      script.id = 'clarity-script';
      script.async = true;
      script.src = 'https://www.clarity.ms/tag/wiauxlc5d5';
      document.head.appendChild(script);
      window.clarity('set', 'site_environment', 'production');
      window.clarity('set', 'traffic_source', trafficSource(window.location.search, document.referrer));
    }

    const event = pageEvent(pathname);
    if (event) window.clarity('event', event);

    const onClick = (click) => {
      if (click.button > 1) return;
      if (!(click.target instanceof Element)) return;
      const link = click.target.closest('a[href]');
      if (!link) return;
      const action = linkEvent(link.getAttribute('href'), window.location.href);
      if (action) window.clarity('event', action);
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  }, [pathname]);

  return null;
}

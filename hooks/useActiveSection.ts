"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function getSectionOffset(el: HTMLElement): number {
  const originalPos = el.style.position;
  el.style.position = "relative";

  let top = 0;
  let parent: HTMLElement | null = el;
  while (parent) {
    top += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement | null;
  }

  el.style.position = originalPos;
  return top;
}

type StoreSnapshot = {
  activeIndex: number;
  progressPercent: number;
};

type Listener = () => void;

const listeners = new Set<Listener>();
let snapshot: StoreSnapshot = { activeIndex: 0, progressPercent: 0 };
let sectionIds: string[] = [];
let cachedOffsets: number[] = [];
let rafId: number | null = null;
let initTimeoutId: ReturnType<typeof setTimeout> | null = null;
let isListening = false;

function notify() {
  listeners.forEach((listener) => listener());
}

function calculateOffsets() {
  cachedOffsets = sectionIds.map((id) => {
    const el = document.getElementById(id);
    return el ? getSectionOffset(el) : 0;
  });
}

function updateFromScroll() {
  rafId = null;

  const scrollY = window.scrollY;
  const offsetMargin = 120;
  let currentIdx = 0;

  for (let i = 0; i < cachedOffsets.length; i++) {
    if (scrollY >= cachedOffsets[i] - offsetMargin) {
      currentIdx = i;
    }
  }

  let nextProgress = snapshot.progressPercent;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight > 0) {
    nextProgress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
  }

  if (
    currentIdx !== snapshot.activeIndex ||
    Math.abs(nextProgress - snapshot.progressPercent) >= 0.25
  ) {
    snapshot = { activeIndex: currentIdx, progressPercent: nextProgress };
    notify();
  }
}

function onScroll() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(updateFromScroll);
}

function onResize() {
  calculateOffsets();
  onScroll();
}

function startListening() {
  if (isListening) return;
  isListening = true;

  initTimeoutId = setTimeout(() => {
    calculateOffsets();
    updateFromScroll();
  }, 600);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

function stopListening() {
  if (!isListening) return;
  isListening = false;

  if (initTimeoutId) {
    clearTimeout(initTimeoutId);
    initTimeoutId = null;
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  if (listeners.size === 1) {
    startListening();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      stopListening();
    }
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot(): StoreSnapshot {
  return { activeIndex: 0, progressPercent: 0 };
}

export function useActiveSection(ids: string[]) {
  const idsKey = ids.join("|");

  useEffect(() => {
    sectionIds = ids;
    calculateOffsets();
    updateFromScroll();
  }, [idsKey]);

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return store;
}

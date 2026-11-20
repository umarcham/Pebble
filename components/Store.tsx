"use client";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { products, store, type Product } from "@/data/products";

const n = products.length;
const pad = (i: number) => String(i + 1).padStart(2, "0");

/* ---------- Spinning ring ---------- */
function Ring({ onOpen, onFront, paused }: { onOpen: (i: number) => void; onFront: (i: number) => void; paused: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const s = useRef({ a: 0, v: 0, drag: false, x: 0, moved: 0, front: -1 });
  const hold = useRef(paused);
  hold.current = paused;

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const st = s.current, dt = Math.min(t - last, 50);
      last = t;
      if (!st.drag) {
        st.a += st.v * dt;                         // inertia after a drag
        st.v *= Math.pow(0.94, dt / 16);
        if (!hold.current && !still) st.a += 0.011 * dt; // slow auto-spin
      }
      const el = box.current;
      if (el) {
        const w = el.clientWidth, R = Math.min(w * 0.36, 460), iw = Math.min(w * 0.27, 300);
        let best = -1, bi = 0;
        items.current.forEach((b, i) => {
          if (!b) return;
          const th = ((st.a + (i * 360) / n) * Math.PI) / 180;
          const z = Math.cos(th) * R, d = (z / R + 1) / 2; // d: 0 = back, 1 = front
          b.style.width = iw + "px";
          b.style.transform = `translate(-50%,-50%) translate3d(${Math.sin(th) * R}px,${(1 - d) * -30}px,${z}px) scale(${0.72 + 0.28 * d})`;
          b.style.opacity = String(0.25 + 0.75 * d);
          b.style.filter = `blur(${(1 - d) * 2.4}px)`;
          b.style.zIndex = String(Math.round(d * 100));
          if (d > best) { best = d; bi = i; }
        });
        if (word.current) word.current.style.transform = `translateX(${Math.sin((st.a * Math.PI) / 180) * 28}px)`;
        if (bi !== st.front) { st.front = bi; onFront(bi); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onFront]);

  const down = (e: React.PointerEvent) => { const st = s.current; st.drag = true; st.x = e.clientX; st.moved = 0; st.v = 0; };
  const move = (e: React.PointerEvent) => {
    const st = s.current; if (!st.drag) return;
    const dx = e.clientX - st.x; st.x = e.clientX; st.moved += Math.abs(dx);
    st.a += dx * 0.28; st.v = (dx * 0.28) / 16;
  };
  const up = () => { s.current.drag = false; };

  return (
    <div ref={box} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
      className="relative h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing" style={{ perspective: "1500px" }}>
      <div ref={word} aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center font-display font-extrabold leading-none tracking-tight text-[#B98F6A]/25"
        style={{ fontSize: "clamp(7rem,30vw,30rem)" }}>{store.name.toUpperCase()}</div>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[68%] h-10 w-[55%] -translate-x-1/2 rounded-full bg-[#6b4a2a]/25 blur-2xl" />
      {products.map((p, i) => (
        <button key={p.slug} ref={(el) => { items.current[i] = el; }} aria-label={`Open ${p.name}`}
          onClick={() => { if (s.current.moved < 6) onOpen(i); }}
          className="absolute left-1/2 top-[46%] rounded-3xl will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink">
          <img src={p.colors[0].image} alt={p.name} draggable={false} className="w-full drop-shadow-[0_18px_22px_rgba(90,60,30,.18)]" />
        </button>
      ))}
    </div>
  );
}

/* ---------- Product detail ---------- */
function Detail({ p, onClose, onAdd }: { p: Product; onClose: () => void; onAdd: () => void }) {
  const [ci, setCi] = useState(0);
  const [size, setSize] = useState(p.sizes[Math.min(1, p.sizes.length - 1)]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={p.name} className="sheet fixed inset-0 z-50 overflow-y-auto bg-cream/95 backdrop-blur-xl">
      <button onClick={onClose} aria-label="Close" className="fixed right-5 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink/90 text-cream md:right-9">✕</button>
      <div className="mx-auto grid min-h-full max-w-6xl items-center gap-6 px-5 pb-10 pt-20 md:grid-cols-2 md:gap-14 md:px-9">
        <div className="relative h-[46svh] md:h-[72svh]">
          {p.colors.map((c, i) => (
            <img key={c.name} src={c.image} alt={`${p.name}, ${c.name}`}
              className={`absolute inset-0 m-auto max-h-full max-w-full object-contain drop-shadow-[0_24px_28px_rgba(90,60,30,.2)] transition-all duration-500 ${i === ci ? "scale-100 opacity-100" : "scale-95 opacity-0"}`} />
          ))}
        </div>
        <div className="max-w-md">
          <p className="text-sm text-ink/60">{p.kind}, sizes {p.sizes[0]} to {p.sizes[p.sizes.length - 1]}</p>
          <h2 className="mt-1 font-display text-5xl font-semibold tracking-tight md:text-6xl">{p.name}</h2>
          <p className="mt-4 leading-relaxed text-ink/80">{p.blurb}</p>

          <p className="mt-7 text-sm font-medium">Colour: {p.colors[ci].name}</p>
          <div className="mt-2 flex gap-3">
            {p.colors.map((c, i) => (
              <button key={c.name} onClick={() => setCi(i)} aria-label={c.name} aria-pressed={i === ci}
                className={`h-9 w-9 rounded-full border border-ink/15 transition ${i === ci ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : ""}`} style={{ background: c.hex }} />
            ))}
          </div>

          <p className="mt-6 text-sm font-medium">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.sizes.map((z) => (
              <button key={z} onClick={() => setSize(z)} aria-pressed={z === size}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${z === size ? "border-ink bg-ink text-cream" : "border-ink/25"}`}>{z}</button>
            ))}
          </div>

          <button onClick={() => { onAdd(); setAdded(true); setTimeout(() => setAdded(false), 1600); }}
            className="mt-8 flex w-full items-center justify-between rounded-full bg-ink px-7 py-4 text-cream transition active:scale-[.98]">
            <span className="font-medium">{added ? "Added to bag" : "Add to bag"}</span>
            <span>${p.price}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Store() {
  const [front, setFront] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [bag, setBag] = useState(0);
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    const l = new Lenis(); lenis.current = l;
    let r = 0; const f = (t: number) => { l.raf(t); r = requestAnimationFrame(f); };
    r = requestAnimationFrame(f);
    return () => { cancelAnimationFrame(r); l.destroy(); };
  }, []);
  useEffect(() => { if (open === null) lenis.current?.start(); else lenis.current?.stop(); }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 md:px-9">
        <span className="font-display text-xl font-bold">{store.name}</span>
        <span className="hidden text-sm text-ink/70 md:block">{store.tagline}</span>
        <span className="text-sm">Bag ({bag})</span>
      </header>

      <main>
        <section className="relative isolate h-[100svh] overflow-hidden">
          <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
          <div className="absolute inset-x-0 bottom-[16svh] top-[10svh]">
            <Ring onOpen={setOpen} onFront={setFront} paused={open !== null} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-6 md:px-9">
            <div><p className="font-display text-5xl font-light">{pad(front)}<span className="text-xl text-ink/40"> / {pad(n - 1)}</span></p>
              <p className="mt-1 text-sm">{products[front].name}</p></div>
            <p className="max-w-[10rem] text-right text-sm text-ink/60">Drag to spin. Tap a piece to open it.</p>
          </div>
        </section>

        <section className="px-5 pb-24 pt-16 md:px-9">
          <h2 className="max-w-xl font-display text-4xl font-semibold tracking-tight md:text-6xl">Five pieces, made to be handed down.</h2>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {products.map((p, i) => (
              <button key={p.slug} onClick={() => setOpen(i)} className="group text-left">
                <div className="grid aspect-square place-items-center rounded-[2rem] p-6 transition group-hover:scale-[1.02]" style={{ background: `${p.colors[0].hex}26` }}>
                  <img src={p.colors[0].image} alt={p.name} className="max-h-full max-w-full object-contain drop-shadow-[0_14px_16px_rgba(90,60,30,.18)]" />
                </div>
                <div className="mt-3 flex items-baseline justify-between"><span className="font-medium">{p.name}</span><span className="text-sm text-ink/70">${p.price}</span></div>
                <div className="mt-1.5 flex gap-1.5">{p.colors.map((c) => <i key={c.name} className="h-3 w-3 rounded-full border border-ink/15" style={{ background: c.hex }} />)}</div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {open !== null && <Detail key={open} p={products[open]} onClose={() => setOpen(null)} onAdd={() => setBag((b) => b + 1)} />}
    </>
  );
}

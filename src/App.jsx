import { useState, useEffect } from "react";

const KEY = "bookshelf-v1";

const S_STYLES = {
  read:    { bg: "#d9ead3", color: "#2d6a4f", label: "Read" },
  reading: { bg: "#fff3cd", color: "#856404", label: "Reading" },
  want:    { bg: "#dce8f5", color: "#1a4a7a", label: "Want to Read" },
};

const SAMPLE = [
  { id: 1, title: "The Secret Garden",   author: "Frances H. Burnett",        status: "read",    rating: 5, isTop3: true  },
  { id: 2, title: "A Room with a View",  author: "E.M. Forster",              status: "reading", rating: 4, isTop3: true  },
  { id: 3, title: "The Little Prince",   author: "Antoine de Saint-Exupéry",  status: "want",    rating: 0, isTop3: true  },
  { id: 4, title: "Stardust",            author: "Neil Gaiman",               status: "read",    rating: 4, isTop3: false },
];

const Stars = ({ rating, onChange }) => (
  <div style={{ display:"flex", gap:2, marginTop:3 }}>
    {[1,2,3,4,5].map(n => (
      <span key={n} onClick={() => onChange && onChange(n === rating ? 0 : n)}
        style={{ cursor: onChange ? "pointer":"default", fontSize:15,
          color: n <= rating ? "#C9A84C" : "#d9c8ae" }}>★</span>
    ))}
  </div>
);

export default function App() {
  const [books, setBooks]   = useState([]);
  const [ready, setReady]   = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]     = useState({ title:"", author:"", status:"want", rating:0 });
  
  useEffect(() => {
  const saved = localStorage.getItem(KEY);
  setBooks(saved ? JSON.parse(saved) : SAMPLE);
  setReady(true);
}, []);

  useEffect(() => {
  if (ready) localStorage.setItem(KEY, JSON.stringify(books));
  }, [books, ready]);

  const add = () => {
    if (!form.title.trim()) return;
    setBooks(p => [{ ...form, id: Date.now(), isTop3: false }, ...p]);
    setForm({ title:"", author:"", status:"want", rating:0 });
    setShowAdd(false);
  };

  const del  = id => setBooks(p => p.filter(b => b.id !== id));
  const upd  = (id, ch) => setBooks(p => p.map(b => b.id === id ? {...b,...ch} : b));

  const toggleTop3 = id => {
    const b = books.find(b => b.id === id);
    const cnt = books.filter(b => b.isTop3).length;
    if (!b.isTop3 && cnt >= 3) return;
    upd(id, { isTop3: !b.isTop3 });
  };

  const top3 = books.filter(b => b.isTop3);
  const list = books.filter(b => {
    const q = search.toLowerCase();
    return (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      && (filter === "all" || b.status === filter);
  });

  const inp = (extra={}) => ({
    style:{ padding:"9px 12px", borderRadius:9, border:"1px solid #d4b896",
      background:"#fff8ee", fontSize:14, color:"#3d2b1f", fontFamily:"Georgia,serif", ...extra.style },
    ...extra
  });

  return (
    <div style={{ minHeight:"100vh", background:"#f5f0e6",
      fontFamily:"Georgia,serif", color:"#3d2b1f", padding:"28px 16px 48px" }}>

      {/* ── Header ── */}
      <div style={{ textAlign:"center", marginBottom:30 }}>
        <div style={{ fontSize:46 }}>📚</div>
        <h1 style={{ fontSize:30, fontWeight:"bold", color:"#6b3a2a",
          margin:"6px 0 4px", letterSpacing:1 }}>My Bookshelf</h1>
        <p style={{ color:"#a0785a", fontSize:13, fontStyle:"italic", margin:0 }}>
          a cozy corner for books I love
        </p>
      </div>

      {/* ── Top 3 ── */}
      {top3.length > 0 && (
        <div style={{ maxWidth:680, margin:"0 auto 28px", background:"#fdf6e3",
          borderRadius:18, padding:"18px 20px", boxShadow:"0 2px 14px rgba(107,58,42,.09)",
          border:"1px solid #e8d5b5" }}>
          <h2 style={{ fontSize:14, color:"#8B5E3C", marginBottom:14,
            fontStyle:"italic", margin:"0 0 14px" }}>⭐ My Top 3 Picks</h2>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {top3.map(b => (
              <div key={b.id} style={{ flex:1, minWidth:150, background:"#fff8ee",
                borderRadius:12, padding:"12px 14px", border:"1px solid #e0c9a6" }}>
                <div style={{ fontWeight:"bold", fontSize:14, color:"#5c3317",
                  lineHeight:1.3 }}>{b.title}</div>
                <div style={{ fontSize:12, color:"#a0785a", marginTop:2 }}>{b.author}</div>
                <Stars rating={b.rating} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div style={{ maxWidth:680, margin:"0 auto 16px", display:"flex",
        gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search title or author…"
          {...inp({ style:{ flex:1, minWidth:160, outline:"none" } })} />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          {...inp({ style:{ cursor:"pointer" } })}>
          <option value="all">All books</option>
          <option value="read">Read</option>
          <option value="reading">Reading</option>
          <option value="want">Want to Read</option>
        </select>
        <button onClick={() => setShowAdd(s => !s)}
          style={{ padding:"9px 18px", borderRadius:9, background: showAdd?"#c0846a":"#8B5E3C",
            color:"#fff8ee", border:"none", cursor:"pointer", fontSize:14,
            fontFamily:"Georgia,serif", transition:"background .2s" }}>
          {showAdd ? "✕ Cancel" : "+ Add Book"}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showAdd && (
        <div style={{ maxWidth:680, margin:"0 auto 18px", background:"#fdf6e3",
          borderRadius:16, padding:"18px 20px", border:"1px solid #e8d5b5",
          boxShadow:"0 2px 12px rgba(107,58,42,.08)" }}>
          <p style={{ margin:"0 0 12px", color:"#6b3a2a", fontSize:15, fontWeight:"bold" }}>
            Add a new book
          </p>
          <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
            <input placeholder="Title *" value={form.title}
              onChange={e => setForm(p=>({...p,title:e.target.value}))}
              {...inp({ style:{ flex:2, minWidth:130 } })} />
            <input placeholder="Author" value={form.author}
              onChange={e => setForm(p=>({...p,author:e.target.value}))}
              {...inp({ style:{ flex:2, minWidth:130 } })} />
            <select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))}
              {...inp({ style:{ cursor:"pointer" } })}>
              <option value="want">Want to Read</option>
              <option value="reading">Reading</option>
              <option value="read">Read</option>
            </select>
            <button onClick={add}
              style={{ padding:"9px 20px", borderRadius:9, background:"#6b3a2a",
                color:"#fff8ee", border:"none", cursor:"pointer", fontSize:14,
                fontFamily:"Georgia,serif" }}>
              Add
            </button>
          </div>
          <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:13, color:"#a0785a" }}>Rating:</span>
            <Stars rating={form.rating} onChange={r => setForm(p=>({...p,rating:r}))} />
          </div>
        </div>
      )}

      {/* ── Book List ── */}
      <div style={{ maxWidth:680, margin:"0 auto", display:"flex",
        flexDirection:"column", gap:9 }}>
        {list.length === 0 && (
          <div style={{ textAlign:"center", padding:48, color:"#b09070",
            fontStyle:"italic" }}>No books found… add one above!</div>
        )}
        {list.map(book => {
          const st = S_STYLES[book.status];
          const canPin = book.isTop3 || books.filter(b=>b.isTop3).length < 3;
          return (
            <div key={book.id} style={{ background:"#fff8ee", borderRadius:14,
              padding:"13px 16px", border:"1px solid #e0c9a6",
              boxShadow:"0 1px 6px rgba(107,58,42,.06)",
              display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>

              {/* pin */}
              <button onClick={() => toggleTop3(book.id)}
                title={book.isTop3 ? "Remove from Top 3" : canPin ? "Pin to Top 3" : "Top 3 full"}
                style={{ background:"none", border:"none",
                  cursor: canPin?"pointer":"not-allowed",
                  fontSize:20, opacity: canPin?1:.35, padding:0, lineHeight:1 }}>
                {book.isTop3 ? "🔖" : "🏷️"}
              </button>

              {/* info */}
              <div style={{ flex:1, minWidth:120 }}>
                <div style={{ fontWeight:"bold", fontSize:15,
                  color:"#5c3317", lineHeight:1.3 }}>{book.title}</div>
                {book.author && (
                  <div style={{ fontSize:12, color:"#a0785a", marginTop:1 }}>
                    {book.author}
                  </div>
                )}
                <Stars rating={book.rating} onChange={r => upd(book.id,{rating:r})} />
              </div>

              {/* status */}
              <select value={book.status}
                onChange={e => upd(book.id, { status: e.target.value })}
                style={{ padding:"5px 10px", borderRadius:20, border:"none",
                  background: st.bg, color: st.color, fontSize:12, fontWeight:"bold",
                  cursor:"pointer", fontFamily:"Georgia,serif" }}>
                <option value="read">Read</option>
                <option value="reading">Reading</option>
                <option value="want">Want to Read</option>
              </select>

              {/* delete */}
              <button onClick={() => del(book.id)}
                style={{ background:"none", border:"none", cursor:"pointer",
                  fontSize:20, color:"#c9a0a0", padding:0, lineHeight:1 }}
                title="Remove">×</button>
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign:"center", marginTop:36, color:"#c4a882",
        fontSize:12, fontStyle:"italic" }}>
        {books.length} book{books.length !== 1 ? "s" : ""} on your shelf
        &nbsp;·&nbsp;
        {books.filter(b=>b.status==="read").length} read
        &nbsp;·&nbsp;
        {books.filter(b=>b.status==="reading").length} in progress
      </div>
    </div>
  );
}
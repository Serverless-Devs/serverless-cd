function e(e=""){let s={},t;return e.slice(1).split("&").forEach((e=>{let t=e.split("=");s[t[0]]=t[1]})),s}const s=(e=1e3)=>new Promise((s=>setTimeout(s,e))),t=e=>{const s=e.match(/body\.ref in \[\"refs\/heads\/(.+)\"\]/);if(s)return s[1];const t=e.match(/refs\/heads\/(.+)/);return t?t[1]:e};export{t as f,e as g,s};

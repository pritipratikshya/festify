// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=mx-6+'px';cursor.style.top=my-6+'px';
});
(function anim(){
  rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  ring.style.left=rx-18+'px';ring.style.top=ry-18+'px';
  requestAnimationFrame(anim);
})();
document.querySelectorAll('a,button,.quick-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>cursor.style.transform='scale(2)');
  el.addEventListener('mouseleave',()=>cursor.style.transform='scale(1)');
});

// ── MOBILE MENU ──
function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open')}

// ── FAQ ──
function toggleFaq(btn){
  const a=btn.nextElementSibling;
  btn.classList.toggle('open');
  a.classList.toggle('open');
}

// ── REGISTRATION ──
let regData={};
let generatedEmailHTML='';
let emailGenerated=false;

function submitForm(){
  const first=document.getElementById('firstName').value.trim();
  const last=document.getElementById('lastName').value.trim();
  const email=document.getElementById('email').value.trim();
  const college=document.getElementById('college').value.trim();
  const year=document.getElementById('year').value;
  const track=document.getElementById('track').value;
  if(!first||!email||!college){
    alert('Please fill in at least your name, email, and college.');return;
  }
  const regId='FEST25-'+Math.random().toString(36).slice(2,8).toUpperCase();
  regData={first,last,email,college,year,track,regId,fullName:(first+' '+last).trim()};
  document.getElementById('modalName').textContent=regData.fullName;
  document.getElementById('regId').textContent=regId;
  // reset steps
  document.getElementById('step1').classList.add('active');
  document.getElementById('step2').classList.remove('active');
  emailGenerated=false;
  generatedEmailHTML='';
  document.getElementById('modal').classList.add('active');
}

function closeModal(){
  document.getElementById('modal').classList.remove('active');
}
document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)closeModal()});

async function showEmailStep(){
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.add('active');
  if(emailGenerated)return;
  // show loading
  document.getElementById('emailLoading').style.display='flex';
  document.getElementById('emailPreview').style.display='none';
  document.getElementById('emailRaw').style.display='none';
  // switch to preview tab
  document.querySelectorAll('.etab').forEach((t,i)=>{t.classList.toggle('active',i===0)});

  try{
    const prompt=`Generate a beautifully formatted HTML confirmation email for a student who just registered for Festify 2025, a college tech fest.

Student details:
- Name: ${regData.fullName}
- Email: ${regData.email}
- College: ${regData.college}
- Year: ${regData.year||'Not specified'}
- Track: ${regData.track||'Explorer Pass'}
- Registration ID: ${regData.regId}

Event details:
- Event: Festify 2026 — BJB (A) College's annual student festival
- Theme: "Build the World You Imagine"
- Date: June 20–22, 2026
- Venue: BJB (A), Campus 1 Auditorium, Bhubaneswar, Odisha
- Time: 9:00 AM – 9:00 PM daily

Return ONLY valid inline-styled HTML for the email body (no <!DOCTYPE>, no <html>/<body> tags). Use a clean, modern design with:
- A pink-to-purple gradient header with "Festify 2026" title
- A warm personalised greeting using the student's first name
- A styled registration ID box with a dashed border
- An event details grid (date, venue, time, track)
- A friendly message about what to expect
- A "Add to Calendar" CTA button (styled, no real link needed)
- Footer with festify@bjb.ac.in contact
- All styles must be inline. Background: white. Fonts: system sans-serif.`;

    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        messages:[{role:'user',content:prompt}]
      })
    });
    const data=await res.json();
    const html=data.content.map(b=>b.text||'').join('').replace(/^```html\n?/,'').replace(/\n?```$/,'').trim();
    generatedEmailHTML=html;
    emailGenerated=true;
    document.getElementById('emailLoading').style.display='none';
    document.getElementById('emailPreview').innerHTML=html;
    document.getElementById('emailPreview').style.display='block';
    document.getElementById('emailRaw').textContent=html;
  }catch(err){
    // fallback static email
    generatedEmailHTML=buildFallbackEmail();
    emailGenerated=true;
    document.getElementById('emailLoading').style.display='none';
    document.getElementById('emailPreview').innerHTML=generatedEmailHTML;
    document.getElementById('emailPreview').style.display='block';
    document.getElementById('emailRaw').textContent=generatedEmailHTML;
  }
}

function buildFallbackEmail(){
  return `<div style="font-family:sans-serif;background:#fff;border-radius:12px;overflow:hidden;max-width:560px">
  <div style="background:linear-gradient(135deg,#f72585,#7209b7);padding:2rem;text-align:center;color:#fff">
    <h1 style="font-size:2rem;font-weight:800;margin:0 0 .3rem">Festify 2026</h1>
    <p style="margin:0;opacity:.85;font-size:.9rem">Build the World You Imagine</p>
  </div>
  <div style="padding:2rem">
    <h2 style="font-size:1.2rem;color:#1a1a2e;margin-bottom:1rem">Hey ${regData.first}! 🎉 You're officially registered!</h2>
    <p style="color:#444;line-height:1.7;margin-bottom:1rem">We're thrilled to have you at <strong>Festify 2026</strong> — BJB (A) College's biggest student festival of the year. Get ready for three incredible days of innovation, culture, and community.</p>
    <div style="background:#f8f0ff;border:2px dashed #7209b7;border-radius:10px;padding:1.2rem;text-align:center;margin:1.5rem 0">
      <div style="font-size:1.5rem;font-weight:800;color:#7209b7;letter-spacing:2px">${regData.regId}</div>
      <p style="font-size:.78rem;color:#888;margin:.3rem 0 0">Your Registration ID — save this!</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem">
      <tr>
        <td style="padding:.6rem;background:#f5f5fa;border-radius:8px 0 0 8px;font-size:.78rem;color:#888;font-weight:600;text-transform:uppercase;width:30%">📅 Date</td>
        <td style="padding:.6rem;background:#f5f5fa;border-radius:0 8px 8px 0;font-size:.88rem;font-weight:600;color:#1a1a2e">June 20–23, 2026</td>
      </tr>
      <tr><td colspan="2" style="height:.5rem"></td></tr>
      <tr>
        <td style="padding:.6rem;background:#f5f5fa;border-radius:8px 0 0 8px;font-size:.78rem;color:#888;font-weight:600;text-transform:uppercase">📍 Venue</td>
        <td style="padding:.6rem;background:#f5f5fa;border-radius:0 8px 8px 0;font-size:.88rem;font-weight:600;color:#1a1a2e">BJB (A) College, Bhubaneswar</td>
      </tr>
      <tr><td colspan="2" style="height:.5rem"></td></tr>
      <tr>
        <td style="padding:.6rem;background:#f5f5fa;border-radius:8px 0 0 8px;font-size:.78rem;color:#888;font-weight:600;text-transform:uppercase">🎯 Track</td>
        <td style="padding:.6rem;background:#f5f5fa;border-radius:0 8px 8px 0;font-size:.88rem;font-weight:600;color:#1a1a2e">${regData.track||'Explorer Pass'}</td>
      </tr>
    </table>
    <a href="#" style="display:block;text-align:center;padding:12px;border-radius:100px;background:linear-gradient(135deg,#f72585,#7209b7);color:#fff;text-decoration:none;font-weight:600;font-size:.9rem;margin-bottom:1rem">📅 Add to Calendar</a>
    <p style="color:#666;font-size:.82rem;line-height:1.7">Please bring your college ID on event day. Meals are included for hackathon participants. See you on June 20! 🚀</p>
  </div>
  <div style="background:#f5f5fa;padding:1rem 2rem;text-align:center;font-size:.75rem;color:#888;border-top:1px solid #eee">
    Festify 2026 · BJB (A) College · festify@bjb.ac.in<br/>
    You're receiving this because you registered for Festify 2026.
  </div>
</div>`;
}

function switchTab(tab,btn){
  document.querySelectorAll('.etab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  if(tab==='preview'){
    document.getElementById('emailPreview').style.display='block';
    document.getElementById('emailRaw').style.display='none';
  } else {
    document.getElementById('emailPreview').style.display='none';
    const raw=document.getElementById('emailRaw');
    raw.innerHTML='<pre class="email-raw">'+escapeHtml(generatedEmailHTML)+'</pre>';
    raw.style.display='block';
  }
}

function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function copyEmail(){
  if(!generatedEmailHTML)return;
  navigator.clipboard.writeText(generatedEmailHTML).then(()=>{
    const btn=document.querySelector('.btn-copy');
    btn.textContent='✅ Copied!';
    setTimeout(()=>btn.textContent='📋 Copy HTML',2000);
  });
}

// ── CHATBOT ──
let chatOpen=false;
const KB={
  'register':'To register, scroll to the Register section on this page or click "Register Now." It\'s completely free! Fill in your details and you\'re all set. 🎟️',
  'price':'Festify 2025 is 100% FREE for all students. No fees, no catch — just bring your college ID! 🆓',
  'free':'Festify 2025 is completely free for all students. Just register and show your college ID at the venue. ✅',
  'prize':'The prize pool is ₹1 Lakh+! 🏆\n🥇 1st Place: ₹1,00,000\n🥈 2nd Place: ₹50,000\n🥉 3rd Place: ₹25,000\nPlus 5 special track awards!',
  'schedule':'Day 1 (Jun 20): Opening Ceremony, Hackathon Kickoff, Workshops\nDay 2 (Jun 21): Speaker Sessions, Gaming Tournament, Cultural Night 🌟\nDay 3 (Jun 22): Project Demos, Award Ceremony 🏆',
  'date':'Festify 2025 runs from June 20–22, 2025 at KIIT University, Bhubaneswar, Odisha. 📅',
  'venue':'The event is at KIIT University, Campus 1 Auditorium, Bhubaneswar, Odisha. 📍',
  'team':'Teams can have 1–4 members. Solo participants are welcome! You can also find teammates at the venue. 👥',
  'accommodation':'Accommodation is available for outstation participants at a nominal cost. Mention it in the registration form and we\'ll contact you.',
  'food':'Meals are provided free for hackathon participants throughout the event. 🍱',
  'track':'We have 5 tracks: AI/ML, Web Development, Blockchain, Design, and Gaming. Plus cultural events open to all! 🎯',
  'speaker':'Amazing speakers include AI experts from Google, startup founders, design leaders from Adobe, and fintech CTOs. 🎤',
};

function getReply(msg){
  const m=msg.toLowerCase();
  for(const k of Object.keys(KB)){if(m.includes(k))return KB[k];}
  if(m.includes('hello')||m.includes('hi')||m.includes('hey'))return "Hey there! 👋 How can I help you with Festify 2025? Ask me about registration, schedule, prizes, or anything else!";
  if(m.includes('contact')||m.includes('email'))return "You can reach the Festify team at festify@kiit.ac.in or on Instagram @festify_kiit 📧";
  if(m.includes('certif'))return "Yes! Every registered participant gets a digital participation certificate. Hackathon winners get special achievement certificates too! 📜";
  return "Great question! For detailed queries not covered here, please email us at festify@kiit.ac.in or check the event brochure. Meanwhile, I can help with: registration, schedule, prizes, venue, teams, or accommodation! 😊";
}

function addMsg(text,role){
  const div=document.createElement('div');
  div.className='msg '+role;
  div.style.whiteSpace='pre-line';
  div.textContent=text;
  document.getElementById('chatMessages').appendChild(div);
  document.getElementById('chatMessages').scrollTop=9999;
}
function showTyping(){
  const d=document.createElement('div');
  d.className='msg bot typing';d.id='typing';
  d.innerHTML='<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  document.getElementById('chatMessages').appendChild(d);
  document.getElementById('chatMessages').scrollTop=9999;
}
function removeTyping(){const t=document.getElementById('typing');if(t)t.remove();}

function sendMsg(){
  const inp=document.getElementById('chatInput');
  const msg=inp.value.trim();
  if(!msg)return;
  addMsg(msg,'user');
  inp.value='';
  document.getElementById('quickBtns').style.display='none';
  showTyping();
  setTimeout(()=>{removeTyping();addMsg(getReply(msg),'bot');},800+Math.random()*600);
}
function quickAsk(q){addMsg(q,'user');document.getElementById('quickBtns').style.display='none';showTyping();setTimeout(()=>{removeTyping();addMsg(getReply(q),'bot');},700);}
function toggleChat(){chatOpen=!chatOpen;document.getElementById('chatbox').classList.toggle('open',chatOpen);}

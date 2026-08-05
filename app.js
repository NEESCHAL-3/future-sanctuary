/* ====================================================================
   FROM 2026 TO THE FUTURE - PERSONAL SANCTUARY BY NEESCHAL (BORN 2005)
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasEngine();
    initNavigation();
    initEarthInteractions();
    initLettersVault();
    initTimeCapsule();
    initModal();
    initAudio();
    initPremiumCinematics();
});

/* ====================================================================
   1. 60FPS CANVAS ENGINE (Drifting Petals, Flowers & Full-Screen Hope Rain)
   ==================================================================== */
let createGlobalBloom = null;
let triggerHopeRain = null;

function initCanvasEngine() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let petals = [];
    let flowers = [];
    let rainParticles = [];
    let lastTime = performance.now();

    function resize() {
        width = canvas.width = window.innerWidth * window.devicePixelRatio;
        height = canvas.height = window.innerHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    window.addEventListener('resize', resize);
    resize();

    class FloatingPetal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * (window.innerWidth + 100) - 50;
            this.y = -30;
            this.size = Math.random() * 6 + 4;
            this.speedY = Math.random() * 0.4 + 0.25;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.swayFreq = Math.random() * 0.002 + 0.001;
            this.swayAmp = Math.random() * 0.8 + 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.015;
            this.opacity = Math.random() * 0.45 + 0.25;
            this.color = Math.random() > 0.5 ? 'rgba(217, 150, 99, ' : 'rgba(217, 119, 87, ';
        }

        update(time, dt) {
            this.y += this.speedY * dt * 0.06;
            this.x += (Math.sin(time * this.swayFreq) * this.swayAmp + this.speedX) * dt * 0.06;
            this.rotation += this.rotationSpeed * dt * 0.06;

            if (this.y > window.innerHeight + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color + this.opacity + ')';

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(this.size, -this.size, this.size * 1.4, this.size, 0, this.size * 1.8);
            ctx.bezierCurveTo(-this.size * 1.4, this.size, -this.size, -this.size, 0, 0);
            ctx.fill();

            ctx.restore();
        }
    }

    class BloomingFlower {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.maxRadius = Math.random() * 28 + 22;
            this.progress = 0;
            this.petals = 6;
            this.alpha = 1;
        }

        update(dt) {
            if (this.progress < 1) {
                this.progress += dt * 0.0018;
                if (this.progress > 1) this.progress = 1;
            } else {
                this.alpha -= dt * 0.0006;
            }
        }

        draw() {
            if (this.alpha <= 0) return;

            const radius = this.maxRadius * (1 - Math.pow(1 - this.progress, 3));

            ctx.save();
            ctx.translate(this.x, this.y);

            // Center pollen
            ctx.fillStyle = `rgba(245, 207, 179, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
            ctx.fill();

            // Petals
            for (let i = 0; i < this.petals; i++) {
                const angle = (i * Math.PI * 2) / this.petals;
                ctx.save();
                ctx.rotate(angle);

                ctx.strokeStyle = `rgba(217, 150, 99, ${this.alpha * 0.85})`;
                ctx.fillStyle = `rgba(217, 119, 87, ${this.alpha * 0.35})`;
                ctx.lineWidth = 1.2;

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(radius * 0.5, -radius * 0.6, 0, -radius);
                ctx.quadraticCurveTo(-radius * 0.5, -radius * 0.6, 0, 0);
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            }

            ctx.restore();
        }
    }

    // FULL-SCREEN SHIMMERING HOPE RAIN PARTICLE CLASS
    class HopeRainParticle {
        constructor() {
            // Rain spans the entire top width of the screen!
            this.x = Math.random() * window.innerWidth;
            this.y = -Math.random() * window.innerHeight * 0.5 - 20;
            this.length = Math.random() * 32 + 20;
            this.speedY = Math.random() * 4.2 + 3.0;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.alpha = Math.random() * 0.85 + 0.3;
            this.color = Math.random() > 0.4 ? 'rgba(245, 207, 179, ' : 'rgba(217, 150, 99, ';
        }

        update(dt) {
            this.y += this.speedY * dt * 0.08;
            this.x += this.speedX * dt * 0.08;
            this.alpha -= dt * 0.00025; // Gentle long fade across whole page
        }

        draw() {
            if (this.alpha <= 0) return;

            ctx.save();
            ctx.strokeStyle = this.color + this.alpha + ')';
            ctx.lineWidth = 1.8;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.speedX * 3, this.y + this.length);
            ctx.stroke();

            // Glowing light head
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    for (let i = 0; i < 48; i++) {
        const p = new FloatingPetal();
        p.y = Math.random() * window.innerHeight;
        petals.push(p);
    }

    createGlobalBloom = function(x, y) {
        flowers.push(new BloomingFlower(x, y));
    };

    triggerHopeRain = function() {
        // Spawn 120 particles across the top of the whole page
        for (let i = 0; i < 120; i++) {
            rainParticles.push(new HopeRainParticle());
        }
    };

    window.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('.modal-content') || e.target.closest('.earth-image-container')) {
            return;
        }
        createGlobalBloom(e.clientX, e.clientY);
        playChime(587.33, 0.15);
    });

    function animate(time) {
        const dt = Math.min(time - lastTime, 32);
        lastTime = time;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const grad = ctx.createRadialGradient(window.innerWidth / 2, window.innerHeight / 2, 50, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth * 0.85);
        grad.addColorStop(0, 'rgba(28, 24, 21, 0.55)');
        grad.addColorStop(1, 'rgba(18, 16, 14, 0.97)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        petals.forEach(p => {
            p.update(time, dt);
            p.draw();
        });

        for (let i = flowers.length - 1; i >= 0; i--) {
            const f = flowers[i];
            f.update(dt);
            f.draw();
            if (f.alpha <= 0) flowers.splice(i, 1);
        }

        for (let i = rainParticles.length - 1; i >= 0; i--) {
            const r = rainParticles[i];
            r.update(dt);
            r.draw();
            if (r.alpha <= 0 || r.y > window.innerHeight + 50) rainParticles.splice(i, 1);
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

/* ====================================================================
   2. NAVIGATION SWITCHER
   ==================================================================== */
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    const btnExploreAchievements = document.getElementById('btn-explore-achievements');
    const btnOpenCapsule = document.getElementById('btn-open-capsule');

    function switchView(targetId) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        navBtns.forEach(btn => {
            if (btn.getAttribute('data-view') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        views.forEach(v => {
            if (v.id === targetId) {
                v.classList.add('active');
            } else {
                v.classList.remove('active');
            }
        });

        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-view');
            switchView(target);
            playChime(440, 0.08);
        });
    });

    if (btnExploreAchievements) {
        btnExploreAchievements.addEventListener('click', () => {
            switchView('achievements-view');
            playChime(523.25, 0.1);
        });
    }

    if (btnOpenCapsule) {
        btnOpenCapsule.addEventListener('click', () => {
            switchView('capsule-view');
            playChime(659.25, 0.1);
        });
    }

    window.navigateToLetters = function() {
        switchView('letters-view');
    };
}

/* ====================================================================
   3. EARTH GLOBE CLICK & FULL-SCREEN HOPE RAIN SHOWER
   ==================================================================== */
function initEarthInteractions() {
    const earthTrigger = document.getElementById('earth-globe-trigger');
    if (!earthTrigger) return;

    earthTrigger.addEventListener('click', (e) => {
        // Bounce Animation
        earthTrigger.classList.remove('pulse-bounce');
        void earthTrigger.offsetWidth;
        earthTrigger.classList.add('pulse-bounce');

        // Shockwave Ripple Ring
        const ripple = document.createElement('div');
        ripple.className = 'earth-ripple-ring';
        earthTrigger.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);

        // Position coordinates
        const rect = earthTrigger.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Flower particles around Earth
        if (createGlobalBloom) {
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8;
                const dist = 75;
                createGlobalBloom(centerX + Math.cos(angle) * dist, centerY + Math.sin(angle) * dist);
            }
        }

        // TRIGGER FULL-SCREEN HOPI RAIN SHOWER FROM TOP OF SCREEN
        if (triggerHopeRain) {
            triggerHopeRain();
        }

        // PLAY DEEP CALM SPACE RESONANCE + CASCADING RAIN CHIMES
        playEarthSoundEffect();

        showToast("Hope Raining — May peace and light shower across Earth!");
    });
}

/* ====================================================================
   4. HUMAN LETTERS VAULT — MESSAGES BY NEESCHAL (BORN 2005)
   ==================================================================== */
const neeschalDefaultLetters = [
    {
        id: 1601,
        author: "Neeschal",
        location: "Nepal",
        audience: "future",
        text: "To the children who will walk these streets in 2030 and beyond: As someone born in 2005 writing to you in 2026, I promise to protect our green valleys, clean our rivers, and leave you a world full of open horizons.",
        likes: 142
    },
    {
        id: 1602,
        author: "Neeschal",
        location: "Nepal",
        audience: "students",
        text: "To every fellow student studying late into the night: exams and grades are only small stepping stones. Your curiosity, kindness, and quiet resilience matter far more than any test score.",
        likes: 118
    },
    {
        id: 1603,
        author: "Neeschal",
        location: "Nepal",
        audience: "teachers",
        text: "To all educators and mentors who guided us: on the days when you feel exhausted, remember that every word of encouragement you speak to a student echoes down through their entire lifetime.",
        likes: 105
    },
    {
        id: 1604,
        author: "Neeschal",
        location: "Nepal",
        audience: "healers",
        text: "To nurses, doctors, and quiet caregivers: your steady hands and gentle presence keep the heartbeat of humanity warm when sickness or fear surrounds us.",
        likes: 89
    },
    {
        id: 1605,
        author: "Neeschal",
        location: "Nepal",
        audience: "builders",
        text: "To everyone building roads, laying bricks, growing our food, and writing code: society rests on your working hands. Never doubt the deep nobility of your daily labor.",
        likes: 96
    },
    {
        id: 1606,
        author: "Neeschal",
        location: "Nepal",
        audience: "everyone",
        text: "May 2026 bring us all closer to what is real: long conversations without distraction, quiet walks in nature, and standing by one another when times are hard.",
        likes: 164
    }
];

const SUPABASE_URL = 'https://bwqrquoqxlfmgzgrnttp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_i_Q8W1-xyp3biIoZniklzQ_CJIBVYdw';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function initLettersVault() {
    const grid = document.getElementById('letters-grid');
    const tabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('vault-search');
    const btnVaultWrite = document.getElementById('btn-vault-write');

    let letters = JSON.parse(localStorage.getItem('neeschal_letters_v11_2005')) || neeschalDefaultLetters;
    let currentFilter = 'all';
    let searchQuery = '';

    fetchCloudLetters();

    async function fetchCloudLetters() {
        try {
            const { data, error } = await supabaseClient
                .from('letters')
                .select('*')
                .order('id', { ascending: false });

            if (!error && data && data.length > 0) {
                // Map DB schema to app state and preserve local 'liked' state
                letters = data.map(dbItem => {
                    const existingLocal = letters.find(l => String(l.id) === String(dbItem.id));
                    return {
                        id: dbItem.id,
                        author: dbItem.author,
                        location: dbItem.location,
                        audience: dbItem.audience,
                        text: dbItem.text,
                        likes: dbItem.likes,
                        liked: existingLocal ? existingLocal.liked : false
                    };
                });
                localStorage.setItem('neeschal_letters_v11_2005', JSON.stringify(letters));
                render();
            }
        } catch (err) {
            console.log("Using local store for letters.");
        }
    }

    function render() {
        grid.innerHTML = '';

        let filtered = letters;

        if (currentFilter !== 'all') {
            filtered = filtered.filter(l => l.audience === currentFilter);
        }

        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(l => 
                l.author.toLowerCase().includes(q) || 
                l.location.toLowerCase().includes(q) || 
                l.text.toLowerCase().includes(q)
            );
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                    <p style="font-family: var(--font-serif); font-size: 1.3rem;">No letters found matching your search.</p>
                </div>
            `;
            return;
        }

        const audienceNames = {
            family: 'To Family & Ancestors',
            friends: 'To Kindred Friends',
            love: 'To Love',
            broken: 'To The Broken & Healing',
            students: 'To Students & Learners',
            future: 'To Future Children',
            teachers: 'To Teachers & Mentors',
            healers: 'To Caregivers & Healers',
            builders: 'To Laborers & Builders',
            everyone: 'To Everyone on Earth'
        };

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'letter-card';

            card.innerHTML = `
                <div class="card-recipient">${audienceNames[item.audience] || item.audience}</div>
                <div class="card-text-body">"${escapeHtml(item.text)}"</div>
                <div class="card-bottom">
                    <div class="sender-info">
                        <span class="card-sender">— ${escapeHtml(item.author)}</span>
                        <span class="card-location">${escapeHtml(item.location || 'Nepal')}</span>
                    </div>
                    <button class="heart-btn ${item.liked ? 'liked' : ''}" data-id="${item.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span class="like-count">${item.likes}</span>
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });

        document.querySelectorAll('.heart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const target = letters.find(l => String(l.id) === id);
                if (target) {
                    if (!target.liked) {
                        target.likes++;
                        target.liked = true;
                        playChime(659.25, 0.15);
                        showToast("Thank you for sending warmth to this letter!");
                        
                        supabaseClient.from('letters').update({ likes: target.likes }).eq('id', target.id).then();
                    } else {
                        target.likes--;
                        target.liked = false;
                        
                        supabaseClient.from('letters').update({ likes: target.likes }).eq('id', target.id).then();
                    }
                    localStorage.setItem('neeschal_letters_v11_2005', JSON.stringify(letters));
                    render();
                }
            });
        });

        if (window.applyScrollReveals) window.applyScrollReveals();
        if (window.applyTiltEffect) window.applyTiltEffect();
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter');
            render();
            playChime(392, 0.08);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            render();
        });
    }

    if (btnVaultWrite) {
        btnVaultWrite.addEventListener('click', () => {
            const modal = document.getElementById('modal-bg');
            if (modal) modal.classList.add('open');
            playChime(523.25, 0.1);
        });
    }

    render();

    window.addNewLetter = async function(newLetter) {
        newLetter.id = Date.now(); // Temp ID for optimistic UI
        letters.unshift(newLetter);
        localStorage.setItem('neeschal_letters_v11_2005', JSON.stringify(letters));
        render();
        
        try {
            await supabaseClient.from('letters').insert([
                { 
                    author: newLetter.author, 
                    location: newLetter.location, 
                    audience: newLetter.audience, 
                    text: newLetter.text, 
                    likes: newLetter.likes 
                }
            ]);
            fetchCloudLetters(); // Get real DB ID
        } catch(e) {
            console.error("Failed to sync new letter to Supabase.", e);
        }
    };
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ====================================================================
   5. TIME CAPSULE — AUTHENTIC TIMELINE (NEESCHAL BORN IN 2005)
   ==================================================================== */
const capsuleMilestones = {
    2026: {
        title: "Dispatch from Neeschal (2026)",
        text: "Writing to you in 2026 at 21 years old. Born in 2005 in Nepal, I pledge to use my youth, code, and voice to protect our remaining green forests, teach with patience, and ensure technology remains a humble servant to human kindness.",
        tag: "NEESCHAL (AGE 21)"
    },
    2030: {
        title: "To the Children of 2030",
        text: "Dear children: as someone who grew up in the 2000s and 2010s, I promise to plant trees, restore riverways, and build clean tools so you can grow up in a healthy, peaceful world.",
        tag: "LETTER TO 2030"
    },
    2040: {
        title: "To the Young Scholars & Creators of 2040",
        text: "To the students and dreamers of 2040: whatever technology or code you write, let empathy and human dignity lead every line. Build open doors for others.",
        tag: "LETTER TO 2040"
    },
    2050: {
        title: "To the Mid-Century Guardians of Earth",
        text: "Greetings to 2050 from 2026. Looking back over my first 45 years, I am proud of the foundations we laid for renewable grids and ecological recovery. Hold fast to planetary balance.",
        tag: "LETTER TO 2050"
    },
    2075: {
        title: "To the Elders & Caretakers of 2075",
        text: "To the generation guiding Earth in 2075: thank you for preserving intergenerational wisdom, protecting natural heritage, and sustaining global peace across decades.",
        tag: "LETTER TO 2075"
    },
    2100: {
        title: "To the Inhabitants of the 22nd Century",
        text: "To those living in 2100: Born in 2005 and sending you this message from 2026, I leave you my boundless hope. We guarded this planet, wrote code, built homes, and held hope so that you may live in joy and freedom.",
        tag: "NEESCHAL CENTURY CAPSULE"
    }
};

function initTimeCapsule() {
    const slider = document.getElementById('capsule-slider');
    const yearDisplay = document.getElementById('capsule-display-year');
    const titleDisplay = document.getElementById('capsule-display-title');
    const textDisplay = document.getElementById('capsule-display-text');
    const tagDisplay = document.getElementById('capsule-display-tag');

    if (!slider) return;

    slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        yearDisplay.textContent = val;

        const keys = Object.keys(capsuleMilestones).map(Number).sort((a, b) => a - b);
        let activeKey = keys[0];
        for (let k of keys) {
            if (val >= k) activeKey = k;
        }

        const data = capsuleMilestones[activeKey];
        titleDisplay.textContent = data.title;
        textDisplay.textContent = data.text;
        tagDisplay.textContent = `${data.tag} (${val})`;

        playChime(261.63 + (val - 2026) * 4.5, 0.03);
    });
}

/* ====================================================================
   6. MODAL FORM & TOAST NOTIFICATION
   ==================================================================== */
function initModal() {
    const modal = document.getElementById('modal-bg');
    const btnOpen = document.getElementById('btn-write-letter');
    const btnClose = document.getElementById('close-modal');
    const form = document.getElementById('letter-form');
    const textarea = document.getElementById('letter-text');
    const counter = document.getElementById('char-num');

    if (!modal || !btnOpen) return;

    btnOpen.addEventListener('click', () => {
        modal.classList.add('open');
        playChime(523.25, 0.1);
    });

    btnClose.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    textarea.addEventListener('input', () => {
        counter.textContent = textarea.value.length;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const author = document.getElementById('author-input').value.trim();
        const location = document.getElementById('location-input').value.trim();
        const audience = document.getElementById('audience-select').value;
        const text = textarea.value.trim();

        if (author && location && text) {
            const newLetter = {
                id: Date.now(),
                author: author,
                location: location,
                audience: audience,
                text: text,
                likes: 1,
                liked: true
            };

            // Play flying envelope animation
            playPublishAnimation(modal, form, () => {
                if (window.addNewLetter) {
                    window.addNewLetter(newLetter);
                }

                form.reset();
                counter.textContent = '0';
                modal.classList.remove('open');

                if (window.navigateToLetters) {
                    window.navigateToLetters();
                }

                showToast("Your letter has been published publicly for everyone on Earth!");
            });
        }
    });
}

function playPublishAnimation(modal, form, callback) {
    form.style.opacity = '0';
    form.style.transition = 'opacity 0.3s ease';
    
    const overlay = document.createElement('div');
    overlay.className = 'publish-animation-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0'; overlay.style.left = '0';
    overlay.style.width = '100%'; overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '100';

    overlay.innerHTML = `
        <svg class="flying-envelope" width="80" height="80" viewBox="0 0 24 24" fill="var(--accent-gold)">
            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
        </svg>
        <div class="publish-hearts-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
    `;

    modal.querySelector('.modal-content').appendChild(overlay);

    const envelope = overlay.querySelector('.flying-envelope');
    const heartsContainer = overlay.querySelector('.publish-hearts-container');

    // Create sparks
    for (let i = 0; i < 24; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent-rose)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
        heart.style.position = 'absolute';
        heart.style.left = '50%';
        heart.style.top = '50%';
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 100;
        const tx = Math.cos(angle) * radius;
        const ty = Math.sin(angle) * radius - 80 - (Math.random() * 100); 
        
        heart.style.transition = `transform ${0.8 + Math.random()}s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease`;
        heart.style.transform = `translate(-50%, -50%) scale(0)`;
        heart.style.opacity = '1';
        
        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${0.4 + Math.random()})`;
            heart.style.opacity = '0';
        }, 50);
    }

    envelope.style.transition = 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.4s ease';
    envelope.style.transform = 'translateY(30px) scale(1)';
    envelope.style.opacity = '1';
    
    setTimeout(() => {
        envelope.style.transform = 'translateY(-200px) scale(0.1)';
        envelope.style.opacity = '0';
    }, 50);

    // Magical chime chord!
    playChime(523.25, 0.1);
    setTimeout(() => playChime(659.25, 0.15), 150);
    setTimeout(() => playChime(783.99, 0.25), 300);
    setTimeout(() => playChime(1046.50, 0.4), 450);

    setTimeout(() => {
        callback();
        setTimeout(() => {
            overlay.remove();
            form.style.opacity = '1';
        }, 500);
    }, 1500);
}

function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/* ====================================================================
   7. SOUND EFFECTS ENGINE (Deep Space Resonance + Hope Rain Cascades)
   ==================================================================== */
let audioCtx = null;
let audioActive = false;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

let spaceHumOsc = null;
let spaceHumGain = null;

function initAudio() {
    const btn = document.getElementById('btn-audio-toggle');
    const label = document.getElementById('audio-text');

    if (!btn) return;

    btn.addEventListener('click', () => {
        const ctx = getAudioContext();
        audioActive = !audioActive;

        if (audioActive) {
            btn.classList.add('active');
            label.textContent = 'Ambience On';
            playChime(523.25, 0.2);
            
            // Start Ambient Space Hum
            spaceHumOsc = ctx.createOscillator();
            spaceHumGain = ctx.createGain();
            
            spaceHumOsc.type = 'triangle';
            spaceHumOsc.frequency.setValueAtTime(55, ctx.currentTime); // Deep bass
            
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(0.015, ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(spaceHumGain.gain);
            
            spaceHumGain.gain.setValueAtTime(0, ctx.currentTime);
            spaceHumGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 4);
            
            spaceHumOsc.connect(spaceHumGain);
            spaceHumGain.connect(ctx.destination);
            
            spaceHumOsc.start();
            lfo.start();
        } else {
            btn.classList.remove('active');
            label.textContent = 'Quiet Ambience';
            
            if (spaceHumGain) {
                spaceHumGain.gain.cancelScheduledValues(ctx.currentTime);
                spaceHumGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
                setTimeout(() => {
                    if (spaceHumOsc) {
                        spaceHumOsc.stop();
                        spaceHumOsc = null;
                    }
                }, 2000);
            }
        }
    });
}

function playChime(freq, duration = 0.1) {
    if (!audioActive && !audioCtx) return;

    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (err) {
        console.error(err);
    }
}

// DEEP SPACE RESONANCE + CASCADING RAIN DROP CHIMES
function playEarthSoundEffect() {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        // 1. Deep Sub Space Hum (A2 - 110Hz warm filter sweep)
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(110, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 1.8);

        subGain.gain.setValueAtTime(0.22, now);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        subOsc.connect(filter);
        filter.connect(subGain);
        subGain.connect(ctx.destination);

        subOsc.start(now);
        subOsc.stop(now + 2.0);

        // 2. Cascading Rain Drop Notes (E6, D6, B5, G#5, E5) - "Hope Rain" Glissando
        const rainNotes = [1318.51, 1174.66, 987.77, 830.61, 659.25];
        rainNotes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.08 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4 + idx * 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + 1.4 + idx * 0.08);
        });

    } catch (err) {
        console.error("Audio synthesis error:", err);
    }
}

/* ====================================================================
   8. PREMIUM CINEMATICS (Custom Cursor, Parallax, Tilt, Scroll Reveal)
   ==================================================================== */
function initPremiumCinematics() {
    // 1. Ambient Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    const trail = document.getElementById('cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    if (cursor && trail && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            
            // Hover logic
            const target = e.target;
            const isClickable = target.closest('a, button, input, textarea, select, .earth-image-container, .nav-btn, .heart-btn');
            if (isClickable) {
                cursor.classList.add('hovering');
            } else {
                cursor.classList.remove('hovering');
            }
        });

        // Smooth trailing loop
        function animateTrail() {
            trailX += (mouseX - trailX) * 0.25;
            trailY += (mouseY - trailY) * 0.25;
            trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
            requestAnimationFrame(animateTrail);
        }
        requestAnimationFrame(animateTrail);
    }

    // 2. Deep Space Parallax (Canvas)
    const canvas = document.getElementById('canvas');
    if (canvas) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            canvas.style.transform = `translateY(${y * 0.18}px)`;
        }, { passive: true });
    }

    // 3. Intersection Observer Scroll Reveals
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Function to apply reveals to dynamically rendered elements (like letters)
    window.applyScrollReveals = function() {
        const elements = document.querySelectorAll('.pillar-card, .letter-card, .capsule-container, .earth-exhibit-card');
        elements.forEach(el => {
            if (!el.classList.contains('reveal-on-scroll')) {
                el.classList.add('reveal-on-scroll');
            }
            scrollObserver.observe(el);
        });
    };

    // Apply initially
    window.applyScrollReveals();

    // 4. Tactile 3D Glass Cards (Hover Tilt)
    function applyTiltEffect() {
        const tiltCards = document.querySelectorAll('.pillar-card, .letter-card');
        
        tiltCards.forEach(card => {
            // Only add once
            if (card.classList.contains('tilt-card')) return;
            card.classList.add('tilt-card');
            
            // Add glare overlay div
            const glare = document.createElement('div');
            glare.className = 'glare-overlay';
            card.appendChild(glare);

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -4; // Max 4 deg
                const rotateY = ((x - centerX) / centerX) * 4;  // Max 4 deg
                
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 60%)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
                glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 55%)`;
            });
        });
    }

    // 5. Magnetic Buttons
    if (window.innerWidth > 768) {
        const magnetBtns = document.querySelectorAll('.nav-btn, .primary-btn, .secondary-btn, .tab-btn');
        magnetBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transition = 'transform 0.1s linear';
                btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                btn.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // 6. Dynamic Mouse Spotlight
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-overlay';
    spotlight.style.position = 'fixed';
    spotlight.style.top = '0';
    spotlight.style.left = '0';
    spotlight.style.width = '100vw';
    spotlight.style.height = '100vh';
    spotlight.style.pointerEvents = 'none';
    spotlight.style.zIndex = '0'; 
    document.body.prepend(spotlight);

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            spotlight.style.background = `radial-gradient(800px circle at ${e.clientX}px ${e.clientY}px, rgba(212, 175, 55, 0.04), transparent 40%)`;
        });
    }

    // Removed Cryptographic Text Reveal per user request

    // Apply tilt initially and expose function for dynamically rendered elements
    applyTiltEffect();
    window.applyTiltEffect = applyTiltEffect;
}

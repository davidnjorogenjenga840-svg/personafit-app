// ==========================================
// 1. FIREBASE INITIALIZATION CONTROLS
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDC8PnfYWLN6m0iuFvHH7zu-RxNNqM53nU",
  authDomain: "denzel-86984.firebaseapp.com",
  projectId: "denzel-86984",
  storageBucket: "denzel-86984.firebasestorage.app",
  messagingSenderId: "882631502416",
  appId: "1:882631502416:web:55a00294cef2b4a30b3f55",
  measurementId: "G-W1QR00QEHD"
};

// Initialize the engine networks
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const STORAGE_KEY = "personafit_lifestyle_metrics_v2";

// CENTRAL APPLICATION DATA ARCHITECTURE MAPPED TO USER DOCUMENT
let currentUserUid = null;
let currentAuthMode = "signup"; // signup or login

let appState = {
    userName: "",
    userAvatar: "",
    focusVector: "lean",
    metrics: { steps: 0, water: 0.0, workout: 0 }
};

const workoutDataBank = {
    gym: [{ title: "Barbell Back Squats", detail: "4 Sets x 8 Reps" }, { title: "Incline Chest Press", detail: "3 Sets x 10 Reps" }],
    home: [{ title: "Goblet Squats", detail: "4 Sets x 12 Reps" }, { title: "Single-Arm Rows", detail: "4 Sets x 10 Reps" }]
};

// ==========================================
// 2. TOGGLE AUTHENTICATION SYSTEM FIELDS
// ==========================================
function toggleAuthMode() {
    const title = document.getElementById('auth-title');
    const desc = document.getElementById('auth-desc');
    const nameGroup = document.getElementById('group-username');
    const avatarGroup = document.getElementById('avatar-upload-zone');
    const toggleLink = document.getElementById('auth-toggle-link');
    const toggleMsg = document.getElementById('auth-toggle-msg');
    const submitBtn = document.getElementById('btn-auth-submit');

    if (currentAuthMode === "signup") {
        currentAuthMode = "login";
        title.innerText = "Welcome Back Vector";
        desc.innerText = "Input your active system credentials to unlock your cloud-hosted profile metrics.";
        nameGroup.style.display = "none";
        avatarGroup.style.display = "none";
        toggleMsg.innerText = "New to the platform?";
        toggleLink.innerText = "Create Account";
        submitBtn.innerHTML = 'Unlock Core Profile <i class="fa-solid fa-lock-open"></i>';
    } else {
        currentAuthMode = "signup";
        title.innerText = "Initialize Profile Parameters";
        desc.innerText = "Welcome to PersonaFit AI. Let's start building your biological ledger configuration from absolute zero.";
        nameGroup.style.display = "block";
        avatarGroup.style.display = "block";
        toggleMsg.innerText = "Already registered?";
        toggleLink.innerText = "Log In Instead";
        submitBtn.innerHTML = 'Proceed Next Step <i class="fa-solid fa-arrow-right"></i>';
    }
}

// ==========================================
// 3. SECURE AUTH PATHWAY ENGINE
// ==========================================
function handleAuthSubmit() {
    const emailField = document.getElementById('auth-email').value.trim();
    const passField = document.getElementById('auth-password').value.trim();
    const nameField = document.getElementById('ob-name').value.trim();

    if (!emailField || !passField) {
        alert("Please map your standard identification codes correctly.");
        return;
    }

    if (currentAuthMode === "signup") {
        if (!nameField) {
            alert("Please input a Profile Name to generate your digital matrix account ledger.");
            return;
        }
        // Save initial parameters to system state variables
        appState.userName = nameField;
        
        auth.createUserWithEmailAndPassword(emailField, passField)
            .then((userCredential) => {
                currentUserUid = userCredential.user.uid;
                // Advance to Step 2 Focus Select
                document.getElementById('step-card-1').classList.remove('active-step');
                document.getElementById('step-card-2').classList.add('active-step');
            })
            .catch((error) => { alert("Registration Interrupted: " + error.message); });
    } else {
        auth.signInWithEmailAndPassword(emailField, passField)
            .then((userCredential) => {
                currentUserUid = userCredential.user.uid;
                // Bypass straight to sequence setup loader
                document.getElementById('step-card-1').classList.remove('active-step');
                document.getElementById('step-card-3').classList.add('active-step');
                initializeSimulatedNeuralSequence();
            })
            .catch((error) => { alert("Authentication Core Refused: " + error.message); });
    }
}

function advanceOnboardingStep(nextStepNumber) {
    if (nextStepNumber === 3) {
        document.getElementById('step-card-2').classList.remove('active-step');
        document.getElementById('step-card-3').classList.add('active-step');
        initializeSimulatedNeuralSequence();
    }
}

function selectFocusVector(vectorKey) {
    appState.focusVector = vectorKey;
    document.getElementById('opt-lean').classList.remove('selected');
    document.getElementById('opt-bulk').classList.remove('selected');
    document.getElementById(`opt-${vectorKey}`).classList.add('selected');
}

function initializeSimulatedNeuralSequence() {
    const progressLoader = document.getElementById('onboarding-loader');
    const title = document.getElementById('status-title');
    const desc = document.getElementById('status-desc');
    let progressWidth = 0;

    const intervalTimer = setInterval(async () => {
        progressWidth += 2;
        progressLoader.style.width = progressWidth + '%';

        if (progressWidth === 30) {
            title.innerText = "Downloading MobileNet Vision Arrays";
            desc.innerText = "Configuring client-side image detection structures onto system memory hooks...";
            if (typeof preloadVisionSystemInstance === "function") {
                await preloadVisionSystemInstance();
            }
        }
        if (progressWidth === 70) {
            title.innerText = "Securing Realtime Database Sink";
            desc.innerText = "Mapping clean user synchronization matrix configurations securely to Cloud Firestore...";
        }

        if (progressWidth >= 100) {
            clearInterval(intervalTimer);
            
            // Sync current configurations locally & push to Cloud Database safely
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.metrics));
            localStorage.setItem("personafit_user_name", appState.userName);
            if (appState.userAvatar) {
                localStorage.setItem("personafit_user_avatar", appState.userAvatar);
            }
            localStorage.setItem("personafit_focus_vector", appState.focusVector);

            await pushStateToFirestore();
            applyUserLoginInterface(appState.userName, appState.userAvatar);
            toggleDietGoal(appState.focusVector);
            renderDashboardGauges();
            
            document.getElementById('initialization-overlay').style.animation = "smoothReveal 0.3s reverse forwards";
            setTimeout(() => {
                document.getElementById('initialization-overlay').style.display = 'none';
            }, 300);
        }
    }, 400);
}

// ==========================================
// 4. SYNCHRONIZATION DATA ROUTINES
// ==========================================
async function pushStateToFirestore() {
    if (!currentUserUid) return;
    try {
        await db.collection("users").doc(currentUserUid).set(appState);
        console.log("Telemetry matrix state safely uploaded to Firestore registry cluster.");
    } catch (err) {
        console.error("Firestore Core Sync Blocked: ", err);
    }
}

function resetPlatformLedgerToZero() {
    auth.signOut().then(() => {
        localStorage.clear();
        window.location.reload();
    });
}

function processAvatarLoginUpload(inputElement) {
    const file = inputElement.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        appState.userAvatar = e.target.result;
        const prev = document.getElementById('avatarLoginPreview');
        prev.src = appState.userAvatar;
        prev.style.display = 'inline-block';
        document.getElementById('avatarLoginText').innerText = "Avatar File Cached!";
    };
    reader.readAsDataURL(file);
}

function applyUserLoginInterface(name, avatarData) {
    document.getElementById('portalBtnText').innerText = name || "User Profile";
    const navAv = document.getElementById('navAvatar');
    if (avatarData) {
        navAv.src = avatarData;
        navAv.style.display = 'inline-block';
    }
}

function incrementMetric(metricKey, amountToAdd, ceilingLimit) {
    appState.metrics[metricKey] = parseFloat((appState.metrics[metricKey] + amountToAdd).toFixed(1));
    if (appState.metrics[metricKey] > ceilingLimit) appState.metrics[metricKey] = ceilingLimit;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.metrics));
    pushStateToFirestore();
    renderDashboardGauges();
}

function renderDashboardGauges() {
    document.getElementById('stepsVal').innerText = `${appState.metrics.steps.toLocaleString()} / 10,000`;
    document.getElementById('waterVal').innerText = `${appState.metrics.water} / 2 L`;
    document.getElementById('workoutVal').innerText = `${appState.metrics.workout} / 45 min`;

    const stepsPercentage = Math.min((appState.metrics.steps / 10000) * 100, 100);
    const waterPercentage = Math.min((appState.metrics.water / 2) * 100, 100);
    const workoutPercentage = Math.min((appState.metrics.workout / 45) * 100, 100);

    document.getElementById('stepsBar').style.width = `${stepsPercentage}%`;
    document.getElementById('waterBar').style.width = `${waterPercentage}%`;
    document.getElementById('workoutBar').style.width = `${workoutPercentage}%`;

    const collectiveScoreAverage = Math.round((stepsPercentage + waterPercentage + workoutPercentage) / 3);
    document.getElementById('healthScoreText').innerText = `${collectiveScoreAverage}%`;

    const mathCircumference = 2 * Math.PI * 45;
    document.getElementById('healthRing').style.strokeDasharray = mathCircumference;
    document.getElementById('healthRing').style.strokeDashoffset = mathCircumference - (collectiveScoreAverage / 100) * mathCircumference;
}

function toggleDietGoal(goalKey) {
    document.getElementById('btn-diet-lean').classList.remove('active');
    document.getElementById('btn-diet-bulk').classList.remove('active');
    
    const tgtBtn = document.getElementById(`btn-diet-${goalKey}`);
    if (tgtBtn) tgtBtn.classList.add('active');

    const tagKcal = document.getElementById('tag-kcal');
    const tagProtein = document.getElementById('tag-protein');
    const insightText = document.getElementById('diet-insight-text');

    if (goalKey === 'lean') {
        tagKcal.innerText = "2,150 Kcal"; tagKcal.style.color = "var(--accent-orange)";
        tagProtein.innerText = "140 Grams";
        insightText.innerText = "Macro parameters are tailored to facilitate continuous fat oxidation lines safely.";
    } else {
        tagKcal.innerText = "2,850 Kcal"; tagKcal.style.color = "var(--accent-pink)";
        tagProtein.innerText = "165 Grams";
        insightText.innerText = "Caloric targets expanded to progressive positive surplus models to build structural lean mass.";
    }
}

function toggleWorkoutEquipment(equipKey) {
    document.getElementById('btn-equip-gym').classList.remove('active');
    document.getElementById('btn-equip-home').classList.remove('active');
    document.getElementById(`btn-equip-${equipKey}`).classList.add('active');

    const targetContainer = document.getElementById('workout-exercises-container');
    if (!targetContainer) return;
    targetContainer.innerHTML = "";

    workoutDataBank[equipKey].forEach(item => {
        targetContainer.innerHTML += `
            <div class="data-display-row">
                <div><i class="fa-solid fa-circle-check" style="color:var(--primary-purple)"></i><span>${item.title}</span></div>
                <span class="tag-pill" style="background:rgba(255,255,255,0.05); color:var(--text-muted);">${item.detail}</span>
            </div>`;
    });
}

function switchToView(viewTargetId) {
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    const chosenView = document.getElementById('view-' + viewTargetId);
    if (chosenView) chosenView.classList.add('active-view');

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const targetedNavButton = document.getElementById('link-' + viewTargetId);
    if (targetedNavButton) targetedNavButton.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 5. OBSERVER REAL-TIME HANDSHAKE SINK
// ==========================================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUserUid = user.uid;
        document.getElementById('initialization-overlay').style.display = 'none';
        
        const docRef = await db.collection("users").doc(currentUserUid).get();
        if (docRef.exists) {
            appState = docRef.data();
        } else {
            // Restore from local migration data fallback
            appState.userName = localStorage.getItem("personafit_user_name") || "Profile User";
            appState.userAvatar = localStorage.getItem("personafit_user_avatar") || "";
            appState.focusVector = localStorage.getItem("personafit_focus_vector") || "lean";
            appState.metrics = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { steps: 0, water: 0.0, workout: 0 };
        }
        
        applyUserLoginInterface(appState.userName, appState.userAvatar);
        renderDashboardGauges();
        toggleDietGoal(appState.focusVector);
        if (typeof preloadVisionSystemInstance === "function") preloadVisionSystemInstance();
    } else {
        document.getElementById('initialization-overlay').style.display = 'flex';
        renderDashboardGauges();
    }
    toggleWorkoutEquipment('gym');
});
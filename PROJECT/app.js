/**
 * PersonaFit AI - Core Telemetry & Authentication Lifecycle Matrix
 * Connects HTML parameters seamlessly to Firebase App Compat architecture
 */

// ==========================================
// 1. GLOBAL PLATFORM STATE LOGS
// ==========================================
let isSignUpMode = true; 
let selectedFocusVector = 'lean';
let currentUserData = {
    steps: 0,
    water: 0,
    workout: 0,
    healthIndex: 0
};

// ==========================================
// 2. AUTHENTICATION HANDSHAKE & LAYOUT SWITCHES
// ==========================================

/**
 * Toggles the onboarding authorization window between registration parameters 
 * and access validation mode (Sign-Up vs Log-In)
 */
window.toggleAuthMode = function() {
    isSignUpMode = !isSignUpMode;
    
    // Grab all DOM components needing matrix adaptation
    const authTitle = document.getElementById('auth-title');
    const authDesc = document.getElementById('auth-desc');
    const groupUsername = document.getElementById('group-username');
    const avatarZone = document.getElementById('avatar-upload-zone');
    const toggleLink = document.getElementById('auth-toggle-link');
    const toggleMsg = document.getElementById('auth-toggle-msg');
    const submitBtn = document.getElementById('btn-auth-submit');

    if (!isSignUpMode) {
        // Transition interface to security verification protocol (Log In)
        if(authTitle) authTitle.innerText = "Access Biological Ledger";
        if(authDesc) authDesc.innerText = "Enter your credentials to re-verify your security session parameters.";
        if(groupUsername) groupUsername.style.display = 'none'; 
        if(avatarZone) avatarZone.style.display = 'none';       
        if(toggleMsg) toggleMsg.innerText = "New to the platform?";
        if(toggleLink) toggleLink.innerText = "Create Profile Instead";
        if(submitBtn) submitBtn.innerHTML = 'Verify Security Access <i class="fa-solid fa-unlock"></i>';
    } else {
        // Transition interface to standard configuration generation (Sign Up)
        if(authTitle) authTitle.innerText = "Initialize Profile Parameters";
        if(authDesc) authDesc.innerText = "Welcome to PersonaFit AI. Let's start building your biological ledger configuration from absolute zero.";
        if(groupUsername) groupUsername.style.display = 'block';
        if(avatarZone) avatarZone.style.display = 'block';
        if(toggleMsg) toggleMsg.innerText = "Already registered?";
        if(toggleLink) toggleLink.innerText = "Log In Instead";
        if(submitBtn) submitBtn.innerHTML = 'Proceed Next Step <i class="fa-solid fa-arrow-right"></i>';
    }
};

/**
 * Validates form integrity and deploys credentials to Firebase Auth Modules
 */
window.handleAuthSubmit = function() {
    const emailField = document.getElementById('auth-email');
    const passwordField = document.getElementById('auth-password');
    const nameField = document.getElementById('ob-name');

    const email = emailField ? emailField.value.trim() : "";
    const password = passwordField ? passwordField.value : "";
    const name = nameField ? nameField.value.trim() : "Operator";

    if (!email || !password) {
        alert("Please provide valid security criteria: Missing Email/Password.");
        return;
    }

    if (isSignUpMode) {
        // Run standard cloud registration schema
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("Profile generated successfully in secure sector:", userCredential.user);
                
                // Update basic display profile settings
                userCredential.user.updateProfile({ displayName: name }).then(() => {
                    // Update portal UI text directly
                    const portalBtnText = document.getElementById('portalBtnText');
                    if (portalBtnText) portalBtnText.innerText = name;
                    
                    // Advance to onboarding focus step
                    window.advanceOnboardingStep(2); 
                });
            })
            .catch((error) => {
                console.error("Sign up matrix collision:", error);
                alert(error.message);
            });
    } else {
        // Run verification protocol against current Firebase users
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("Handshake validated successfully. Access authorized:", userCredential.user);
                // Jump straight to synchronization phase
                window.advanceOnboardingStep(3); 
            })
            .catch((error) => {
                console.error("Authentication mapping failed:", error);
                alert(error.message);
            });
    }
};

// ==========================================
// 3. ONBOARDING SEQUENCE WORKFLOWS
// ==========================================

/**
 * Handles target choice buttons on Step 2
 */
window.selectFocusVector = function(vectorType) {
    selectedFocusVector = vectorType;
    
    // Adjust CSS visuals across selection buttons
    const optLean = document.getElementById('opt-lean');
    const optBulk = document.getElementById('opt-bulk');
    
    if(optLean && optBulk) {
        if(vectorType === 'lean') {
            optLean.classList.add('selected');
            optBulk.classList.remove('selected');
        } else {
            optBulk.classList.add('selected');
            optLean.classList.remove('selected');
        }
    }
    console.log(`Target calibration index re-routed to: ${vectorType}`);
};

/**
 * Shifts slider layouts and handles terminal deployment procedures
 */
window.advanceOnboardingStep = function(stepNumber) {
    const step1 = document.getElementById('step-card-1');
    const step2 = document.getElementById('step-card-2');
    const step3 = document.getElementById('step-card-3');

    if(step1) step1.classList.remove('active-step');
    if(step2) step2.classList.remove('active-step');
    if(step3) step3.classList.remove('active-step');
    
    const activeCard = document.getElementById(`step-card-${stepNumber}`);
    if (activeCard) {
        activeCard.classList.add('active-step');
    }

    // Step 3 triggers cloud syncing routines
    if (stepNumber === 3) {
        let progressBar = document.getElementById('onboarding-loader');
        if (progressBar) progressBar.style.width = '100%';
        
        // Execute primary database initialization records
        initializeUserCloudDatabase();
    }
};

// ==========================================
// 4. FIREBASE REAL-TIME STORAGE DATA MATRIX
// ==========================================

/**
 * Generates starting telemetry templates in Firestore if record fields are blank
 */
function initializeUserCloudDatabase() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const db = firebase.firestore();
    const userDocRef = db.collection("users").doc(user.uid);

    userDocRef.get().then((doc) => {
        if (!doc.exists()) {
            // Setup default metric logs inside firestore tables
            const initialLedger = {
                uid: user.uid,
                aliasName: user.displayName || "Operator Core",
                focusVector: selectedFocusVector,
                stepsCount: 0,
                waterVolume: 0,
                workoutDuration: 0,
                createdTimestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            userDocRef.set(initialLedger)
                .then(() => {
                    console.log("Cloud records instantiated perfectly.");
                    closeInitializationOverlay();
                })
                .catch(err => console.error("Database writing error: ", err));
        } else {
            // Existing user profiles skip creation, read existing elements directly
            const data = doc.data();
            selectedFocusVector = data.focusVector || 'lean';
            currentUserData.steps = data.stepsCount || 0;
            currentUserData.water = data.waterVolume || 0;
            currentUserData.workout = data.workoutDuration || 0;
            
            // Re-sync UI layouts
            updateDashboardGraphics();
            closeInitializationOverlay();
        }
    });
}

/**
 * Disconnects overlay block once ledger pipelines are locked in
 */
function closeInitializationOverlay() {
    setTimeout(() => {
        const overlay = document.getElementById('initialization-overlay');
        if (overlay) overlay.style.display = 'none';
        console.log("Workspace decrypted. Onboarding framework deactivated.");
    }, 1500);
}

// ==========================================
// 5. APPLICATION METRICS ENGINE & NAVIGATION
// ==========================================

/**
 * Renders changes between workspace frames instantly via ID switches
 */
window.switchToView = function(viewId) {
    // Collect all elements mapped to sub-dashboard components
    const views = document.querySelectorAll('main.app-view');
    views.forEach(view => view.classList.remove('active-view'));

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) targetView.classList.add('active-view');

    // Sync header visual indicators
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.getElementById(`link-${viewId}`);
    if (activeLink) activeLink.classList.add('active');
    
    console.log(`Navigation channel connected to frame: view-${viewId}`);
};

/**
 * Manages incremental updates on dashboard card elements when clicked
 */
window.incrementMetric = function(type, amount, ceiling) {
    if (currentUserData[type] !== undefined) {
        if (currentUserData[type] >= ceiling) {
            currentUserData[type] = 0; // Rotates to zero when goals are exceeded
        } else {
            currentUserData[type] = Math.min(currentUserData[type] + amount, ceiling);
        }
        
        updateDashboardGraphics();
        saveTelemetryToCloud();
    }
};

/**
 * Forces calculation streams to interface panels, progress rings, and text nodes
 */
function updateDashboardGraphics() {
    // Write value metrics to elements
    const stepsText = document.getElementById('stepsVal');
    const waterText = document.getElementById('waterVal');
    const workoutText = document.getElementById('workoutVal');

    if(stepsText) stepsText.innerText = `${currentUserData.steps.toLocaleString()} / 10,000`;
    if(waterText) waterText.innerText = `${currentUserData.water.toFixed(2)} / 2 L`;
    if(workoutText) workoutText.innerText = `${currentUserData.workout} / 45 min`;

    // Scale fill bars dynamically
    const stepsBar = document.getElementById('stepsBar');
    const waterBar = document.getElementById('waterBar');
    const workoutBar = document.getElementById('workoutBar');

    if(stepsBar) stepsBar.style.width = `${(currentUserData.steps / 10000) * 100}%`;
    if(waterBar) waterBar.style.width = `${(currentUserData.water / 2.0) * 100}%`;
    if(workoutBar) workoutBar.style.width = `${(currentUserData.workout / 45) * 100}%`;

    // Re-evaluate current general health matrix scores
    calculateOverallHealthScore();
}

/**
 * Compiles metric logs together to produce the main status circle value
 */
function calculateOverallHealthScore() {
    const sPerc = Math.min(currentUserData.steps / 10000, 1);
    const wPerc = Math.min(currentUserData.water / 2.0, 1);
    const kPerc = Math.min(currentUserData.workout / 45, 1);

    const totalIndex = Math.round(((sPerc + wPerc + kPerc) / 3) * 100);
    
    const healthText = document.getElementById('healthScoreText');
    if (healthText) healthText.innerText = `${totalIndex}%`;

    // Animate SVG stroke configurations
    const ringCircle = document.getElementById('healthRing');
    if (ringCircle) {
        const radius = ringCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        ringCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        const strokeOffset = circumference - (totalIndex / 100) * circumference;
        ringCircle.style.strokeDashoffset = strokeOffset;
    }
}

/**
 * Syncs real-time state logs straight up to Firestore clusters
 */
function saveTelemetryToCloud() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    firebase.firestore().collection("users").doc(user.uid).update({
        stepsCount: currentUserData.steps,
        waterVolume: currentUserData.water,
        workoutDuration: currentUserData.workout
    }).then(() => {
        console.log("Telemetry matrix system data safely pushed to cloud infrastructure.");
    }).catch(err => console.error("Cloud synchronizer drop-out: ", err));
}

// ==========================================
// 6. GLOBAL SESSION EVENT TRACKERS
// ==========================================

/**
 * Listens for state shifts (detects fresh connections and active auth states)
 */
firebase.auth().onAuthStateChanged((user) => {
    const portalText = document.getElementById('portalBtnText');
    const navAvatar = document.getElementById('navAvatar');

    if (user) {
        console.log(`Active connection persistent: User session running [${user.email}]`);
        if (portalText) portalText.innerText = user.displayName || "Active Core";
        if (navAvatar) {
            navAvatar.src = user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=40";
            navAvatar.style.display = 'block';
        }
        
        // Connect dataset pipes directly
        initializeUserCloudDatabase();
    } else {
        console.log("No authorization signature verified. Triggering structural security panel locking mechanism.");
        const overlay = document.getElementById('initialization-overlay');
        if (overlay) overlay.style.display = 'flex';
        if (portalText) portalText.innerText = "Initializing...";
        if (navAvatar) navAvatar.style.display = 'none';
    }
});

/**
 * Forces session drops to system logs, returning user views back to baseline levels
 */
window.resetPlatformLedgerToZero = function() {
    if (confirm("Disconnect live terminal data links and lock session workspace?")) {
        firebase.auth().signOut().then(() => {
            // Flush localized variable properties clean
            currentUserData.steps = 0;
            currentUserData.water = 0;
            currentUserData.workout = 0;
            updateDashboardGraphics();
            window.switchToView('home');
            window.location.reload();
        });
    }
};

/**
 * Encodes uploaded image data structures as functional image placeholders
 */
window.processAvatarLoginUpload = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('avatarLoginPreview');
            const txt = document.getElementById('avatarLoginText');
            if (preview && txt) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                txt.innerText = "Avatar Configured Successfully";
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
};
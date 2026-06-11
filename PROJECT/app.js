const STORAGE_KEY = "personafit_lifestyle_metrics_v2";

let liveMetrics = { steps: 0, water: 0.0, workout: 0 };
let activeFocusVector = 'lean';
let bufferedAvatarBase64 = "";

const workoutDataBank = {
    gym: [{ title: "Barbell Back Squats", detail: "4 Sets x 8 Reps" }, { title: "Incline Chest Press", detail: "3 Sets x 10 Reps" }],
    home: [{ title: "Goblet Squats", detail: "4 Sets x 12 Reps" }, { title: "Single-Arm Rows", detail: "4 Sets x 10 Reps" }]
};

window.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem("personafit_user_name");
    if (savedName) {
        document.getElementById('initialization-overlay').style.display = 'none';
        liveMetrics = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { steps: 0, water: 0.0, workout: 0 };
        activeFocusVector = localStorage.getItem("personafit_focus_vector") || 'lean';
        applyUserLoginInterface(savedName, localStorage.getItem("personafit_user_avatar"));
        renderDashboardGauges();
        toggleDietGoal(activeFocusVector);
        preloadVisionSystemInstance();
    } else {
        renderDashboardGauges();
    }
    toggleWorkoutEquipment('gym');
});

function switchToView(viewTargetId) {
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    const chosenView = document.getElementById('view-' + viewTargetId);
    if (chosenView) chosenView.classList.add('active-view');

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const targetedNavButton = document.getElementById('link-' + viewTargetId);
    if (targetedNavButton) targetedNavButton.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function advanceOnboardingStep(nextStepNumber) {
    if (nextStepNumber === 2) {
        const inputtedName = document.getElementById('ob-name').value.trim();
        if (!inputtedName) {
            alert("Please input a Profile Name to generate your digital matrix account ledger.");
            return;
        }
        localStorage.setItem("personafit_user_name", inputtedName);
        document.getElementById('step-card-1').classList.remove('active-step');
        document.getElementById('step-card-2').classList.add('active-step');
    }
    else if (nextStepNumber === 3) {
        document.getElementById('step-card-2').classList.remove('active-step');
        document.getElementById('step-card-3').classList.add('active-step');
        initializeSimulatedNeuralSequence();
    }
}

function selectFocusVector(vectorKey) {
    activeFocusVector = vectorKey;
    document.getElementById('opt-lean').classList.remove('selected');
    document.getElementById('opt-bulk').classList.remove('selected');
    document.getElementById(`opt-${vectorKey}`).classList.add('selected');
    localStorage.setItem("personafit_focus_vector", vectorKey);
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
            await preloadVisionSystemInstance();
        }
        if (progressWidth === 70) {
            title.innerText = "Securing Local Cache Storage";
            desc.innerText = "Mapping clean instance registry vectors safely inside browser context...";
        }

        if (progressWidth >= 100) {
            clearInterval(intervalTimer);
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(liveMetrics));
            if (bufferedAvatarBase64) {
                localStorage.setItem("personafit_user_avatar", bufferedAvatarBase64);
            }

            applyUserLoginInterface(localStorage.getItem("personafit_user_name"), bufferedAvatarBase64);
            toggleDietGoal(activeFocusVector);
            
            document.getElementById('initialization-overlay').style.animation = "smoothReveal 0.3s reverse forwards";
            setTimeout(() => {
                document.getElementById('initialization-overlay').style.display = 'none';
            }, 300);
        }
    }, 50);
}

function resetPlatformLedgerToZero() {
    localStorage.clear();
    liveMetrics = { steps: 0, water: 0.0, workout: 0 };
    location.reload();
}

function processAvatarLoginUpload(inputElement) {
    const file = inputElement.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        bufferedAvatarBase64 = e.target.result;
        const prev = document.getElementById('avatarLoginPreview');
        prev.src = bufferedAvatarBase64;
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
    liveMetrics[metricKey] = parseFloat((liveMetrics[metricKey] + amountToAdd).toFixed(1));
    if (liveMetrics[metricKey] > ceilingLimit) liveMetrics[metricKey] = ceilingLimit;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(liveMetrics));
    renderDashboardGauges();
}

function renderDashboardGauges() {
    document.getElementById('stepsVal').innerText = `${liveMetrics.steps.toLocaleString()} / 10,000`;
    document.getElementById('waterVal').innerText = `${liveMetrics.water} / 2 L`;
    document.getElementById('workoutVal').innerText = `${liveMetrics.workout} / 45 min`;

    const stepsPercentage = Math.min((liveMetrics.steps / 10000) * 100, 100);
    const waterPercentage = Math.min((liveMetrics.water / 2) * 100, 100);
    const workoutPercentage = Math.min((liveMetrics.workout / 45) * 100, 100);

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
    targetContainer.innerHTML = "";

    workoutDataBank[equipKey].forEach(item => {
        targetContainer.innerHTML += `
            <div class="data-display-row">
                <div><i class="fa-solid fa-circle-check" style="color:var(--primary-purple)"></i><span>${item.title}</span></div>
                <span class="tag-pill" style="background:rgba(255,255,255,0.05); color:var(--text-muted);">${item.detail}</span>
            </div>`;
    });
}
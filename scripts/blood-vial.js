/**
 * Blood Vial Health Bars for Foundry VTT
 * Perfect for Gothic campaigns like Curse of Strahd
 */

class BloodVialHealthBar {
    static MODULE_NAME = "blood-vial-health";
    static MODULE_TITLE = "Blood Vial Health Bars";

    /**
     * Create a blood vial health bar element
     * @param {number} current - Current HP value
     * @param {number} max - Maximum HP value
     * @param {string} id - Unique identifier for this health bar
     * @returns {HTMLElement} The blood vial health bar element
     */
    static createBloodVial(current, max, id = "") {
        const container = document.createElement("div");
        container.className = "blood-vial-container";
        container.id = id ? `blood-vial-${id}` : "";

        const liquid = document.createElement("div");
        liquid.className = "blood-liquid";
        
        // Add bubbles for animation (if enabled)
        if (game.settings.get(this.MODULE_NAME, "enableBubbles")) {
            for (let i = 0; i < 5; i++) {
                const bubble = document.createElement("div");
                bubble.className = "blood-bubble";
                liquid.appendChild(bubble);
            }
        }

        container.appendChild(liquid);
        
        // Update the health display
        this.updateHealthBar(container, current, max);
        
        return container;
    }

    /**
     * Update an existing blood vial health bar
     * @param {HTMLElement} container - The blood vial container
     * @param {number} current - Current HP value  
     * @param {number} max - Maximum HP value
     */
    static updateHealthBar(container, current, max) {
        const liquid = container.querySelector(".blood-liquid");
        if (!liquid) return;

        const percentage = Math.max(0, Math.min(100, (current / max) * 100));
        liquid.style.width = `${percentage}%`;

        // Remove existing health classes
        liquid.classList.remove("critical", "wounded", "healthy", "full");

        // Add appropriate health class based on percentage
        if (percentage <= 25) {
            liquid.classList.add("critical");
        } else if (percentage <= 50) {
            liquid.classList.add("wounded");  
        } else if (percentage < 100) {
            liquid.classList.add("healthy");
        } else {
            liquid.classList.add("full");
        }

        // Add tooltip with exact values
        container.title = `${current} / ${max} HP (${Math.round(percentage)}%)`;
    }

    /**
     * Replace existing health bars with blood vials
     */
    static replaceHealthBars() {
        // Replace token health bars
        document.querySelectorAll('.token-health .bar').forEach(bar => {
            const token = bar.closest('[data-token-id]');
            if (!token) return;

            const tokenDoc = canvas.tokens.get(token.dataset.tokenId);
            if (!tokenDoc?.actor) return;

            const hp = tokenDoc.actor.system.attributes?.hp;
            if (!hp) return;

            // Create blood vial replacement
            const bloodVial = this.createBloodVial(hp.value, hp.max, tokenDoc.id);
            bar.parentNode.replaceChild(bloodVial, bar);
        });
    }

    /**
     * Add blood vials to actor sheets
     */
    static enhanceActorSheets() {
        document.querySelectorAll('.actor-sheet .hp input[type="text"]').forEach(input => {
            const form = input.closest('form');
            if (!form || form.querySelector('.blood-vial-container')) return;

            const actor = game.actors.get(form.dataset.actorId);
            if (!actor) return;

            const hp = actor.system.attributes?.hp;
            if (!hp) return;

            const bloodVial = this.createBloodVial(hp.value, hp.max, actor.id);
            input.parentNode.appendChild(bloodVial);
        });
    }

    /**
     * Update bubble visibility based on settings
     */
    static updateBubbleVisibility() {
        const enableBubbles = game.settings.get(this.MODULE_NAME, "enableBubbles");
        
        // Update existing blood vials
        document.querySelectorAll('.blood-vial-container').forEach(container => {
            const liquid = container.querySelector('.blood-liquid');
            if (!liquid) return;

            // Remove existing bubbles
            liquid.querySelectorAll('.blood-bubble').forEach(bubble => bubble.remove());

            // Add bubbles if enabled
            if (enableBubbles) {
                for (let i = 0; i < 5; i++) {
                    const bubble = document.createElement("div");
                    bubble.className = "blood-bubble";
                    liquid.appendChild(bubble);
                }
            }
        });

        // Update CSS custom property for display
        document.documentElement.style.setProperty(
            '--bubble-display', 
            enableBubbles ? 'block' : 'none'
        );
    }
}

// Module initialization
Hooks.once('init', async function() {
    console.log(`${BloodVialHealthBar.MODULE_TITLE} | Initializing module`);
    
    // Register module settings
    game.settings.register(BloodVialHealthBar.MODULE_NAME, "enableTokens", {
        name: game.i18n.localize("blood-vial-health.settings.enableTokens.name"),
        hint: game.i18n.localize("blood-vial-health.settings.enableTokens.hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => window.location.reload()
    });

    game.settings.register(BloodVialHealthBar.MODULE_NAME, "enableActorSheets", {
        name: game.i18n.localize("blood-vial-health.settings.enableActorSheets.name"),
        hint: game.i18n.localize("blood-vial-health.settings.enableActorSheets.hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => window.location.reload()
    });

    game.settings.register(BloodVialHealthBar.MODULE_NAME, "enableBubbles", {
        name: game.i18n.localize("blood-vial-health.settings.enableBubbles.name"),
        hint: game.i18n.localize("blood-vial-health.settings.enableBubbles.hint"),
        scope: "world", 
        config: true,
        type: Boolean,
        default: true,
        onChange: () => BloodVialHealthBar.updateBubbleVisibility()
    });
});

Hooks.once('ready', async function() {
    console.log(`${BloodVialHealthBar.MODULE_TITLE} | Module ready`);
    
    // Apply initial bubble setting
    BloodVialHealthBar.updateBubbleVisibility();
});

// Hook into token updates
Hooks.on('updateToken', (tokenDoc, changes) => {
    if (!game.settings.get(BloodVialHealthBar.MODULE_NAME, "enableTokens")) return;
    
    if (changes.actorData?.system?.attributes?.hp) {
        const bloodVial = document.querySelector(`#blood-vial-${tokenDoc.id}`);
        if (bloodVial) {
            const hp = tokenDoc.actor.system.attributes.hp;
            BloodVialHealthBar.updateHealthBar(bloodVial, hp.value, hp.max);
        }
    }
});

// Hook into actor updates  
Hooks.on('updateActor', (actor, changes) => {
    if (!game.settings.get(BloodVialHealthBar.MODULE_NAME, "enableActorSheets")) return;
    
    if (changes.system?.attributes?.hp) {
        const bloodVial = document.querySelector(`#blood-vial-${actor.id}`);
        if (bloodVial) {
            const hp = actor.system.attributes.hp;
            BloodVialHealthBar.updateHealthBar(bloodVial, hp.value, hp.max);
        }
    }
});

// Hook into canvas ready to replace token health bars
Hooks.on('canvasReady', () => {
    if (game.settings.get(BloodVialHealthBar.MODULE_NAME, "enableTokens")) {
        setTimeout(() => BloodVialHealthBar.replaceHealthBars(), 1000);
    }
});

// Hook into actor sheet rendering
Hooks.on('renderActorSheet', (app, html) => {
    if (game.settings.get(BloodVialHealthBar.MODULE_NAME, "enableActorSheets")) {
        setTimeout(() => BloodVialHealthBar.enhanceActorSheets(), 100);
    }
});

// Export for global access
window.BloodVialHealthBar = BloodVialHealthBar;

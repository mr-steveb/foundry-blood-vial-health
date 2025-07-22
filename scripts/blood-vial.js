/**
 * Blood Vial Health Bars for Foundry VTT
 * Perfect for D&D 5e and Curse of Strahd campaigns
 */

class BloodVialHealthBar {
    static MODULE_NAME = "blood-vial-health";
    static MODULE_TITLE = "Blood Vial Health Bars";
    static SUPPORTED_SYSTEMS = ["dnd5e"];

    /**
     * Check if current system is supported
     * @returns {boolean} True if system is supported
     */
    static isSystemSupported() {
        return this.SUPPORTED_SYSTEMS.includes(game.system.id);
    }

    /**
     * Safely get HP data from actor (D&D 5e specific)
     * @param {Actor} actor - The actor document
     * @returns {Object|null} HP data or null if invalid
     */
    static getActorHP(actor) {
        try {
            if (!actor?.system?.attributes?.hp) {
                console.warn(`${this.MODULE_TITLE} | Actor has no HP data:`, actor?.name);
                return null;
            }

            const hp = actor.system.attributes.hp;
            
            // Validate HP data structure (D&D 5e format)
            if (typeof hp.value !== 'number' || typeof hp.max !== 'number') {
                console.warn(`${this.MODULE_TITLE} | Invalid HP data format:`, hp);
                return null;
            }

            // Handle edge cases
            if (hp.max <= 0) {
                console.warn(`${this.MODULE_TITLE} | Actor has zero or negative max HP:`, actor?.name);
                return null;
            }

            return {
                value: Math.max(0, hp.value), // Ensure non-negative
                max: hp.max,
                temp: hp.temp || 0, // D&D 5e temp HP
                tempmax: hp.tempmax || 0 // D&D 5e temp max HP
            };
        } catch (error) {
            console.error(`${this.MODULE_TITLE} | Error getting HP data:`, error);
            return null;
        }
    }

    /**
     * Create a blood vial health bar element
     * @param {number} current - Current HP value
     * @param {number} max - Maximum HP value
     * @param {string} id - Unique identifier for this health bar
     * @returns {HTMLElement} The blood vial health bar element
     */
    static createBloodVial(current, max, id = "") {
        // Validate inputs
        if (typeof current !== 'number' || typeof max !== 'number' || max <= 0) {
            console.warn(`${this.MODULE_TITLE} | Invalid HP values for blood vial:`, { current, max });
            return null;
        }

        const container = document.createElement("div");
        container.className = "blood-vial-container";
        container.id = id ? `blood-vial-${id}` : "";
        container.dataset.moduleId = this.MODULE_NAME; // For cleanup

        const liquid = document.createElement("div");
        liquid.className = "blood-liquid";
        
        // Add bubbles for animation (if enabled and setting exists)
        try {
            const enableBubbles = game.settings.get(this.MODULE_NAME, "enableBubbles");
            if (enableBubbles) {
                for (let i = 0; i < 5; i++) {
                    const bubble = document.createElement("div");
                    bubble.className = "blood-bubble";
                    liquid.appendChild(bubble);
                }
            }
        } catch (error) {
            // Settings might not be initialized yet, skip bubbles
            console.debug(`${this.MODULE_TITLE} | Bubbles setting not available yet`);
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
        if (!container) {
            console.warn(`${this.MODULE_TITLE} | No container provided for health bar update`);
            return;
        }

        const liquid = container.querySelector(".blood-liquid");
        if (!liquid) {
            console.warn(`${this.MODULE_TITLE} | No liquid element found in container`);
            return;
        }

        // Validate and sanitize values
        const sanitizedCurrent = Math.max(0, Number(current) || 0);
        const sanitizedMax = Math.max(1, Number(max) || 1); // Prevent division by zero

        const percentage = Math.max(0, Math.min(100, (sanitizedCurrent / sanitizedMax) * 100));
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
        container.title = `${sanitizedCurrent} / ${sanitizedMax} HP (${Math.round(percentage)}%)`;
    }

    /**
     * Replace existing health bars with blood vials
     */
    static replaceHealthBars() {
        if (!this.isSystemSupported()) {
            console.debug(`${this.MODULE_TITLE} | System not supported: ${game.system.id}`);
            return;
        }

        try {
            // Replace token health bars
            document.querySelectorAll('.token-health .bar').forEach(bar => {
                try {
                    const token = bar.closest('[data-token-id]');
                    if (!token) return;

                    const tokenDoc = canvas.tokens.get(token.dataset.tokenId);
                    if (!tokenDoc?.actor) return;

                    const hp = this.getActorHP(tokenDoc.actor);
                    if (!hp) return;

                    // Check if already replaced
                    if (bar.parentNode.querySelector('.blood-vial-container')) return;

                    // Create blood vial replacement
                    const bloodVial = this.createBloodVial(hp.value, hp.max, tokenDoc.id);
                    if (bloodVial) {
                        bar.parentNode.replaceChild(bloodVial, bar);
                    }
                } catch (error) {
                    console.error(`${this.MODULE_TITLE} | Error replacing health bar:`, error);
                }
            });
        } catch (error) {
            console.error(`${this.MODULE_TITLE} | Error in replaceHealthBars:`, error);
        }
    }

    /**
     * Add blood vials to actor sheets (D&D 5e specific)
     */
    static enhanceActorSheets() {
        if (!this.isSystemSupported()) return;

        try {
            // D&D 5e actor sheet HP inputs
            document.querySelectorAll('.actor-sheet .hp input[name="system.attributes.hp.value"]').forEach(input => {
                try {
                    const form = input.closest('form');
                    if (!form || form.querySelector('.blood-vial-container')) return;

                    const actorId = form.dataset.actorId || input.closest('[data-actor-id]')?.dataset.actorId;
                    if (!actorId) return;

                    const actor = game.actors.get(actorId);
                    if (!actor) return;

                    const hp = this.getActorHP(actor);
                    if (!hp) return;

                    const bloodVial = this.createBloodVial(hp.value, hp.max, actor.id);
                    if (bloodVial) {
                        // Insert after the HP input
                        input.parentNode.appendChild(bloodVial);
                    }
                } catch (error) {
                    console.error(`${this.MODULE_TITLE} | Error enhancing actor sheet:`, error);
                }
            });
        } catch (error) {
            console.error(`${this.MODULE_TITLE} | Error in enhanceActorSheets:`, error);
        }
    }

    /**
     * Update bubble visibility based on settings
     */
    static updateBubbleVisibility() {
        try {
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
        } catch (error) {
            console.error(`${this.MODULE_TITLE} | Error updating bubble visibility:`, error);
        }
    }

    /**
     * Clean up module elements (for disable/uninstall)
     */
    static cleanup() {
        try {
            document.querySelectorAll(`[data-module-id="${this.MODULE_NAME}"]`).forEach(element => {
                element.remove();
            });
            console.log(`${this.MODULE_TITLE} | Cleanup completed`);
        } catch (error) {
            console.error(`${this.MODULE_TITLE} | Error during cleanup:`, error);
        }
    }
}

// Module initialization
Hooks.once('init', async function() {
    console.log(`${BloodVialHealthBar.MODULE_TITLE} | Initializing module`);
    
    // Check system compatibility
    if (!BloodVialHealthBar.isSystemSupported()) {
        console.warn(`${BloodVialHealthBar.MODULE_TITLE} | Unsupported system: ${game.system.id}. Supported systems: ${BloodVialHealthBar.SUPPORTED_SYSTEMS.join(', ')}`);
        return;
    }
    
    // Register module settings with fallback text
    game.settings.register(BloodVialHealthBar.MODULE_NAME, "enableTokens", {
        name: game.i18n.localize("blood-vial-health.settings.enableTokens.name") || "Enable for Tokens",
        hint: game.i18n.localize("blood-vial-health.settings.enableTokens.hint") || "Replace token health bars with blood vials",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => window.location.reload()
    });

    game.settings.register(BloodVialHealthBar.MODULE_NAME, "enableActorSheets", {
        name: game.i18n.localize("blood-vial-health.settings.enableActorSheets.name") || "Enable for Actor Sheets",
        hint: game.i18n.localize("blood-vial-health.settings.enableActorSheets.hint") || "Add blood vials to actor sheets",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => window.location.reload()
    });

    game.settings.register(BloodVialHealthBar.MODULE_NAME, "enableBubbles", {
        name: game.i18n.localize("blood-vial-health.settings.enableBubbles.name") || "Enable Bubbles",
        hint: game.i18n.localize("blood-vial-health.settings.enableBubbles.hint") || "Show animated bubbles in the blood vials",
        scope: "world", 
        config: true,
        type: Boolean,
        default: true,
        onChange: () => BloodVialHealthBar.updateBubbleVisibility()
    });

    console.log(`${BloodVialHealthBar.MODULE_TITLE} | Settings registered for system: ${game.system.id}`);
});

Hooks.once('ready', async function() {
    if (!BloodVialHealthBar.isSystemSupported()) return;
    
    console.log(`${BloodVialHealthBar.MODULE_TITLE} | Module ready`);
    
    // Apply initial bubble setting
    BloodVialHealthBar.updateBubbleVisibility();
});

// Hook into token updates (D&D 5e specific)
Hooks.on('updateToken', (tokenDoc, changes) => {
    if (!BloodVialHealthBar.isSystemSupported()) return;
    if (!game.settings.get(BloodVialHealthBar.MODULE_NAME, "enableTokens")) return;
    
    // Check for HP changes in D&D 5e format
    if (changes.actorData?.system?.attributes?.hp || changes.system?.attributes?.hp) {
        const bloodVial = document.querySelector(`#blood-vial-${tokenDoc.id}`);
        if (bloodVial && tokenDoc.actor) {
            const hp = BloodVialHealthBar.getActorHP(tokenDoc.actor);
            if (hp) {
                BloodVialHealthBar.updateHealthBar(bloodVial, hp.value, hp.max);
            }
        }
    }
});

// Hook into actor updates (D&D 5e specific)
Hooks.on('updateActor', (actor, changes) => {
    if (!BloodVialHealthBar.isSystemSupported()) return;
    if (!game.settings.get(BloodVialHealthBar.MODULE_NAME, "enableActorSheets")) return;
    
    // Check for HP changes in D&D 5e format
    if (changes.system?.attributes?.hp) {
        const bloodVial = document.querySelector(`#blood-vial-${actor.id}`);
        if (bloodVial) {
            const hp = BloodVialHealthBar.getActorHP(actor);
            if (hp) {
                BloodVialHealthBar.updateHealthBar(bloodVial, hp.value, hp.max);
            }
        }
    }
});

// Hook into canvas ready to replace token health bars
Hooks.on('canvasReady', () => {
    if (!BloodVialHealthBar.isSystemSupported()) return;
    if (game.settings.get(BloodVialHealthBar.MODULE_NAME, "enableTokens")) {
        setTimeout(() => BloodVialHealthBar.replaceHealthBars(), 1000);
    }
});

// Hook into actor sheet rendering (D&D 5e specific)
Hooks.on('renderActorSheet5e', (app, html) => {
    if (!BloodVialHealthBar.isSystemSupported()) return;
    if (game.settings.get(BloodVialHealthBar.MODULE_NAME, "enableActorSheets")) {
        setTimeout(() => BloodVialHealthBar.enhanceActorSheets(), 100);
    }
});

// Generic actor sheet hook as fallback
Hooks.on('renderActorSheet', (app, html) => {
    if (!BloodVialHealthBar.isSystemSupported()) return;
    if (game.settings.get(BloodVialHealthBar.MODULE_NAME, "enableActorSheets")) {
        setTimeout(() => BloodVialHealthBar.enhanceActorSheets(), 100);
    }
});

// Cleanup when module is disabled
Hooks.on('closeSettings', () => {
    // Check if module was disabled and clean up if needed
    // This is a basic cleanup - more sophisticated cleanup would require core Foundry hooks
});

// Export for global access
window.BloodVialHealthBar = BloodVialHealthBar;

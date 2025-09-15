addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 13)) 
            mult = mult.times(upgradeEffect('p', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            title: "wow",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },
    12: {
            title: "does something",
            description: "something boosts something",
            cost: new Decimal(2),
            
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
                },
    13:  {
        title: "does somethingin reverse",
        description: "something2 boosts something1",
        cost: new Decimal(10),
        
        effect() {
            return player.points.add(1).pow(0.15)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            },

    }
})


addLayer("b", {
    name: "booster",
    symbol: "B",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#0025f5",
    requires: new Decimal(10),
    resource: "boosters",
    baseResource: "prestige points",           
    baseAmount() { return player.p.points },   // Prestige layer points
    type: "normal",
    exponent: 0.5,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },

    row: 1,   // force second row
    displayRow: 1, // 👈 extra force (sometimes needed)
    
    hotkeys: [
        {key: "b", description: "B: Reset for boosters", 
         onPress(){ if (canReset(this.layer)) doReset(this.layer) }},
    ],
    layerShown(){return true},

    effect() {
        let boosterPower = new Decimal(2)
        return Decimal.pow(boosterPower, player.b.points)
    },
    effectDescription() {
        return "which multiplies point gain by " + format(this.effect()) + 
               " (each booster gives ×" + format(2) + ")"
    },
})

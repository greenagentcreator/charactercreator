// All available professions for Delta Green Character Creator

export const PROFESSIONS = {
    "anthropologist_archaeologist_historian": {
        nameKey: "profession_anthropologist_name",
        bonds: 4,
        baseSkills: [
            { orSkills: [{ key: "anthropology", value: 50 }, { key: "archeology", value: 50 }], id: "anth_arch" },
            { key: "bureaucracy", value: 40 },
            { key: "foreign_language", value: 50, type: true, id: "fl1" },
            { key: "foreign_language", value: 30, type: true, id: "fl2" },
            { key: "history", value: 60 },
            { key: "occult", value: 40 },
            { key: "persuade", value: 40 }
        ],
        choiceSkills: {
            count: 2,
            options: [
                { key: "anthropology", value: 40 }, { key: "archeology", value: 40 },
                { key: "humint", value: 50 }, { key: "navigate", value: 50 },
                { key: "ride", value: 50 }, { key: "search", value: 60 },
                { key: "survival", value: 50 }
            ]
        }
    },
    "computer_scientist_engineer": {
        nameKey: "profession_computer_scientist_name",
        bonds: 3,
        baseSkills: [
            { key: "computer_science", value: 60 },
            { key: "craft", value: 30, typeNameDefault: "Electrician", id:"craft_elec", type:true },
            { key: "craft", value: 30, typeNameDefault: "Mechanic", id:"craft_mech", type:true },
            { key: "craft", value: 40, typeNameDefault: "Microelectronics", id:"craft_micro", type:true },
            { key: "science", value: 40, typeNameDefault: "Mathematics", id:"sci_math", type:true },
            { key: "sigint", value: 40 }
        ],
        choiceSkills: {
            count: 4,
            options: [
                { key: "accounting", value: 50 }, { key: "bureaucracy", value: 50 },
                { key: "craft", value: 40, type: true, id:"craft_choice" },
                { key: "foreign_language", value: 40, type: true, id:"fl_cs" },
                { key: "heavy_machinery", value: 50 }, { key: "law", value: 40 },
                { key: "science", value: 40, type: true, id:"sci_choice" }
            ]
        }
    },
    "federal_agent": {
        nameKey: "profession_federal_agent_name",
        bonds: 3,
        baseSkills: [
            { key: "alertness", value: 50 }, { key: "bureaucracy", value: 40 },
            { key: "criminology", value: 50 }, { key: "drive", value: 50 },
            { key: "firearms", value: 50 }, { key: "forensics", value: 30 },
            { key: "humint", value: 60 }, { key: "law", value: 30 },
            { key: "persuade", value: 50 }, { key: "search", value: 50 },
            { key: "unarmed_combat", value: 60 }
        ],
        choiceSkills: {
            count: 1,
            options: [
                { key: "accounting", value: 60 }, { key: "computer_science", value: 50 },
                { key: "foreign_language", value: 50, type: true, id: "fl_fed" },
                { key: "heavy_weapons", value: 50 }, { key: "pharmacy", value: 50 }
            ]
        }
    },
    "physician": {
        nameKey: "profession_physician_name",
        bonds: 3,
        baseSkills: [
            { key: "bureaucracy", value: 50 }, { key: "first_aid", value: 60 },
            { key: "medicine", value: 60 }, { key: "persuade", value: 40 },
            { key: "pharmacy", value: 50 },
            { key: "science", value: 60, typeNameDefault: "Biology", id:"sci_bio", type:true },
            { key: "search", value: 40 }
        ],
        choiceSkills: {
            count: 2,
            options: [
                { key: "forensics", value: 50 }, { key: "psychotherapy", value: 60 },
                { key: "science", value: 50, type: true, id:"sci_choice_phy" },
                { key: "surgery", value: 50 }
            ]
        }
    },
    "scientist": {
        nameKey: "profession_scientist_name",
        bonds: 4,
        baseSkills: [
            { key: "bureaucracy", value: 40 }, { key: "computer_science", value: 40 },
            { key: "science", value: 60, type: true, id:"sci1" },
            { key: "science", value: 50, type: true, id:"sci2" },
            { key: "science", value: 50, type: true, id:"sci3" }
        ],
        choiceSkills: {
            count: 3,
            options: [
                { key: "accounting", value: 50 }, { key: "craft", value: 40, type: true, id:"craft_sci" },
                { key: "foreign_language", value: 40, type: true, id:"fl_sci" },
                { key: "forensics", value: 40 }, { key: "law", value: 40 },
                { key: "pharmacy", value: 40 }
            ]
        }
    },
    "special_operator": {
        nameKey: "profession_special_operator_name",
        bonds: 2,
        baseSkills: [
            { key: "alertness", value: 60 }, { key: "athletics", value: 60 },
            { key: "demolitions", value: 40 }, { key: "firearms", value: 60 },
            { key: "heavy_weapons", value: 50 }, { key: "melee_weapons", value: 50 },
            { key: "military_science", value: 60, typeNameDefault: "Land", id:"ms_land", type:true },
            { key: "navigate", value: 50 }, { key: "stealth", value: 50 },
            { key: "survival", value: 50 }, { key: "swim", value: 50 },
            { key: "unarmed_combat", value: 60 }
        ],
        choiceSkills: null
    },
    "custom_profession": {
        nameKey: "profession_custom_build_name",
        isCustom: true
        // Bonds and skills are set dynamically
    }
};


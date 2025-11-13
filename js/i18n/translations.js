export const i18nData = {
     en: {
        "remaining_boost_pool_label": "Remaining Boost Points:",
        "confirm_incomplete_skill_boosts": "You have not distributed all {maxBoosts} skill boosts. Do you want to continue anyway?",
        "page_title": "Delta Green Agent Creator",
        "app_header": "Delta Green Agent Creation",
        "footer_text": "Published by arrangement with the Delta Green Partnership. The intellectual property known as Delta Green is a trademark and copyright owned by the Delta Green Partnership, who has licensed its use here. This includes allelements that are components of the Delta Green intellectual property.", // Slight change
        "btn_back_text": "Back",
        "btn_next_text": "Next",
        "btn_finish_text": "View Summary",
        "progress_bar_text": "Step {current} of {total}: {stepName}",
        "select_one_option": "-- Select One --",
        "specify_type_placeholder": "Specify type (e.g., Physics, French, Acting)",
        "choose_one_label": "Choose one",
        "choose_N_label": "Choose {N} of the following",

        "intro_quote_dg": "Crafting a Delta Green agent involves several key stages: selecting a profession and associated skills, defining core physical and mental statistics to calculate further attributes, and finally, establishing the agent's personal connections and driving motivations.",
        "intro_welcome_text": "Welcome to the Agent Dossier Creator for Delta Green. Proceed by clicking 'Next' to begin shaping your operative.",
        "step_name_0": "Introduction",
        "step_name_1": "Profession & Skills",
        "step_name_2": "Statistics",
        "step_name_3": "Derived Attributes",
        "step_name_4": "Bonds & Motivations",
        "step_name_5": "Summary",

        "step1_info1": "An agent's profession is foundational, influencing their skill set, initial number of interpersonal Bonds, available resources, and the scope of their authority and duties. The occupations listed below represent common backgrounds for Delta Green agents.",
        "step1_info2": "Each profession grants a specific list of skills with initial ratings that override the default base values. Beyond these professional skills, you have 8 points (each worth +20%) to distribute among any skills on your sheet. A single skill can receive multiple boosts, but no skill may exceed an initial rating of 80%.",
        "add_specialization_button_text": "Add Specialization for {skillName}",
"remove_button_title": "Remove this specialization",
        "step1_select_profession_label": "Step 1.1: Select a Profession",
        "step1_2_profession_specific_label": "Step 1.2: Profession-Specific Choices",
        "bonds_label": "Bonds", // This is a label, likely fine as is.
        "step1_increase_skills_label": "Step 1.3: Distribute Skill Boosts (8 available, +20% each)",
        "increases_chosen_label": "Boosts applied:",
        "alert_select_profession": "Please choose a profession to continue.",
        "alert_max_choices_reached": "You have reached the maximum of {N} selections for this category.",
        "alert_skill_increase_limit": "All 8 skill boosts have been allocated.",
        "alert_skill_max_value_reached": "This skill's rating cannot surpass 80% at character creation.",
        "alert_type_for_skill_needed": "A specific type is required for the skill \"{skillName}\".",

        "profession_anthropologist_name": "Anthropologist, Archaeologist, or Historian",
        "profession_computer_scientist_name": "Computer Scientist or Engineer",
        "profession_federal_agent_name": "Federal Agent",
        "profession_physician_name": "Physician",
        "profession_scientist_name": "Scientist",
        "profession_special_operator_name": "Special Operator",

        "skill_accounting_name": "Accounting", "skill_accounting_desc": "Understanding financial records, business practices, and uncovering fiscal irregularities.",
        "skill_alertness_name": "Alertness", "skill_alertness_desc": "Perceiving subtle details, potential threats, or noticing the unusual in one's surroundings.",
        "skill_anthropology_name": "Anthropology", "skill_anthropology_desc": "The academic study of human societies, cultures, and their development.",
        "skill_archeology_name": "Archeology", "skill_archeology_desc": "Investigating human history and prehistory through excavation and analysis of artifacts.",
        "skill_art_name": "Art", "skill_art_desc": "Proficiency in creating or performing a specific art form (e.g., Painting, Music, Theatre).",
        "skill_artillery_name": "Artillery", "skill_artillery_desc": "Operating and accurately deploying heavy-bore projectile weapons like mortars or missile launchers.",
        "skill_athletics_name": "Athletics", "skill_athletics_desc": "Physical prowess in activities requiring strength, agility, and coordination like running, jumping, or climbing.",
        "skill_bureaucracy_name": "Bureaucracy", "skill_bureaucracy_desc": "Navigating complex organizational structures, procedures, and influencing official channels.",
        "skill_computer_science_name": "Computer Science", "skill_computer_science_desc": "In-depth understanding of computer hardware, software, networks, and data analysis.",
        "skill_craft_name": "Craft", "skill_craft_desc": "Skill in a specific trade or manual creation (e.g., Mechanics, Electronics, Lockpicking).",
        "skill_criminology_name": "Criminology", "skill_criminology_desc": "Knowledge of criminal behavior, investigation techniques, and the workings of illegal enterprises.",
        "skill_demolitions_name": "Demolitions", "skill_demolitions_desc": "The safe and effective use of explosives for breaching, destruction, or creating diversions.",
        "skill_disguise_name": "Disguise", "skill_disguise_desc": "Altering one's appearance, voice, and mannerisms to convincingly impersonate someone else or create a false identity.",
        "skill_dodge_name": "Dodge", "skill_dodge_desc": "Reactively evading physical attacks or sudden hazards through quick reflexes.",
        "skill_drive_name": "Drive", "skill_drive_desc": "Operating ground vehicles like cars or motorcycles proficiently, especially under pressure.",
        "skill_firearms_name": "Firearms", "skill_firearms_desc": "Accurate and safe use of handguns, rifles, and shotguns in combat situations.",
        "skill_first_aid_name": "First Aid", "skill_first_aid_desc": "Providing immediate medical care to stabilize injuries and prevent further harm.",
        "skill_foreign_language_name": "Foreign Language", "skill_foreign_language_desc": "Fluency in a language other than one's native tongue (specify language).",
        "skill_forensics_name": "Forensics", "skill_forensics_desc": "Collecting, analyzing, and interpreting physical evidence from a scene using scientific methods.",
        "skill_heavy_machinery_name": "Heavy Machinery", "skill_heavy_machinery_desc": "Operating large or complex machinery such as construction equipment or industrial tools.",
        "skill_heavy_weapons_name": "Heavy Weapons", "skill_heavy_weapons_desc": "Proficient use of man-portable heavy armaments like machine guns or grenade launchers.",
        "skill_history_name": "History", "skill_history_desc": "Knowledge of past events, societies, and their significance (may require specialization).",
        "skill_humint_name": "HUMINT", "skill_humint_desc": "Human Intelligence: Gathering information through interpersonal contact, interviews, and interrogation.",
        "skill_law_name": "Law", "skill_law_desc": "Understanding legal systems, procedures, and using them to one's advantage or for investigation.",
        "skill_medicine_name": "Medicine", "skill_medicine_desc": "Advanced diagnosis, treatment of illnesses and injuries, beyond basic first aid.",
        "skill_melee_weapons_name": "Melee Weapons", "skill_melee_desc": "Effective use of hand-to-hand combat weapons like knives, clubs, or swords.", // Corrected key
        "skill_military_science_name": "Military Science", "skill_military_science_desc": "Knowledge of military tactics, strategy, organization, and culture (specify branch or focus).",
        "skill_navigate_name": "Navigate", "skill_navigate_desc": "Determining position and planning routes using maps, compasses, or other tools.",
        "skill_occult_name": "Occult", "skill_occult_desc": "Familiarity with esoteric lore, paranormal claims, secret societies, and arcane knowledge.",
        "skill_persuade_name": "Persuade", "skill_persuade_desc": "Influencing others' thoughts, decisions, or actions through argument, charm, or negotiation.",
        "skill_pharmacy_name": "Pharmacy", "skill_pharmacy_desc": "Understanding drugs, their effects, interactions, and preparation.",
        "skill_pilot_name": "Pilot", "skill_pilot_desc": "Operating and navigating aircraft, watercraft, or spacecraft (specify vehicle type).",
        "skill_psychotherapy_name": "Psychotherapy", "skill_psychotherapy_desc": "Diagnosing and treating mental health conditions and emotional distress.",
        "skill_ride_name": "Ride", "skill_ride_desc": "Skill in controlling and riding animals, typically horses or similar mounts.",
        "skill_science_name": "Science", "skill_science_desc": "Expertise in a specific scientific field (e.g., Biology, Chemistry, Physics).",
        "skill_search_name": "Search", "skill_search_desc": "Methodically finding hidden objects, information, or individuals in a given area.",
        "skill_sigint_name": "SIGINT", "skill_sigint_desc": "Signals Intelligence: Intercepting, analyzing, and decrypting electronic communications.",
        "skill_stealth_name": "Stealth", "skill_stealth_desc": "Moving悄悄地 and acting without being detected by sight or sound.",
        "skill_surgery_name": "Surgery", "skill_surgery_desc": "Performing invasive medical procedures to treat severe injuries or complex conditions.",
        "skill_survival_name": "Survival", "skill_survival_desc": "Sustaining oneself in hostile environments using knowledge of nature and improvisation.",
        "skill_swim_name": "Swim", "skill_swim_desc": "Proficiency in swimming, especially in challenging or dangerous water conditions.",
        "skill_unarmed_combat_name": "Unarmed Combat", "skill_unarmed_combat_desc": "Effectiveness in hand-to-hand fighting without weapons, incorporating various martial techniques.",
        "skill_unnatural_name": "Unnatural", "skill_unnatural_desc": "Grasping the sanity-shattering truths and entities that defy conventional understanding of reality.",

        //------------ Step 2 --------------
        "step2_info_stats": "An agent's six core statistics define their innate physical and mental capabilities. These values typically range from 3 to 18.",
        "stat_str_name": "Strength (STR)", "stat_str_desc": "Measures sheer physical force and brawn.",
        "stat_con_name": "Constitution (CON)", "stat_con_desc": "Indicates an agent's health, resilience, and stamina.",
        "stat_dex_name": "Dexterity (DEX)", "stat_dex_desc": "Reflects an agent's agility, coordination, and reaction speed.",
        "stat_int_name": "Intelligence (INT)", "stat_int_desc": "Represents an agent's reasoning, memory, and problem-solving ability.",
        "stat_pow_name": "Power (POW)", "stat_pow_desc": "Signifies willpower, mental fortitude, and psychic potential.",
        "stat_cha_name": "Charisma (CHA)", "stat_cha_desc": "Measures an agent's force of personality, persuasiveness, and social appeal.",
        "step2_select_array_label": "Step 2.1: Choose a Stat Array", // Modified to be more active
        "step2_assign_stats_label": "Step 2.2: Allocate the chosen values to your Statistics:", // Modified for clarity
        "step2_info_percentile": "For each statistic, note its percentile value (Stat Value × 5). If a statistic is notably low (below 9) or high (above 12), it's considered a distinguishing trait. Briefly describe this trait.", // Reworded
        "distinguishing_feature_label": "Defining Trait:", // Reworded
        "distinguishing_feature_placeholder": "e.g., Exceptionally Strong, Awkward, Sharp Witted, Easily Distracted", // New examples
        "alert_assign_all_stats": "Ensure a value is assigned to every statistic.",
        "alert_unique_stat_values": "Each value from the selected array must be assigned to only one statistic.",
        "step2_select_method_label": "Step 2.1: Choose Stat Generation Method",
        "stat_method_array": "Use Predefined Array",
        "stat_method_roll": "Roll Stats (4d6 drop lowest)",
        "step2_select_array_sublabel": "Select an Array:",
        "btn_roll_stats_text": "Roll New Stats",
        "rolled_values_label": "Your rolled values:",
        "click_to_roll_stats_label": "Click the button to roll your stats.",
        "step2_select_method_or_roll_label": "Please select a generation method and then an array, or roll your stats to proceed.",
        "stat_method_pointbuy": "Use Point Buy (72 Points)",
        "pointbuy_info_text": "Distribute {totalPoints} points among the six statistics. Each statistic must have a value between 3 and 18.",
        "pointbuy_points_remaining_label": "Points to Assign:", // Oder "Points Remaining:"
        "step2_assign_stats_label_or_features": "Step 2.2: Assign Values / Define Features", // Allgemeinerer Titel
        "step2_define_features_label": "Step 2.2: Define Distinguishing Features",
        "pointbuy_error_total_points": "You must assign exactly {total} points. You have currently assigned {spent}.",
        "pointbuy_error_stat_range": "Each statistic must be between 3 and 18 for Point Buy.",
        "pointbuy_points_summary_label": "Points Assigned: {spent} / {total}  (Points to Assign: {remaining})",
        "stat_method_manual": "Manual Entry",
        "manual_entry_info_text": "Enter values for each statistic directly. Each statistic must have a value between 3 and 18.",
        "manual_entry_error_stat_range": "For Manual Entry, each statistic must be between 3 and 18.",
        
        //------------ Step 3 --------------
        "step3_info_derived": "Derived attributes are secondary characteristics calculated using your agent's primary statistics.",
        "attr_hp_name": "Hit Points (HP)", "attr_hp_desc": "Indicate an agent's capacity to withstand physical damage. Calculated as (STR + CON) / 2, rounded up.",
        "attr_wp_name": "Willpower Points (WP)", "attr_wp_desc": "Represent an agent's mental energy and resolve. This value is equal to their POW statistic.",
        "attr_san_name": "Sanity (SAN)", "attr_san_desc": "Measures an agent's grip on conventional reality. Calculated as POW × 5.",
        "attr_bp_name": "Breaking Point (BP)", "attr_bp_desc": "The Sanity threshold at which further trauma may induce a new mental disorder. Calculated as SAN - POW.",
        "derived_attributes_title": "Step 3: Derived Attributes",

        //------------ Step 4 --------------
        "step4_info_bonds_mot": "While your profession, skills, and statistics outline your agent's capabilities, their Bonds and Motivations give depth to who they are as an individual.",
        "step4_1_bonds_title": "Step 4.1: Define Bonds", // More active
        "step4_info_bonds1": "A Bond signifies a crucial human connection in your agent's life. Each Bond starts with a score equal to the agent's Charisma (CHA).",
        "step4_info_bonds2": "Professions with greater demands often limit the number of Bonds an agent can maintain. Initially, Bonds require just a name and the nature of the relationship.",
        "bond_examples_label": "Bond Examples:", // Reworded
        "bond_examples_list": "Partner or former partner; Child; Close friend; Trusted colleague; Members of a support network; A mentor figure.", // New examples
        "bond_name_label": "Bond Relationship", // Reworded
        "bond_score_label": "Initial Score", // Reworded
        "step4_2_motivations_title": "Step 4.2: Establish Motivations (up to 5)", // More active
        "step4_info_motivations1": "Motivations are the personal beliefs, drives, or core principles that guide your agent. These can evolve as your agent's experiences shape them during play.",
        "step4_info_motivations2": "Should an agent's Sanity drop to their Breaking Point, one Motivation is typically replaced by a newly acquired mental disorder.",
        "motivation_label": "Motivation",
        "alert_define_bonds": "Please provide a brief description for each of your agent's Bonds.",

        //------------ Summary --------------
        "summary_label_name": "Name:",
        "summary_label_profession": "Profession:",
        "summary_label_employer": "Employer:",
        "summary_label_nationality": "Nationality:",
        "summary_label_sex": "Sex:",
        "summary_label_age_dob": "Age/D.O.B.:",
        "summary_label_education": "Education/Occupational History:",
        "summary_label_statistical_data": "Statistical Data",
        "summary_label_psychological_data": "Psychological Data",
        "summary_col_statistic": "Statistic",
        "summary_col_score": "Score",
        "summary_col_x5": "x5",
        "summary_col_features": "Distinguishing Features",
        "summary_label_physical_desc": "Physical Description",
        "summary_title": "Agent Dossier Summary", // Slightly reworded
        "summary_col_derived_attribute": "Attribute", // Neuer Key oder Wiederverwendung von summary_col_statistic
        "summary_col_maximum_value": "Maximum",     // Neuer Key
        "summary_col_current_value": "Current",
        "profession_label": "Profession",
        "statistics_label": "Statistics",
        "derived_attributes_label": "Derived Attributes",
        "skills_label": "Skills",
        "bonds_summary_label": "Bonds",
        "motivations_summary_label": "Motivations",
        "not_selected": "Not Yet Selected",
        "not_defined": "Not Yet Defined",
        "btn_print_summary": "Print Dossier", // Reworded
        "btn_download_txt": "Download as TXT",

        "summary_section_personal_details": "Personal Details",
        "summary_section_profession": "Profession",
        "summary_section_statistics": "Statistics",
        "summary_section_derived_attr": "Derived Attributes",
        "summary_section_skills": "Skills",
        "summary_section_bonds": "Bonds",
        "summary_section_motivations": "Motivations",

        "summary_placeholder_name": "Name: _______________",
        "summary_placeholder_age": "Age: __________",
        "summary_placeholder_sex": "Sex: __________",
        "summary_placeholder_employer": "Employer: ________________________",
        "summary_placeholder_nationality": "Nationality: _____________________",

        "profession_custom_build_name": "Custom Profession Build", // Reworded
        "custom_prof_title_bond_setup": "Custom Profession: Part 1 - Define Bonds & Base Skill Points", // Reworded
        "custom_prof_info_rules_title": "Guidelines for Creating a Custom Profession:", // Reworded
        "custom_prof_info_pick_skills": "Select ten core skills that define this new profession.",
        "custom_prof_info_divide_points": "You have <strong>{totalPoints}</strong> points (base 400, modified by Bonds) to allocate among these ten professional skills.",
        "custom_prof_info_add_to_start": "These allocated points are added to each skill's default starting (base) rating.",
        "custom_prof_info_rule_of_thumb": "As a general guideline, aim for professional skill ratings between 30% and 50% after adding these points.",
        "custom_prof_info_max_skill": "No skill chosen as professional can exceed 60% from this initial point allocation (base + allocated).",
        "custom_prof_info_default_bonds": "A custom profession starts with 3 Bonds by default.",
        "custom_prof_info_customize_bonds": "Adjust Bonds: Gain 50 professional skill points for each Bond removed (minimum 1). Lose 50 points for each Bond added (maximum 4).",
        "custom_prof_label_current_bonds": "Current Bonds:",
        "label_custom_profession_name": "Define Profession Name:", // Reworded
        "custom_prof_label_skill_point_budget": "Total Professional Skill Points:", // Reworded
        "custom_prof_btn_confirm_bonds": "Confirm Bonds & Continue to Skill Allocation", // Reworded
        "custom_prof_title_skill_allocation": "Custom Profession: Part 2 - Allocate Skill Points", // Reworded
        "custom_prof_info_skill_allocation": "Choose up to ten professional skills and assign your <strong>{currentBudget}</strong> skill points. Remember, no skill can exceed 60% (base + allocated). Points Remaining: <strong id='custom-skill-points-remaining'>{remainingPoints}</strong>",
        "custom_prof_skills_selected_label_prefix": "Professional Skills Chosen:", // Reworded
        "custom_prof_label_assign_points": "Allocate Points:", // Reworded
        "custom_prof_label_skill_total": "Resulting Total:", // Reworded
        "custom_prof_btn_confirm_skills": "Finalize Professional Skills", // Reworded
        "alert_max_10_custom_skills": "You must select 10 professional skills.", // Adjusted based on common interpretation
        "alert_distribute_all_custom_points": "All {totalBudget} professional skill points must be allocated. You have {remainingPoints} points left.",
        "alert_custom_skill_max_60": "The skill \"{skillName}\" cannot be raised above 60% through professional point allocation.",
        "alert_specify_type_for_custom_skill": "Please define a specific type for the custom professional skill \"{skillName}\".",
        // Note: The duplicate "step2_info_stats" and stat descriptions were already in your list. I've kept them.
        // If they are truly redundant and only one set is used, you can remove the duplicates.
        // I've assumed the second set of stat_..._desc is the one displayed in step 2.
        "step2_info_stats": "An agent's six statistics reflect his or her physical and mental abilities. Values range from 3 to 18.", // This key is duplicated, ensure only one is used or make them unique if context differs.
        
        "stat_str_name": "Strength (STR)", "stat_str_desc": "Measures raw physical might and lifting capacity.", // Slightly different from above
        "stat_con_name": "Constitution (CON)", "stat_con_desc": "Reflects health, resilience to harm, and endurance.", // Slightly different
        "stat_dex_name": "Dexterity (DEX)", "stat_dex_desc": "Denotes agility, hand-eye coordination, and reflexes.", // Slightly different
        "stat_int_name": "Intelligence (INT)", "stat_int_desc": "Governs reasoning, memory, intuition, and analytical skills.", // Slightly different
        "stat_pow_name": "Power (POW)", "stat_pow_desc": "Represents willpower, mental strength, and potential for unusual abilities.", // Slightly different
        "stat_cha_name": "Charisma (CHA)", "stat_cha_desc": "Indicates personal magnetism, leadership qualities, and social influence.", // Slightly different
        "step2_select_array_label": "Step 2.1: Select an array of values to distribute among these statistics.", // Reworded
        "step2_assign_stats_label": "Step 2.2: Assign the selected values to your Statistics:", // Reworded
        "step2_stat_value_label": "Value",
        "step2_stat_x5_label": "x5 Rating", // Reworded
        "step2_info_distinguishing_feature": "If a statistic's value is 8 or lower, or 13 or higher, it is particularly noteworthy. Provide a brief adjective or phrase to describe this characteristic.", // Reworded, slightly different thresholds if that was intended. The original was <9 or >12.
        "distinguishing_feature_label": "Defining Trait:", // Already reworded
        "distinguishing_feature_placeholder": "e.g., Hulking, Frail, Perceptive, Obsessive", // New examples
        "alert_select_stat_array": "You must first select a stat array.",
        "alert_assign_all_stats": "Please assign a value from the array to each statistic.",
        "alert_unique_stat_values": "Each value from the chosen stat array can only be used once per statistic assignment.",
        "stat_array_option_label": "{values}", // Slightly reworded placeholder text

        "step3_info_derived_title": "Step 3: Determine Derived Attributes", // More active
        "step3_info_derived_intro": "These attributes are directly calculated based on your agent's primary statistic scores, providing further definition to their capabilities.",
        "attr_hp_name": "Hit Points (HP)",
        "attr_hp_desc": "Represents an agent's ability to endure physical trauma. Calculated as (STR + CON) ÷ 2, rounding up.",
        "attr_wp_name": "Willpower Points (WP)",
        "attr_wp_desc": "Indicates mental resilience and the capacity to push through adversity. Equal to the POW score.",
        "attr_san_name": "Sanity (SAN)",
        "attr_san_desc": "Measures an agent's mental stability and connection to consensual reality. Calculated as POW × 5.",
        "attr_bp_name": "Breaking Point (BP)",
        "attr_bp_desc": "The Sanity level at which significant trauma risks inflicting a new, lasting mental disorder. Calculated as SAN - POW.",
        "derived_attribute_label": "Attribute",
        "derived_value_label": "Value",
        "derived_description_label": "Description",

        "step4_title_bonds_motivations": "Step 4: Detail Bonds and Motivations", // More active
        "step4_info_bonds_mot_intro": "Beyond capabilities, an agent is defined by their personal connections (Bonds) and their inner drives (Motivations). These elements add crucial depth to your character.",

        "step4_1_bonds_title": "Step 4.1: Establish Bonds", // More active
        "step4_info_bonds1": "Bonds represent the vital human connections in your agent's life. These can be specific individuals (like a spouse, child, or mentor) or tightly-knit groups (such as a former military unit or a close-knit family).",
        "step4_info_bonds2": "The initial score for each Bond is determined by the agent's Charisma (CHA). As a Bond's score decreases, the relationship it represents deteriorates.",
        "step4_info_bonds3": "The nature of an agent's profession can affect the number of Bonds they can realistically maintain. Refer to your chosen profession for the specific count, or the number you set if creating a custom one.",
        "step4_info_bonds4": "For now, each Bond needs a brief description identifying the person or group and the nature of the connection, e.g., “My estranged wife, Sarah” or “Sgt. Miller, my old squad leader.”",
        "bond_examples_label": "Illustrative Bond Examples:", // Reworded
        "bond_examples_list": "Spouse/Ex-spouse; Son/Daughter; Close sibling; Lifelong best friend; Key professional contact; Therapist; Family unit (e.g., spouse and children); Close-knit work team; Shared trauma survivors group.", // Reworded and expanded
        "bond_label_number": "Bond {number}",
        "bond_description_placeholder": "e.g., My partner, Alex Chen", // New example
        "bond_score_label": "Starting Score (CHA):",
        "num_bonds_for_profession": "Your chosen profession allows for {count} Bonds.",

        "step4_2_motivations_title": "Step 4.2: Define Motivations", // More active
        "step4_info_motivations1": "Motivations are the core beliefs, personal drives, or even obsessions that compel your agent. What truly makes them persevere? Is it a desire for knowledge, loyalty to a cause, a cherished hobby, or something more complex?",
        "step4_info_motivations2": "You can define up to five initial motivations. These may change or be replaced as your agent confronts the horrors of their work and their personality develops.",
        "step4_info_motivations3": "When an agent's Sanity reaches their Breaking Point due to trauma, a Motivation is usually replaced by a new mental disorder, reflecting the toll of their experiences.",
        "motivation_label_number": "Motivation {number}",
        "motivation_placeholder": "e.g., Uncover the truth, no matter the cost" // New example
    },
    de: {
        "page_title": "Delta Green Agenten-Ersteller",
        "app_header": "Delta Green Agenten Erstellung",
        // "footer_text": "Published by arrangement with the Delta Green Partnership. The intellectual property known as Delta Green is a trademark and copyright owned by the Delta Green Partnership, who has licensed its use here. The contents of this document are © Vardan Sharma, excepting those elements that are components of the Delta Green intellectual property.",
        "btn_back_text": "Zurück",
        "btn_next_text": "Weiter",
        "btn_finish_text": "Zusammenfassung ansehen",
        "progress_bar_text": "Schritt {current} von {total}: {stepName}",
        "select_one_option": "-- Bitte wählen --",
        "specify_type_placeholder": "Typ angeben (z.B. Physik, Französisch, Schauspiel)",
        "choose_one_label": "Wähle eine Option",
        "choose_N_label": "Wähle {N} der folgenden Optionen",
        "remaining_boost_pool_label": "Verbleibende Boost-Punkte:",

        "intro_quote_dg": "Die Erschaffung deines Delta Green Agenten umfasst mehrere Kernphasen: die Wahl eines Berufs und der damit verbundenen Fertigkeiten, die Festlegung der sechs primären Attribute zur Berechnung weiterer Werte und schließlich die Definition deiner persönlichen Beziehungen und Motivationen.",
        "intro_welcome_text": "Willkommen beim Agentenakten-Ersteller für Delta Green. Klicke auf 'Weiter', um mit der Gestaltung deines Agenten zu beginnen.",
        "step_name_0": "Einleitung",
        "step_name_1": "Beruf & Fertigkeiten",
        "step_name_2": "Attribute",
        "step_name_3": "Abgeleitete Werte",
        "step_name_4": "Beziehungen & Motivationen",
        "step_name_5": "Zusammenfassung",
        "confirm_incomplete_skill_boosts_de": "Du hast nicht alle {maxBoosts} Skill-Boosts verteilt. Möchtest du trotzdem fortfahren?",

        "step1_info1": "Dein Beruf ist grundlegend. Er beeinflusst deine Fertigkeiten, die anfängliche Anzahl deiner zwischenmenschlichen Beziehungen, verfügbare Ressourcen sowie den Umfang deiner Befugnisse und Pflichten. Die unten aufgeführten Berufe stellen gängige Hintergründe für Delta Green Agenten dar.",
        "step1_info2": "Jeder Beruf bringt eine spezifische Liste von Fertigkeiten mit Anfangswerten mit, die die Standard-Basiswerte ersetzen. Zusätzlich zu diesen professionellen Fertigkeiten kannst du 8 Punkte (jeder +20%) auf beliebige Fertigkeiten deines Charakterbogens verteilen. Eine einzelne Fertigkeit kann mehrfach verbessert werden, aber keine Fertigkeit darf zu Beginn einen Wert von 80% übersteigen.",
        "step1_select_profession_label": "Schritt 1.1: Beruf wählen",
        "step1_2_profession_specific_label": "Schritt 1.2: Berufsspezifische Optionen",
        "bonds_label": "Beziehungen",
        "step1_increase_skills_label": "Schritt 1.3: Fertigkeitsverbesserungen verteilen (8 verfügbar, je +20%)",
        "increases_chosen_label": "Verbesserungen angewendet:",
        "alert_select_profession": "Bitte wähle einen Beruf, um fortzufahren.",
        "alert_max_choices_reached": "Du hast das Maximum von {N} Auswahlmöglichkeiten für diese Kategorie erreicht.",
        "alert_skill_increase_limit": "Alle 8 Fertigkeitsverbesserungen wurden eingesetzt.",
        "alert_skill_max_value_reached": "Der Wert dieser Fertigkeit darf bei Charaktererschaffung 80% nicht übersteigen.",
        "alert_type_for_skill_needed": "Für die Fertigkeit \"{skillName}\" muss ein spezifischer Typ angegeben werden.",

        "profession_anthropologist_name": "Anthropologe, Archäologe oder Historiker",
        "profession_computer_scientist_name": "Informatiker oder Ingenieur",
        "profession_federal_agent_name": "Bundesagent",
        "profession_physician_name": "Arzt",
        "profession_scientist_name": "Wissenschaftler",
        "profession_special_operator_name": "Spezialeinsatzkraft",

        "add_specialization_button_text": "Spezialisierung für {skillName} hinzufügen",
"remove_button_title": "Diese Spezialisierung entfernen",

        "skill_accounting_name": "Buchhaltung", "skill_accounting_desc": "Verständnis von Finanzunterlagen, Geschäftspraktiken und Aufdeckung fiskalischer Unregelmäßigkeiten.",
        "skill_alertness_name": "Wachsamkeit", "skill_alertness_desc": "Wahrnehmung subtiler Details, potenzieller Bedrohungen oder das Bemerken von Ungewöhnlichem.",
        "skill_anthropology_name": "Anthropologie", "skill_anthropology_desc": "Die akademische Untersuchung menschlicher Gesellschaften, Kulturen und deren Entwicklung.",
        "skill_archeology_name": "Archäologie", "skill_archeology_desc": "Erforschung der Menschheitsgeschichte durch Ausgrabung und Analyse von Artefakten.",
        "skill_art_name": "Kunst", "skill_art_desc": "Fertigkeit in der Ausübung einer Kunstform (z.B. Malerei, Musik, Theater).",
        "skill_artillery_name": "Artillerie", "skill_artillery_desc": "Bedienung schwerer Projektilwaffen wie Mörser oder Raketenwerfer.",
        "skill_athletics_name": "Athletik", "skill_athletics_desc": "Körperliche Leistungsfähigkeit in Bereichen wie Laufen, Springen oder Klettern.",
        "skill_bureaucracy_name": "Bürokratie", "skill_bureaucracy_desc": "Navigation durch komplexe Organisationen und Beeinflussung offizieller Kanäle.",
        "skill_computer_science_name": "Informatik", "skill_computer_science_desc": "Tiefgehendes Wissen über Computer, Systeme und Datenanalyse.",
        "skill_craft_name": "Handwerk", "skill_craft_desc": "Geschick in einem spezifischen Handwerk (z.B. Mechanik, Elektronik, Schlossknacken).",
        "skill_criminology_name": "Kriminologie", "skill_criminology_desc": "Wissen über kriminelles Verhalten, Ermittlungsmethoden und konspirative Strukturen.",
        "skill_demolitions_name": "Sprengwesen", "skill_demolitions_desc": "Sicherer und effektiver Einsatz von Sprengstoffen.",
        "skill_disguise_name": "Verkleiden", "skill_disguise_desc": "Veränderung von Aussehen und Verhalten zur Tarnung oder Imitation.",
        "skill_dodge_name": "Ausweichen", "skill_dodge_desc": "Instinktives Entkommen vor physischen Angriffen oder Gefahren.",
        "skill_drive_name": "Fahren", "skill_drive_desc": "Sichere Steuerung von Kraftfahrzeugen, besonders unter Druck.",
        "skill_firearms_name": "Schusswaffen", "skill_firearms_desc": "Präziser und sicherer Umgang mit Handfeuerwaffen im Kampf.",
        "skill_first_aid_name": "Erste Hilfe", "skill_first_aid_desc": "Sofortige medizinische Versorgung zur Stabilisierung von Verletzungen.",
        "skill_foreign_language_name": "Fremdsprache", "skill_foreign_language_desc": "Beherrschung einer anderen Sprache (Sprache angeben).",
        "skill_forensics_name": "Forensik", "skill_forensics_desc": "Sammlung und Analyse von physischen Beweismitteln.",
        "skill_heavy_machinery_name": "Schwere Maschinen", "skill_heavy_machinery_desc": "Bedienung großer oder komplexer Maschinen (z.B. Baumaschinen).",
        "skill_heavy_weapons_name": "Schwere Waffen", "skill_heavy_weapons_desc": "Umgang mit tragbaren schweren Waffen wie Maschinengewehren.",
        "skill_history_name": "Geschichte", "skill_history_desc": "Wissen über vergangene Ereignisse und Gesellschaften (Spezialisierung möglich).",
        "skill_humint_name": "HUMINT", "skill_humint_desc": "Zwischenmenschlichen Interaktionen lesen und bewerten.",
        "skill_law_name": "Rechtswesen", "skill_law_desc": "Verständnis und Anwendung von Gesetzen und juristischen Prozessen.",
        "skill_medicine_name": "Medizin", "skill_medicine_desc": "Fortgeschrittene Diagnose und Behandlung von Krankheiten und Verletzungen.",
        "skill_melee_weapons_name": "Nahkampfwaffen", "skill_melee_weapons_desc": "Effektiver Einsatz von Waffen im Nahkampf (Messer, Schlagstöcke etc.).",
        "skill_military_science_name": "Militärwissenschaft", "skill_military_science_desc": "Kenntnisse über militärische Taktiken und Strukturen (Spezialisierung angeben).",
        "skill_navigate_name": "Navigation", "skill_navigate_desc": "Positionsbestimmung und Routenplanung mit Karten oder anderen Hilfsmitteln.",
        "skill_occult_name": "Okkultismus", "skill_occult_desc": "Wissen über esoterische Lehren, paranormale Phänomene und Geheimbünde.",
        "skill_persuade_name": "Überzeugen", "skill_persuade_desc": "Beeinflussung anderer durch Argumentation, Charme oder Verhandlung.",
        "skill_pharmacy_name": "Pharmazie", "skill_pharmacy_desc": "Kenntnisse über Medikamente, deren Wirkungen und Herstellung.",
        "skill_pilot_name": "Pilot", "skill_pilot_desc": "Steuerung von Luft-, Wasser- oder Raumfahrzeugen (Typ angeben).",
        "skill_psychotherapy_name": "Psychotherapie", "skill_psychotherapy_desc": "Diagnose und Behandlung von psychischen Erkrankungen.",
        "skill_ride_name": "Reiten", "skill_ride_desc": "Umgang mit und Reiten von Tieren, typischerweise Pferden.",
        "skill_science_name": "Wissenschaft", "skill_science_desc": "Expertise in einem spezifischen wissenschaftlichen Bereich (z.B. Biologie, Chemie).",
        "skill_search_name": "Suchen", "skill_search_desc": "Systematisches Auffinden versteckter Objekte, Informationen oder Personen.",
        "skill_sigint_name": "SIGINT", "skill_sigint_desc": "Fernmeldeaufklärung: Abfangen und Analysieren elektronischer Kommunikation.",
        "skill_stealth_name": "Heimlichkeit", "skill_stealth_desc": "Unauffälliges Bewegen und Handeln, um nicht entdeckt zu werden.",
        "skill_surgery_name": "Chirurgie", "skill_surgery_desc": "Durchführung invasiver medizinischer Eingriffe.",
        "skill_survival_name": "Überleben", "skill_survival_desc": "Sicherung des eigenen Überlebens in feindlichen Umgebungen.",
        "skill_swim_name": "Schwimmen", "skill_swim_desc": "Fortbewegung im Wasser, besonders unter schwierigen Bedingungen.",
        "skill_unarmed_combat_name": "Unbewaffneter Kampf", "skill_unarmed_combat_desc": "Effektive Selbstverteidigung und Kampf ohne Waffen.",
        "skill_unnatural_name": "Das Unnatürliche", "skill_unnatural_desc": "Verständnis der fundamentalen, verstandeszerreißenden Geheimnisse der Realität.",

        "step2_info_stats": "Die sechs Kernattribute deines Agenten definieren seine angeborenen physischen und mentalen Kapazitäten. Diese Werte liegen typischerweise zwischen 3 und 18.",
        "stat_str_name": "Stärke (ST)", "stat_str_desc": "Misst reine physische Kraft und Körperstärke.",
        "stat_con_name": "Konstitution (KO)", "stat_con_desc": "Zeigt deine Gesundheit, Widerstandsfähigkeit und Ausdauer an.",
        "stat_dex_name": "Geschicklichkeit (GE)", "stat_dex_desc": "Spiegelt deine Agilität, Koordination und Reaktionsgeschwindigkeit wider.",
        "stat_int_name": "Intelligenz (IN)", "stat_int_desc": "Repräsentiert deine Denkfähigkeit, dein Gedächtnis und deine Problemlösungskompetenz.",
        "stat_pow_name": "Willenskraft (WK)", "stat_pow_desc": "Bedeutet Willensstärke, mentale Widerstandskraft und psychisches Potenzial.",
        "stat_cha_name": "Charisma (CH)", "stat_cha_desc": "Misst deine Persönlichkeitsstärke, Überzeugungskraft und soziale Ausstrahlung.",
        "step2_select_array_label": "Schritt 2.1: Attributwerte-Gruppe wählen",
        "step2_assign_stats_label": "Schritt 2.2: Gewählte Werte deinen Attributen zuweisen:",
        "step2_info_percentile": "Notiere für jedes Attribut dessen Prozentwert (Attributwert × 5). Ist ein Attribut auffallend niedrig (unter 9) oder hoch (über 12), gilt es als dein hervorstechendes Merkmal. Beschreibe dieses kurz.",
        "distinguishing_feature_label": "Prägendes Merkmal:",
        "distinguishing_feature_placeholder": "z.B. Drahtig, Unbeholfen, Scharfsinnig, Zerstreut",
        "alert_assign_all_stats": "Stelle sicher, dass du jedem Attribut einen Wert zugewiesen hast.",
        "alert_unique_stat_values": "Jeder Wert aus der gewählten Gruppe darf nur einmal einem Attribut zugewiesen werden.",
        "step2_select_method_label": "Schritt 2.1: Methode zur Attributgenerierung wählen",
        "stat_method_array": "Vordefinierte Wertegruppe nutzen",
        "stat_method_roll": "Attribute auswürfeln (4W6, niedrigster Wurf gestrichen)",
        "step2_select_array_sublabel": "Wertegruppe auswählen:", // Neuer Key, falls du den Sub-Header verwendest
        "btn_roll_stats_text": "Neue Attribute auswürfeln",
        "rolled_values_label": "Deine ausgewürfelten Werte:",
        "click_to_roll_stats_label": "Klicke auf den Button, um deine Attribute auszuwürfeln.",
        "step2_select_method_or_roll_label": "Bitte wähle eine Generierungsmethode und dann eine Wertegruppe, oder würfle deine Attribute aus, um fortzufahren.",
        "pointbuy_points_summary_label": "Punkte zugewiesen: {spent} / {total} (Punkte zu verteilen: {remaining})",
        "step2_select_method_label": "Schritt 2.1: Methode zur Attributgenerierung wählen",
        "stat_method_array": "Vordefinierte Wertegruppe nutzen",
        "stat_method_roll": "Attribute auswürfeln (4W6, niedrigster Wurf gestrichen)",
        "stat_method_pointbuy": "Punktesystem nutzen (72 Punkte)",
        "stat_method_manual": "Manuelle Eingabe",
        "step2_select_array_sublabel": "Wertegruppe auswählen:",
        "btn_roll_stats_text": "Neue Attribute auswürfeln",
        "rolled_values_label": "Deine ausgewürfelten Werte:",
        "click_to_roll_stats_label": "Klicke auf den Button, um deine Attribute auszuwürfeln.",
        "step2_select_method_prompt": "Bitte wähle eine Methode zur Attributgenerierung, um fortzufahren.", // Neuer Key
        "pointbuy_info_text": "Verteile {totalPoints} Punkte auf die sechs Attribute. Jedes Attribut muss einen Wert zwischen 3 und 18 haben.",
        "pointbuy_points_summary_label": "Punkte zugewiesen: {spent} / {total} (Punkte zu verteilen: {remaining})",
        "step2_assign_stats_label_or_features": "Schritt 2.2: Werte Zuweisen / Merkmale Definieren", // Allgemeiner, wird dynamisch angepasst
        "step2_define_features_label": "Schritt 2.2: Prägende Merkmale definieren",
        "manual_entry_info_text": "Gib Werte für jedes Attribut direkt ein. Jeder Attributwert muss zwischen 3 und 18 liegen.",
        "alert_select_stat_method": "Bitte wähle eine Methode zur Attributgenerierung.",
        "pointbuy_error_total_points": "Du musst exakt {total} Punkte zuweisen. Aktuell sind es {spent}.",
        "pointbuy_error_stat_range": "Jedes Attribut muss beim Punktesystem einen Wert zwischen 3 und 18 haben.",
        "manual_entry_error_stat_range": "Bei manueller Eingabe muss jedes Attribut einen Wert zwischen 3 und 18 haben.",

        "step3_info_derived": "Abgeleitete Werte sind sekundäre Eigenschaften, die aus deinen Primärattributen berechnet werden.",
        "attr_hp_name": "Trefferpunkte (TP)", "attr_hp_desc": "Geben deine Fähigkeit an, physischen Schaden zu widerstehen. Berechnet als (ST + KO) / 2, aufgerundet.",
        "attr_wp_name": "Willenskraftpunkte (WP)", "attr_wp_desc": "Repräsentieren deine mentale Energie und Entschlossenheit. Dieser Wert entspricht deinem WK-Attribut.",
        "attr_san_name": "Stabilität (STA)", "attr_san_desc": "Misst deinen Bezug zur konventionellen Realität. Berechnet als WK × 5.",
        "attr_bp_name": "Belastungsgrenze (BG)", "attr_bp_desc": "Der Stabilitäts-Schwellenwert, bei dem weiteres Trauma eine neue psychische Störung bei dir auslösen kann. Berechnet als STA - WK.",
        "derived_attributes_title": "Schritt 3: Abgeleitete Werte",

        "step4_info_bonds_mot": "Während Beruf, Fertigkeiten und Attribute deine Fähigkeiten umreißen, verleihen dir deine Beziehungen und Motivationen als Individuum Tiefe.",
        "step4_1_bonds_title": "Schritt 4.1: Beziehungen definieren",
        "step4_info_bonds1": "Eine Beziehung stellt eine entscheidende menschliche Verbindung in deinem Leben dar. Jede Beziehung beginnt mit einem Wert, der deinem Charisma (CH) entspricht.",
        "step4_info_bonds2": "Anspruchsvolle Berufe schränken oft die Anzahl der Beziehungen ein, die du pflegen kannst. Zu Beginn benötigen deine Beziehungen nur einen Namen und die Art der Beziehung.",
        "bond_examples_label": "Beispiele für Beziehungen:",
        "bond_examples_list": "Partner/Ex-Partner; Kind; Enger Freund; Vertrauter Kollege; Mitglieder deines Unterstützungsnetzwerks; Eine Mentorenfigur.",
        "bond_name_label": "Beziehungsbeschreibung",
        "bond_score_label": "Anfangswert",
        "step4_2_motivations_title": "Schritt 4.2: Motivationen festlegen (bis zu 5)",
        "step4_info_motivations1": "Motivationen sind deine persönlichen Überzeugungen, Antriebe oder Kernprinzipien, die dich leiten. Diese können sich entwickeln, während deine Erfahrungen dich im Spiel formen.",
        "step4_info_motivations2": "Sollte deine Stabilität auf deine Belastungsgrenze fallen, wird typischerweise eine deiner Motivationen durch eine neu erworbene psychische Störung ersetzt.",
        "motivation_label": "Motivation",
        "alert_define_bonds": "Bitte gib für jede deiner Beziehungen eine kurze Beschreibung an.",

        //------------ Summary / Zusammenfassung (Schritt 5) --------------
        "summary_title": "Zusammenfassung deiner Agentenakte", // War schon da, ggf. prüfen
        "profession_label": "Beruf", // War schon da
        "statistics_label": "Attribute", // War schon da
        "derived_attributes_label": "Abgeleitete Werte", // War schon da
        "skills_label": "Fertigkeiten", // War schon da
        "bonds_summary_label": "Beziehungen", // War schon "Beziehungen"
        "motivations_summary_label": "Motivationen", // War schon da
        "not_selected": "Noch nicht gewählt", // War schon da
        "not_defined": "Noch nicht definiert", // War schon da
        "btn_print_summary": "Akte drucken", // War schon da
        "btn_download_pdf": "Als PDF herunterladen", // NEU (für den PDF-Button)

        "summary_section_personal_details": "Persönliche Daten", // War schon da
        "summary_section_profession": "Beruf", // War schon da
        "summary_section_statistics": "Attribute", // War schon da (hieß vorher Statistics)
        "summary_section_derived_attr": "Abgeleitete Werte", // War schon da
        "summary_section_skills": "Fertigkeiten", // War schon da
        "summary_section_bonds": "Beziehungen", // War schon da (hieß vorher Bonds)
        "summary_section_motivations": "Motivationen", // War schon da

        // Platzhalter-Texte und Labels für die Zusammenfassung
        "summary_placeholder_name": "Name: _______________", // War schon da
        "summary_label_name": "Name:", // NEU (für die Struktur mit starkem Label)
        "summary_placeholder_age": "Alter: __________", // War schon da
        "summary_label_age_dob": "Alter/Geb.Dat.:", // NEU (Kombiniert)
        "summary_placeholder_sex": "Geschlecht: __________", // War schon da
        "summary_label_sex": "Geschlecht:", // NEU
        "summary_placeholder_employer": "Arbeitgeber: ________________________", // War schon da
        "summary_label_employer": "Arbeitgeber:", // NEU
        "summary_placeholder_nationality": "Nationalität: _____________________", // War schon da
        "summary_label_nationality": "Nationalität:", // NEU
        "summary_label_profession": "Beruf:", // NEU (war vorher Teil von summary_section_profession)
        "summary_label_education": "Ausbildung/Berufserfahrung:", // NEU
        "summary_label_statistical_data": "Statistische Daten", // NEU
        "summary_label_psychological_data": "Psychologische Daten", // NEU
        "summary_col_statistic": "Attribut", // NEU (für Tabellenkopf)
        "summary_col_score": "Wert", // NEU (für Tabellenkopf)
        "summary_col_x5": "x5", // NEU (für Tabellenkopf)
        "summary_col_features": "Prägende Merkmale", // NEU (für Tabellenkopf)
        "summary_col_derived_attribute": "Abgeleiteter Wert", // NEU (für Tabellenkopf)
        "summary_col_maximum_value": "Maximum", // NEU (für Tabellenkopf)
        "summary_col_current_value": "Aktuell", // NEU (für Tabellenkopf)
        "summary_label_physical_desc": "Äußere Beschreibung", // NEU
        "no_skills_available": "Keine Fertigkeiten verfügbar.", // NEU
        "summary_title": "Zusammenfassung deiner Agentenakte",
        "profession_label": "Beruf",
        "statistics_label": "Attribute",
        "derived_attributes_label": "Abgeleitete Werte",
        "skills_label": "Fertigkeiten",
        "bonds_summary_label": "Beziehungen",
        "motivations_summary_label": "Motivationen",
        "not_selected": "Noch nicht gewählt",
        "not_defined": "Noch nicht definiert",
        "btn_print_summary": "Akte drucken",
        "btn_download_txt": "Als TXT herunterladen",

        "summary_section_personal_details": "Persönliche Daten",
        "summary_section_profession": "Beruf",
        "summary_section_statistics": "Attribute",
        "summary_section_derived_attr": "Abgeleitete Werte",
        "summary_section_skills": "Fertigkeiten",
        "summary_section_bonds": "Beziehungen",
        "summary_section_motivations": "Motivationen",

        "summary_placeholder_name": "Name: _______________",
        "summary_placeholder_age": "Alter: __________",
        "summary_placeholder_sex": "Geschlecht: __________",
        "summary_placeholder_employer": "Arbeitgeber: ________________________",
        "summary_placeholder_nationality": "Nationalität: _____________________",

        "profession_custom_build_name": "Eigenen Beruf erstellen",
        "label_custom_profession_name": "Benenne deinen Beruf:",
        "custom_prof_title_bond_setup": "Eigener Beruf: Teil 1 - Beziehungen & Fertigkeitspunkte definieren",
        "custom_prof_info_rules_title": "Richtlinien zur Erstellung deines eigenen Berufs:",
        "custom_prof_info_pick_skills": "Wähle zehn Kernfertigkeiten, die diesen neuen Beruf definieren.",
        "custom_prof_info_divide_points": "Du hast <strong>{totalPoints}</strong> Punkte (Basis 400, durch Beziehungen modifiziert) zur Verteilung auf diese zehn Berufsfertigkeiten.",
        "custom_prof_info_add_to_start": "Wähle jetzt deine Berufsfertigkeiten und weise ihnen Punkte zu. Die zugewiesenen Punkte werden zum Standard-Anfangswert (Basiswert) jeder Fertigkeit addiert.",
        "custom_prof_info_rule_of_thumb": "Als allgemeine Richtlinie sollten deine Berufsfertigkeiten nach Hinzufügung dieser Punkte zwischen 30% und 50% liegen.",
        "custom_prof_info_max_skill": "Keine als beruflich gewählte Fertigkeit darf durch diese anfängliche Punktevergabe 60% übersteigen (Basis + zugewiesene Punkte).",
        "custom_prof_info_default_bonds": "Ein eigener Beruf beginnt standardmäßig mit 3 Beziehungen.",
        "custom_prof_info_customize_bonds": "Passe deine Beziehungen an: Erhalte 50 Berufsfertigkeitspunkte für jede entfernte Beziehung (Minimum 1). Verliere 50 Punkte für jede hinzugefügte Beziehung (Maximum 4).",
        "custom_prof_label_current_bonds": "Deine aktuellen Beziehungen:",
        "custom_prof_label_skill_point_budget": "Deine gesamten Berufsfertigkeitspunkte:",
        "custom_prof_btn_confirm_bonds": "Beziehungen bestätigen & Weiter zur Fertigkeitszuweisung",
        "custom_prof_title_skill_allocation": "Eigener Beruf: Teil 2 - Fertigkeitspunkte zuweisen",
        "custom_prof_info_skill_allocation": "Wähle bis zu zehn Berufsfertigkeiten und verteile deine <strong>{currentBudget}</strong> Fertigkeitspunkte. Denke daran, keine Fertigkeit darf 60% übersteigen (Basis + zugewiesen). Verbleibende Punkte: <strong id='custom-skill-points-remaining'>{remainingPoints}</strong>",
        "custom_prof_skills_selected_label_prefix": "Deine gewählten Berufsfertigkeiten:",
        "custom_prof_label_assign_points": "Punkte zuweisen:",
        "custom_prof_label_skill_total": "Resultierender Gesamtwert:",
        "custom_prof_btn_confirm_skills": "Berufsfertigkeiten bestätigen",
        "alert_max_10_custom_skills": "Du musst 10 Berufsfertigkeiten wählen.",
        "alert_distribute_all_custom_points": "Alle {totalBudget} Berufsfertigkeitspunkte müssen zugewiesen werden. Du hast noch {remainingPoints} Punkte übrig.",
        "alert_custom_skill_max_60": "Die Fertigkeit \"{skillName}\" kann durch Zuweisung von Berufsfertigkeitspunkten nicht über 60% erhöht werden.",
        "alert_specify_type_for_custom_skill": "Bitte definiere einen spezifischen Typ für deine eigene Berufsfertigkeit \"{skillName}\".",

        "step2_select_array_label": "Schritt 2.1: Eine Gruppe von Werten wählen, um sie auf deine Attribute zu verteilen.",
        "step2_assign_stats_label": "Schritt 2.2: Die gewählten Werte deinen Attributen zuweisen:",
        "step2_stat_value_label": "Wert",
        "step2_stat_x5_label": "x5 Wert",
        "step2_info_distinguishing_feature": "Wenn der Wert eines deiner Attribute 8 oder niedriger bzw. 13 oder höher ist, ist es besonders bemerkenswert. Gib ein kurzes Adjektiv oder eine Phrase zur Beschreibung dieser Eigenschaft an.",
        "alert_select_stat_array": "Du musst zuerst eine Attributwerte-Gruppe auswählen.",
        "alert_assign_all_stats": "Bitte weise jedem deiner Attribute einen Wert aus der Gruppe zu.",
        "alert_unique_stat_values": "Jeder Wert aus der gewählten Attributwerte-Gruppe darf nur einmal für die Attribute verwendet werden.",
        "stat_array_option_label": "{values}",

        "step3_info_derived_title": "Schritt 3: Abgeleitete Werte bestimmen",
        "step3_info_derived_intro": "Diese Werte werden direkt auf Basis deiner Primärattribute berechnet und definieren deine Fähigkeiten weiter.",
        "attr_hp_desc": "Stellt deine Fähigkeit dar, körperliches Trauma zu ertragen. Berechnet als (ST + KO) ÷ 2, aufgerundet.",
        "attr_wp_desc": "Zeigt deine mentale Widerstandsfähigkeit und die Fähigkeit, Widrigkeiten zu überwinden. Entspricht deinem WK-Wert.",
        "attr_san_desc": "Misst deine mentale Stabilität und deine Verbindung zur allgemeinen Realität. Berechnet als WK × 5.",
        "attr_bp_desc": "Das Stabilitätsniveau, bei dem erhebliches Trauma eine neue, bleibende psychische Störung bei dir verursachen kann. Berechnet als STA - WK.",
        "derived_attribute_label": "Abgeleiteter Wert",
        "derived_value_label": "Wert",
        "derived_description_label": "Beschreibung",

        "step4_title_bonds_motivations": "Schritt 4: Beziehungen und Motivationen detaillieren",
        "step4_info_bonds_mot_intro": "Über die reinen Fähigkeiten hinaus wirst du durch deine persönlichen VerBeziehungen (Beziehungen) und deine inneren Antriebe (Motivationen) definiert. Diese Elemente verleihen deinem Charakter entscheidende Tiefe.",

        "step4_1_bonds_title": "Schritt 4.1: Beziehungen festlegen",
        "step4_info_bonds1": "Beziehungen repräsentieren die wichtigsten menschlichen Beziehungen in deinem Leben. Dies können bestimmte Personen (wie Ehepartner, Kind oder Mentor) oder eng verbundene Gruppen sein (wie eine ehemalige Militäreinheit oder deine Familie).",
        "step4_info_bonds2": "Der Anfangswert jeder Beziehung wird durch dein Charisma (CH) bestimmt. Sinkt der Wert einer Beziehung, verschlechtert sich die Beziehung, die sie darstellt.",
        "step4_info_bonds3": "Die Art deines Berufs kann die Anzahl der Beziehungen beeinflussen, die du realistischerweise aufrechterhalten kannst. Die genaue Anzahl entnimmst du deinem gewählten Beruf oder der von dir festgelegten Zahl, falls du einen eigenen Beruf erstellst.",
        "step4_info_bonds4": "Vorerst benötigt jede Beziehung eine kurze Beschreibung, die die Person oder Gruppe und die Art eurer Verbindung identifiziert, z.B. „Meine entfremdete Frau, Sarah“ oder „Sgt. Miller, mein alter Truppführer.“",
        "bond_examples_label": "Veranschaulichende Beispiele für Beziehungen:",
        "bond_examples_list": "Ehepartner/Ex-Partner; Sohn/Tochter; Enges Geschwisterkind; Bester Freund/Beste Freundin seit Langem; Wichtiger beruflicher Kontakt; Therapeut; Familieneinheit (z.B. Partner und Kinder); Eng verbundenes Arbeitsteam; Gruppe von Überlebenden eines gemeinsamen Traumas.",
        "bond_label_number": "Beziehung {number}",
        "bond_description_placeholder": "z.B. Mein Partner, Alex Chen",
        "bond_score_label": "Anfangswert (CH):",
        "num_bonds_for_profession": "Dein gewählter Beruf ermöglicht {count} Beziehungen.",

        "step4_2_motivations_title": "Schritt 4.2: Motivationen definieren",
        "step4_info_motivations1": "Motivationen sind deine Kernüberzeugungen, persönlichen Antriebe oder sogar Obsessionen, die dich bewegen. Was treibt dich wirklich an? Ist es Wissensdurst, Loyalität zu einer Sache, ein geschätztes Hobby oder etwas Komplexeres?",
        "step4_info_motivations2": "Du kannst bis zu fünf anfängliche Motivationen definieren. Diese können sich ändern oder ersetzt werden, wenn du mit den Schrecken deiner Arbeit konfrontiert wirst und sich deine Persönlichkeit entwickelt.",
        "step4_info_motivations3": "Wenn deine Stabilität aufgrund eines Traumas deine Belastungsgrenze erreicht, wird eine deiner Motivationen üblicherweise durch eine neue psychische Störung ersetzt, was den Tribut deiner Erfahrungen widerspiegelt.",
        "motivation_label_number": "Motivation {number}",
        "motivation_placeholder": "z.B. Die Wahrheit aufdecken, egal was es kostet"
    }
};

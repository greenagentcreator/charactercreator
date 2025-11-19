export const i18nData = {
     en: {
        "remaining_boost_pool_label": "Remaining Boost Points:",
        "confirm_incomplete_skill_boosts": "You have not distributed all {maxBoosts} skill boosts. Do you want to continue anyway?",
        "page_title": "Delta Green Agent Creator",
        "app_header": "Delta Green Agent Creation",
        "footer_feedback_text": "Have feedback or found a bug? Let me know on",
        "footer_feedback_link": "Reddit",
        "footer_text": "Published by arrangement with the Delta Green Partnership. The intellectual property known as Delta Green is a trademark and copyright owned by the Delta Green Partnership, who has licensed its use here. This includes allelements that are components of the Delta Green intellectual property.", // Slight change
        "btn_back_text": "Back",
        "btn_next_text": "Next",
        "btn_finish_text": "View Summary",
        "btn_back_to_home": "Back to Home",
        "progress_bar_text": "Step {current} of {total}: {stepName}",
        "select_one_option": "-- Select One --",
        "specify_type_placeholder": "Specify type (e.g., Physics, French, Acting)",
        "choose_one_label": "Choose one",
        "choose_N_label": "Choose {N} of the following",

        "intro_quote_dg": "Crafting a Delta Green agent involves several key stages: selecting a profession and associated skills, defining core physical and mental statistics to calculate further attributes, and finally, establishing the agent's personal connections and driving motivations.",
        "intro_welcome_text": "Welcome to the Agent Dossier Creator for Delta Green. Proceed by clicking 'Next' to begin shaping your operative.",
        
        "banner_headline": "Are you a writer?",
        "banner_text": "Check out my new app <a href=\"https://writersalley.com\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"promo-banner-link\">WritersAlley.com</a> — a goal-based writing tracker that helps you stay on target.",
        "banner_cta": "Visit WritersAlley.com",
        "banner_dismiss": "Dismiss banner",
        
        "aria_skill_increase": "Increase {skillName} by {amount}%",
        "aria_skill_decrease": "Decrease {skillName} by {amount}%",
        "aria_custom_skill_increase": "Increase skill points by {amount}",
        "aria_custom_skill_decrease": "Decrease skill points by {amount}",
        "aria_roll_stats": "Roll new statistics values",
        "aria_share_character": "Share character, copies link to clipboard",
        "aria_print_summary": "Print character summary",
        "aria_export_json": "Export character as JSON file",
        "aria_view_character": "View character {name}",
        "aria_delete_character": "Delete character {name}",
        "aria_edit_name": "Edit name of character {name}",
        "aria_import_character": "Import character from JSON file",
        "aria_load_from_database": "Import character {name} from database",
        "aria_report_character": "Report inappropriate character {name}",
        "aria_back_to_list": "Return to character list",
        
        "step_name_0": "Introduction",
        "step_name_1": "Profession & Skills",
        "step_name_2": "Statistics",
        "step_name_3": "Derived Attributes",
        "step_name_4": "Bonds & Motivations",
        "step_name_4_3": "Traumatic Background",
        "step_name_5_personal": "Personal Information",
        "step_name_5": "Summary",

        "step1_info1": "An agent's profession is foundational, influencing their skill set, initial number of interpersonal Bonds, available resources, and the scope of their authority and duties. The occupations listed below represent common backgrounds for Delta Green agents.",
        "step1_info2": "Each profession grants a specific list of skills with initial ratings that override the default base values. Beyond these professional skills, you have 8 points (each worth +20%) to distribute among any skills on your sheet. A single skill can receive multiple boosts, but no skill may exceed an initial rating of 80%.",
        "add_specialization_button_text": "Add Specialization for {skillName}",
        "add_another_specialization_button_text": "Add another {skillName}",
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
        "btn_export_json": "Export as JSON",
        "btn_download_txt": "Download as TXT",
        
        // Personal Information Step
        "step5_personal_info_title": "Personal Information",
        "step5_personal_info_description": "Please provide the following personal details for your agent.",
        "personal_info_name_label": "Name",
        "personal_info_name_placeholder": "Enter agent name",
        "personal_info_employer_label": "Employer",
        "personal_info_employer_placeholder": "Enter employer",
        "personal_info_sex_label": "Sex",
        "personal_info_sex_placeholder": "Enter sex",
        "personal_info_nationality_label": "Nationality",
        "personal_info_nationality_placeholder": "Enter nationality",
        "personal_info_age_label": "Age",
        "personal_info_age_placeholder": "Enter age",
        "personal_info_dob_label": "Date of Birth",
        "personal_info_dob_placeholder": "Enter date of birth",
        
        // Character List
        "character_list_title": "Saved Characters",
        "no_characters_saved": "No characters have been saved yet.",
        "view_character": "View",
        "delete_character": "Delete",
        "rename_character": "Rename",
        "edit_name": "Edit name",
        "enter_new_name": "Enter new name:",
        "confirm_delete_character": "Are you sure you want to delete {name}?",
        "back_to_list": "Back to List",
        "character_not_found": "Character not found.",
        "storage_limit_reached": "Storage limit reached. Maximum {limit} characters can be saved. Please delete a character to save a new one.",
        
        // Sharing & Import
        "share_character": "Share Character",
        "share_url_copied": "Shareable link copied to clipboard!",
        "share_error": "Error creating shareable link",
        "import_character": "Import Character (JSON)",
        "import_success": "Character imported successfully!",
        "import_error": "Error importing character",
        "own_characters_title": "My Characters",
        "imported_characters_title": "Imported Characters",
        "characters_title": "Characters",
        "create_character": "Create Character",
        "imported_character_label": "Imported",
        "made_by_others_title": "Made by Others",
        "made_by_others_info": "Help keep this clean: Report unfinished characters or ones with offensive content and text. They will be removed immediately and reviewed eventually.",
        "made_by_others_filter_all": "All professions",
        "made_by_others_filter_custom": "Custom builds",
        "made_by_others_filter_empty": "No shared characters match this profession yet.",
        "made_by_others_filter_aria_label": "Filter community characters by profession",
        "load_from_database": "Import",
        "load_more_characters": "Load More",
        "loading": "Loading...",
        "load_more_error": "Error loading more characters",
        "upload_to_database": "Upload to Database",
        "uploading": "Uploading...",
        "upload_success": "Character uploaded successfully!",
        "upload_error": "Error uploading character",
        "upload_blocked_content": "Character contains prohibited content and cannot be uploaded.",
        "report_character": "Report",
        "report_reason_prompt": "Please provide a reason for reporting this character:",
        "report_success": "Thank you for reporting. The character has been flagged for review.",
        "report_error": "Error reporting character",
        "moderation_pending": "Pending Review",

        "summary_section_personal_details": "Personal Details",
        "summary_section_profession": "Profession",
        "summary_section_statistics": "Statistics",
        "summary_section_derived_attr": "Derived Attributes",
        "summary_section_skills": "Skills",
        "summary_section_bonds": "Bonds",
        "summary_section_motivations": "Motivations",
        "summary_section_traumatic_background": "Traumatic Background",

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
        "motivation_placeholder": "e.g., Uncover the truth, no matter the cost", // New example

        //------------ Step 4.3: Traumatic Background --------------
        "step4_3_traumatic_background_title": "Step 4.3: Traumatic Background (Optional)",
        "step4_3_traumatic_background_info": "If your Agent is new to Delta Green, you can skip this step. However, if your Agent is a veteran who has already encountered the unnatural horrors of Delta Green, you may select a traumatic background from the options below. Each traumatic background represents a significant past experience that has shaped your Agent and brought them deeper into Delta Green's world. These backgrounds modify your Agent's statistics, skills, and Sanity, reflecting the lasting impact of their traumatic experiences. Work with your Handler to determine the specific details of what happened and how it led your Agent to Delta Green.",
        "step4_traumatic_background_warning": "Please consult your Handler before selecting a traumatic background.",
        "traumatic_background_none": "None",
        "traumatic_background_extreme_violence": "Extreme Violence",
        "traumatic_background_extreme_violence_desc": "+10% to Occult; -5 SAN; -3 CHA (reduces each Bond by 3). You are Adapted to Violence.",
        "traumatic_background_captivity": "Captivity or Imprisonment",
        "traumatic_background_captivity_desc": "+10% to Occult; -5 SAN; -3 POW (does not affect SAN). You are Adapted to helplessness.",
        "traumatic_background_hard_experience": "Hard Experience",
        "traumatic_background_hard_experience_desc": "+10% to Occult; -5 SAN; +10% to any four skills (except Unnatural). Remove one bond.",
        "traumatic_background_things_man": "Things Man Was Not Meant to Know",
        "traumatic_background_things_man_desc": "+20% to Occult; reduce SAN by POW; +10% Unnatural skill. Reset Breaking Point to new SAN minus POW. Gain a disorder caused by the Unnatural.",
        "hard_experience_skill_selection_label": "Select four skills to receive +10% (excluding Unnatural):",
        "hard_experience_skill_label": "Skill {number}:",
        "hard_experience_bond_removal_label": "Select a bond to remove:",
        "disorder_label": "Disorder:",
        "disorder_placeholder": "e.g., Paranoia, Obsession, etc."
    },
    de: {
        "page_title": "Delta Green Agenten-Ersteller",
        "app_header": "Delta Green Agenten Erstellung",
        "footer_feedback_text": "Hast du Feedback oder einen Fehler gefunden? Lass es mich auf",
        "footer_feedback_link": "Reddit",
        // "footer_text": "Published by arrangement with the Delta Green Partnership. The intellectual property known as Delta Green is a trademark and copyright owned by the Delta Green Partnership, who has licensed its use here. The contents of this document are © Vardan Sharma, excepting those elements that are components of the Delta Green intellectual property.",
        "btn_back_text": "Zurück",
        "btn_next_text": "Weiter",
        "btn_finish_text": "Zusammenfassung ansehen",
        "btn_back_to_home": "Zurück zur Startseite",
        "progress_bar_text": "Schritt {current} von {total}: {stepName}",
        "select_one_option": "-- Bitte wählen --",
        "specify_type_placeholder": "Typ angeben (z.B. Physik, Französisch, Schauspiel)",
        "choose_one_label": "Wähle eine Option",
        "choose_N_label": "Wähle {N} der folgenden Optionen",
        "remaining_boost_pool_label": "Verbleibende Boost-Punkte:",

        "intro_quote_dg": "Die Erschaffung deines Delta Green Agenten umfasst mehrere Kernphasen: die Wahl eines Berufs und der damit verbundenen Fertigkeiten, die Festlegung der sechs primären Attribute zur Berechnung weiterer Werte und schließlich die Definition deiner persönlichen Beziehungen und Motivationen.",
        "intro_welcome_text": "Willkommen beim Agentenakten-Ersteller für Delta Green. Klicke auf 'Weiter', um mit der Gestaltung deines Agenten zu beginnen.",
        
        "banner_headline": "Bist du ein Schriftsteller?",
        "banner_text": "Schau dir meine neue App <a href=\"https://writersalley.com\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"promo-banner-link\">WritersAlley.com</a> an — ein zielbasiertes Schreib-Tracking-Tool, das dir hilft, auf Kurs zu bleiben.",
        "banner_cta": "WritersAlley.com besuchen",
        "banner_dismiss": "Banner ausblenden",
        
        "aria_skill_increase": "{skillName} um {amount}% erhöhen",
        "aria_skill_decrease": "{skillName} um {amount}% verringern",
        "aria_custom_skill_increase": "Fertigkeitspunkte um {amount} erhöhen",
        "aria_custom_skill_decrease": "Fertigkeitspunkte um {amount} verringern",
        "aria_roll_stats": "Neue Attributswerte auswürfeln",
        "aria_share_character": "Charakter teilen, Link in Zwischenablage kopieren",
        "aria_print_summary": "Charakterzusammenfassung drucken",
        "aria_export_json": "Charakter als JSON-Datei exportieren",
        "aria_view_character": "Charakter {name} ansehen",
        "aria_delete_character": "Charakter {name} löschen",
        "aria_edit_name": "Namen von Charakter {name} bearbeiten",
        "aria_import_character": "Charakter aus JSON-Datei importieren",
        "aria_load_from_database": "Charakter {name} aus Datenbank importieren",
        "aria_report_character": "Unangemessenen Charakter {name} melden",
        "aria_back_to_list": "Zur Charakterliste zurückkehren",
        
        "step_name_0": "Einleitung",
        "step_name_1": "Beruf & Fertigkeiten",
        "step_name_2": "Attribute",
        "step_name_3": "Abgeleitete Werte",
        "step_name_4": "Beziehungen & Motivationen",
        "step_name_4_3": "Traumatischer Hintergrund",
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
        "add_another_specialization_button_text": "Weitere {skillName} hinzufügen",
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
        "btn_export_json": "Als JSON exportieren",
        "btn_download_txt": "Als TXT herunterladen",
        
        // Personal Information Step
        "step5_personal_info_title": "Persönliche Informationen",
        "step5_personal_info_description": "Bitte gib die folgenden persönlichen Daten für deinen Agenten an.",
        "personal_info_name_label": "Name",
        "personal_info_name_placeholder": "Agentenname eingeben",
        "personal_info_employer_label": "Arbeitgeber",
        "personal_info_employer_placeholder": "Arbeitgeber eingeben",
        "personal_info_sex_label": "Geschlecht",
        "personal_info_sex_placeholder": "Geschlecht eingeben",
        "personal_info_nationality_label": "Nationalität",
        "personal_info_nationality_placeholder": "Nationalität eingeben",
        "personal_info_age_label": "Alter",
        "personal_info_age_placeholder": "Alter eingeben",
        "personal_info_dob_label": "Geburtsdatum",
        "personal_info_dob_placeholder": "Geburtsdatum eingeben",
        
        // Character List
        "character_list_title": "Gespeicherte Charaktere",
        "no_characters_saved": "Es wurden noch keine Charaktere gespeichert.",
        "view_character": "Ansehen",
        "delete_character": "Löschen",
        "rename_character": "Umbenennen",
        "edit_name": "Namen bearbeiten",
        "enter_new_name": "Neuen Namen eingeben:",
        "confirm_delete_character": "Möchtest du {name} wirklich löschen?",
        "back_to_list": "Zurück zur Liste",
        "character_not_found": "Charakter nicht gefunden.",
        "storage_limit_reached": "Speicherlimit erreicht. Es können maximal {limit} Charaktere gespeichert werden. Bitte lösche einen Charakter, um einen neuen zu speichern.",
        
        // Sharing & Import
        "share_character": "Charakter teilen",
        "share_url_copied": "Teilbarer Link in die Zwischenablage kopiert!",
        "share_error": "Fehler beim Erstellen des teilbaren Links",
        "import_character": "Charakter importieren (JSON)",
        "import_success": "Charakter erfolgreich importiert!",
        "import_error": "Fehler beim Importieren des Charakters",
        "own_characters_title": "Meine Charaktere",
        "imported_characters_title": "Importierte Charaktere",
        "characters_title": "Charaktere",
        "create_character": "Charakter erstellen",
        "imported_character_label": "Importiert",
        "made_by_others_title": "Von anderen erstellt",
        "made_by_others_info": "Hilf dabei, diese Liste sauber zu halten: Melde unvollständige Charaktere oder solche mit anstößigen Inhalten und Texten. Sie werden sofort entfernt und anschließend überprüft.",
        "made_by_others_filter_all": "Alle Berufe",
        "made_by_others_filter_custom": "Eigene Builds",
        "made_by_others_filter_empty": "Für diesen Beruf wurden noch keine geteilten Charaktere gefunden.",
        "made_by_others_filter_aria_label": "Community-Charaktere nach Beruf filtern",
        "load_from_database": "Importieren",
        "load_more_characters": "Mehr laden",
        "loading": "Lädt...",
        "load_more_error": "Fehler beim Laden weiterer Charaktere",
        "upload_to_database": "Zur Datenbank hochladen",
        "uploading": "Wird hochgeladen...",
        "upload_success": "Charakter erfolgreich hochgeladen!",
        "upload_error": "Fehler beim Hochladen des Charakters",
        "upload_blocked_content": "Der Charakter enthält unzulässige Inhalte und kann nicht hochgeladen werden.",
        "report_character": "Melden",
        "report_reason_prompt": "Bitte gib einen Grund für die Meldung dieses Charakters an:",
        "report_success": "Vielen Dank für die Meldung. Der Charakter wurde zur Überprüfung markiert.",
        "report_error": "Fehler beim Melden des Charakters",
        "moderation_pending": "Wird überprüft",

        "summary_section_personal_details": "Persönliche Daten",
        "summary_section_profession": "Beruf",
        "summary_section_statistics": "Attribute",
        "summary_section_derived_attr": "Abgeleitete Werte",
        "summary_section_skills": "Fertigkeiten",
        "summary_section_bonds": "Beziehungen",
        "summary_section_motivations": "Motivationen",
        "summary_section_traumatic_background": "Traumatischer Hintergrund",

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
        "motivation_placeholder": "z.B. Die Wahrheit aufdecken, egal was es kostet",

        //------------ Schritt 4.3: Traumatischer Hintergrund --------------
        "step4_3_traumatic_background_title": "Schritt 4.3: Traumatischer Hintergrund (Optional)",
        "step4_3_traumatic_background_info": "Wenn dein Agent neu bei Delta Green ist, kannst du diesen Schritt überspringen. Wenn dein Agent jedoch ein Veteran ist, der bereits die unnatürlichen Schrecken von Delta Green erlebt hat, kannst du einen traumatischen Hintergrund aus den unten stehenden Optionen auswählen. Jeder traumatische Hintergrund repräsentiert eine bedeutsame vergangene Erfahrung, die deinen Agenten geprägt und ihn tiefer in die Welt von Delta Green gebracht hat. Diese Hintergründe modifizieren die Statistiken, Fertigkeiten und Stabilität deines Agenten und spiegeln die dauerhaften Auswirkungen seiner traumatischen Erfahrungen wider. Arbeite mit deinem Handler zusammen, um die spezifischen Details dessen zu bestimmen, was passiert ist und wie es deinen Agenten zu Delta Green geführt hat.",
        "step4_traumatic_background_warning": "Bitte konsultiere deinen Handler, bevor du einen traumatischen Hintergrund auswählst.",
        "traumatic_background_none": "Keiner",
        "traumatic_background_extreme_violence": "Extreme Gewalt",
        "traumatic_background_extreme_violence_desc": "+10% auf Okkultismus; -5 STA; -3 CH (reduziert jede Beziehung um 3). Du bist an Gewalt angepasst.",
        "traumatic_background_captivity": "Gefangenschaft oder Inhaftierung",
        "traumatic_background_captivity_desc": "+10% auf Okkultismus; -5 STA; -3 WK (beeinflusst STA nicht). Du bist an Hilflosigkeit angepasst.",
        "traumatic_background_hard_experience": "Harte Erfahrung",
        "traumatic_background_hard_experience_desc": "+10% auf Okkultismus; -5 STA; +10% auf vier beliebige Fertigkeiten (außer Das Unnatürliche). Entferne eine Beziehung.",
        "traumatic_background_things_man": "Dinge, die der Mensch nicht wissen sollte",
        "traumatic_background_things_man_desc": "+20% auf Okkultismus; reduziere STA um WK; +10% Fertigkeit Das Unnatürliche. Setze Belastungsgrenze auf neue STA minus WK. Erhalte eine Störung, die durch das Unnatürliche verursacht wurde.",
        "hard_experience_skill_selection_label": "Wähle vier Fertigkeiten, die +10% erhalten (außer Das Unnatürliche):",
        "hard_experience_skill_label": "Fertigkeit {number}:",
        "hard_experience_bond_removal_label": "Wähle eine Beziehung zum Entfernen:",
        "disorder_label": "Störung:",
        "disorder_placeholder": "z.B. Paranoia, Besessenheit, etc."
    },
    es: {
        // ====================================================================
        // GENERAL UI ELEMENTS
        // ====================================================================
        // These are common interface elements used throughout the app
        
        "remaining_boost_pool_label": "Bonificaciones restantes:",
        // NOTE: "Boost Points" refers to skill improvement points in the game
        
        "confirm_incomplete_skill_boosts": "No has distribuido las {maxBoosts} bonificaciones de habilidad. ¿Deseas continuar de todos modos?",
        // NOTE: {maxBoosts} will be replaced with a number (e.g., 8)
        
        "page_title": "Creador de agente de Delta Green",
        
        
        "app_header": "Creación de agente de Delta Green",
        
        "footer_feedback_text": "¿Tienes algún comentario, o has encontrado un error? Avísame en",
        
        
        "footer_feedback_link": "Reddit",
        
        
        "footer_text": "Publicado en acuerdo con Delta Green Partnership. La propiedad intelectual conocida como Delta Green es una marca comercial y derechos de autor propiedad de Delta Green Partnership, que ha autorizado su uso aquí. Esto incluye todos los elementos que forman parte de la propiedad intelectual de Delta Green.",
        
        
        // ====================================================================
        // BUTTONS
        // ====================================================================
        
        "btn_back_text": "Volver",
        "btn_next_text": "Siguiente",
        "btn_finish_text": "Ver resumen",
        "btn_back_to_home": "Volver a inicio",
        
        // ====================================================================
        // PROGRESS AND NAVIGATION
        // ====================================================================
        
        "progress_bar_text": "Paso {current} de {total}: {stepName}",
       
        // TC: Changed "one" for the number, as it's gendered in spanish ("una" or "uno")
        "select_one_option": "-- Escoge 1 --",
        
        
        "specify_type_placeholder": "Especificar uno (e.g., Física, Francés, Actuación)",
        
        
        "choose_one_label": "Escoge 1",
        "choose_N_label": "Escoge {N} de los siguientes",
        // NOTE: {N} will be replaced with a number
        
        // ====================================================================
        // INTRODUCTION / WELCOME SCREEN
        // ====================================================================
        
        "intro_quote_dg": "Crear un agente de Delta Green requiere varias etapas clave: escoger una profesión y sus habilidades asociadas, definir sus características físicas y mentales para calcular sus atributos derivados y, finalmente, establecer los Lazos y Motivaciones de tu agente.",
       
        // TC: "Operative" changed to "agent" in the second line, since the literal translation "Operativo" also means "operation" in spanish.
        "intro_welcome_text": "Bienvenido al creador de expedientes de agentes para Delta Green. Continúa presionando 'Siguiente' para comenzar a darle forma a tu agente.",
        
        
        // ====================================================================
        // PROMOTIONAL BANNER
        // ====================================================================
        
        "banner_headline": "¿Eres escritor?",
        "banner_text": "Echa un vistazo a mi nueva aplicación <a href=\"https://writersalley.com\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"promo-banner-link\">WritersAlley.com</a> — un gestor de objetivos de escritura que te ayuda a cumplir tus metas.",
        // NOTE: Keep HTML tags exactly as they are, only translate the text content
        
		// TC: "Banner" does not have a proper translation, changed to "anuncio" (advert).
        "banner_cta": "Visita WritersAlley.com",
        "banner_dismiss": "Cerrar anuncio",
        
        // ====================================================================
        // ACCESSIBILITY (ARIA) LABELS
        // ====================================================================
        // These are screen reader labels for accessibility - keep them descriptive
        
        "aria_skill_increase": "Aumentar {skillName} por {amount}%",
        "aria_skill_decrease": "Disminuir {skillName} por {amount}%",
        "aria_custom_skill_increase": "Aumentar valor de habilidad por {amount}",
        "aria_custom_skill_decrease": "Disminuir valor de habilidad por {amount}",
        "aria_roll_stats": "Generar nuevos valores de características",
        "aria_share_character": "Compartir personaje, copia el enlace al portapapeles",
        "aria_print_summary": "Imprimir resumen de personaje",
        "aria_export_json": "Exportar personaje como archivo JSON",
        "aria_view_character": "Ver personaje {name}",
        "aria_delete_character": "Borrar personaje {name}",
        "aria_edit_name": "Editar nombre de personaje {name}",
        "aria_import_character": "Importar personaje desde archivo JSON",
        "aria_load_from_database": "Importar personaje {name} desde base de datos",
        "aria_report_character": "Denunciar personaje inapropiado {name}",
        "aria_back_to_list": "Volver a lista de personajes",
        
        // ====================================================================
        // STEP NAMES (Navigation)
        // ====================================================================
        
        "step_name_0": "Introducción",
        "step_name_1": "Profesión & Habilidades",
        "step_name_2": "Características",
        "step_name_3": "Atributos derivados",
        "step_name_4": "Lazos & Motivaciones",
        "step_name_4_3": "Antecedentes traumáticos",
        "step_name_5_personal": "Información personal",
        "step_name_5": "Resumen",
        
        // ====================================================================
        // STEP 1: PROFESSION & SKILLS
        // ====================================================================
        
        "step1_info1": "La profesión de un agente es fundamental, influyendo en sus habilidades, su número inicial de Lazos personales, los recursos a su disposición, y el alcance de su autoridad y sus funciones. Las profesiones presentadas a continuación representan los antecedentes comunes de los agentes de Delta Green.",

        
        "step1_info2": "Cada profesión otorga un conjunto específico de habilidades con valores iniciales que sustituyen los valores predeterminados. Aparte de estas habilidades profesionales, tienes 8 bonificaciones de habilidad (cada una con un valor de +20%) que puedes distribuir entre el resto de las habilidades de tu personaje. Puedes asignar varias de estas a una sola habilidad, pero ninguna puede tener un valor inicial superior a 80%.",
        
		// TC: Context may change the way these should be worded, due to gendered nouns in spanish.
        "add_specialization_button_text": "Añadir especialización de {skillName}",
        "add_another_specialization_button_text": "Añadir otra {skillName}",
        "remove_button_title": "Eliminar esta especialización",
        
        "step1_select_profession_label": "Paso 1.1: Escoge una profesión",
        "step1_2_profession_specific_label": "Paso 1.2: Opciones específicas a la profesión",
        "bonds_label": "Lazos",
        "step1_increase_skills_label": "Paso 1.3: Distribuye las bonificaciones (8 disponibles, +20% cada una)",
        "increases_chosen_label": "Bonificaciones aplicadas:",
        
        // Error/Alert Messages for Step 1
        "alert_select_profession": "Por favor, selecciona una profesión para continuar.",
        "alert_max_choices_reached": "Has llegado al máximo de {N} elecciones para esta categoría.",
        "alert_skill_increase_limit": "Han sido asignadas todas las 8 bonificaciones de habilidad.",
        "alert_skill_max_value_reached": "El valor de esta habilidad no puede superar el 80% en la creación del personaje.",
        "alert_type_for_skill_needed": "Hace falta un tipo específico para la habilidad \"{skillName}\".",
        
        // ====================================================================
        // PROFESSION NAMES
        // ====================================================================
        
		// TC: For these, I have used the profession names as they appear in the Spanish translation made by the company "Devir".
		
        "profession_anthropologist_name": "Antropólogo, Arqueólogo, o Historiador",
        "profession_computer_scientist_name": "Programador o ingeniero informático",
        "profession_federal_agent_name": "Agente federal",
        "profession_physician_name": "Médico",
        "profession_scientist_name": "Científico",
        "profession_special_operator_name": "Agente de élite",
        
        // ====================================================================
        // SKILL NAMES AND DESCRIPTIONS
        // ====================================================================
        // Each skill has a name and a description
        
        // TC: Likewise, I have used the skill names as they appear in the spanish translation made by the company "Devir".
		
        "skill_accounting_name": "Contabilidad",
        "skill_accounting_desc": "Comprender los registros financieros, las prácticas de negocio, y descubrir irregularidades tributarias.",
        
        "skill_alertness_name": "Alerta",
        "skill_alertness_desc": "Percibir detalles sutiles, amenazas potenciales o notar lo inusual en el entorno.",
        
        "skill_anthropology_name": "Antropología",
        "skill_anthropology_desc": "El estudio académico de las sociedades y culturas humanas, y su formación.",
        
        "skill_archeology_name": "Arqueología",
        "skill_archeology_desc": "Investigación de la historia y la prehistoria humanas mediante excavaciones y análisis de artefactos.",
        
        "skill_art_name": "Arte",
        "skill_art_desc": "Competencia en la creación o interpretación de una forma artística específica (e.g., pintura, música, teatro).",
        
        "skill_artillery_name": "Artillería",
        "skill_artillery_desc": "Operar y desplegar con precisión armas de proyectiles de gran calibre, como morteros o lanzamisiles.",
        
        "skill_athletics_name": "Atletismo",
        "skill_athletics_desc": "Habilidad física en actividades que requieren fuerza, agilidad y coordinación, como correr, saltar o escalar.",
        
        "skill_bureaucracy_name": "Burocracia",
        "skill_bureaucracy_desc": "Navegar por procedimientos o estructuras organizativas complejas, e influir en canales oficiales.",
        
        "skill_computer_science_name": "Informática",
        "skill_computer_science_desc": "Conocimiento profundo de hardware, software, redes, y análisis de datos informáticos.",
        
		// TC: Changed "manual creation" for a word more related to trades and crafts.
        "skill_craft_name": "Oficio",
        "skill_craft_desc": "Habilidad en algún oficio específico o elaboración artesanal (por ejemplo, mecánica, electrónica, cerrajería).",
        
        "skill_criminology_name": "Criminología",
        "skill_criminology_desc": "Conocimiento de comportamiento criminal, técnicas investigativas, y el funcionamiento de grupos criminales.",
        
        "skill_demolitions_name": "Demoliciones",
        "skill_demolitions_desc": "El uso eficaz y seguro de explosivos para derribar, destruir o crear distracciones.",
        
        "skill_disguise_name": "Disfraz",
        "skill_disguise_desc": "Modificar la apariencia, voz, y gestos, para suplantar de forma convincente a otra persona o crear una identidad falsa.",
        
        "skill_dodge_name": "Esquiva",
        "skill_dodge_desc": "Reaccionar ante y evitar ataques físicos o peligros repentinos mediante reflejos rápidos.",
        
        "skill_drive_name": "Conducción",
        "skill_drive_desc": "Conducir vehículos terrestres como automóviles o motocicletas con destreza, especialmente bajo presión.",
        
        "skill_firearms_name": "Armas de fuego",
        "skill_firearms_desc": "Uso seguro y preciso de pistolas, rifles y escopetas en situaciones de combate.",
        
        "skill_first_aid_name": "Primeros auxilios",
        "skill_first_aid_desc": "Proporcionar atención médica inmediata para estabilizar lesiones y evitar daños mayores.",
        
        "skill_foreign_language_name": "Idiomas extranjeros",
        "skill_foreign_language_desc": "Fluidez en un idioma distinto al materno (especificar idioma).",
        
        "skill_forensics_name": "Ciencia forense",
        "skill_forensics_desc": "Recopilar, analizar e interpretar pruebas físicas de una escena utilizando métodos científicos.",
        
        "skill_heavy_machinery_name": "Maquinaria pesada",
        "skill_heavy_machinery_desc": "Operar maquinaria grande o compleja, como herramientas de construcción o industriales.",
        
        "skill_heavy_weapons_name": "Armas pesadas",
        "skill_heavy_weapons_desc": "Uso competente de armamento pesado portátil, como ametralladoras o lanzagranadas.",
        
        "skill_history_name": "Historia",
        "skill_history_desc": "Conocimiento de acontecimientos y sociedades pasadas, y su importancia (puede requerir especialización).",
        
        "skill_humint_name": "HUMINT",
        
        "skill_humint_desc": "Human Intelligence: Recopilación de información a través del contacto interpersonal, entrevistas e interrogatorios.",
        
        "skill_law_name": "Derecho",
        "skill_law_desc": "Comprender los sistemas y procedimientos legales, y utilizarlos en beneficio propio o para investigar.",
        
        "skill_medicine_name": "Medicina",
        "skill_medicine_desc": "Diagnóstico avanzado y tratamiento de enfermedades y lesiones, más allá de los primeros auxilios básicos.",
        
        "skill_melee_weapons_name": "Armas cuerpo a cuerpo",
        "skill_melee_desc": "Uso eficaz de armas de combate cuerpo a cuerpo como cuchillos, garrotes o espadas.",
        
        "skill_military_science_name": "Ciencia militar",
        "skill_military_science_desc": "Conocimiento de tácticas, estrategia, organización y cultura militar (especificar rama o especialidad).",
        
        "skill_navigate_name": "Orientación",
        "skill_navigate_desc": "Determinar la posición y planificar rutas, usando mapas, brújulas u otras herramientas.",
        
        "skill_occult_name": "Ocultismo",
        "skill_occult_desc": "Familiaridad con mitología y tradiciones esotéricas, afirmaciones paranormales, sociedades secretas y conocimiento sobre lo arcano.",
        
        "skill_persuade_name": "Persuasión",
        "skill_persuade_desc": "Influir en los pensamientos, decisiones, y acciones de otros usando argumentos, encanto, o negociación.",
        
        "skill_pharmacy_name": "Farmacia",
        "skill_pharmacy_desc": "Entender las drogas, sus efectos, interacciones, y preparación.",
        
        "skill_pilot_name": "Pilotaje",
        "skill_pilot_desc": "Operar y navegar aeronaves, embarcaciones o naves espaciales (especificar el tipo de vehículo).",
        
        "skill_psychotherapy_name": "Psicoterapia",
        "skill_psychotherapy_desc": "Diagnóstico y tratamiento de trastornos mentales y emocionales.",
        
        "skill_ride_name": "Montar",
        "skill_ride_desc": "Habilidad para controlar y montar animales, normalmente caballos o monturas similares.",
        
        "skill_science_name": "Ciencia",
        "skill_science_desc": "Experiencia en un campo científico específico (e.g., biología, química, física).",
        
        "skill_search_name": "Búsqueda",
        "skill_search_desc": "Encontrar metódicamente objetos, información o personas ocultas en un espacio determinado.",
        
        "skill_sigint_name": "SIGINT",
        
        "skill_sigint_desc": "Signals Intelligence: Interceptar, analizar y descifrar comunicaciones electrónicas.",
        
        "skill_stealth_name": "Sigilo",
        "skill_stealth_desc": "Moverse y actuar sin ser detectado por vista u oído.",
        
        "skill_surgery_name": "Cirugía",
        "skill_surgery_desc": "Realizar procedimientos médicos invasivos para tratar lesiones graves o afecciones complejas.",
        
        "skill_survival_name": "Supervivencia",
        "skill_survival_desc": "Sobrevivir en entornos hostiles utilizando conocimiento de la naturaleza e improvisación.",
        
        "skill_swim_name": "Natación",
        "skill_swim_desc": "Competencia en natación, especialmente en condiciones acuáticas difíciles o peligrosas.",
        
        "skill_unarmed_combat_name": "Combate sin armas",
        "skill_unarmed_combat_desc": "Eficacia en el combate cuerpo a cuerpo sin armas, incorporando diversas técnicas marciales.",
        
        "skill_unnatural_name": "Antinatural",
        
		// TC: Took part of the description of the skill from the "Devir" translation.
		
        "skill_unnatural_desc": "Conocimiento acerca de los secretos más fundamentales y desgarradores del universo, que desafían nuestro entendimiento de la realidad.",
        
        // ====================================================================
        // STEP 2: STATISTICS
        // ====================================================================
        
        "step2_info_stats": "Las seis características de un agente definen sus capacidades físicas y mentales. Estos valores suelen oscilar entre 3 y 18.",
        // NOTE: There are duplicate keys for step2_info_stats - translate consistently
        
        "stat_str_name": "Fuerza (FUE)",
        "stat_str_desc": "Mide la fuerza física y la musculatura.",
        
        "stat_con_name": "Constitución (CON)",
        "stat_con_desc": "Indica la salud, resistencia y energía física de un agente.",
        
        "stat_dex_name": "Destreza (DES)",
        "stat_dex_desc": "Refleja la agilidad, coordinación y velocidad de reacción de un agente.",
        
        "stat_int_name": "Inteligencia (INT)",
        "stat_int_desc": "Representa el razonamiento, la memoria y la capacidad de resolución de problemas de un agente.",
        
        "stat_pow_name": "Poder (POD)",
        "stat_pow_desc": "Indica la fuerza de voluntad, fortaleza mental y potencial psíquico.",
        
        
        "stat_cha_name": "Carisma (CAR)",
        "stat_cha_desc": "Mide la fuerza de la personalidad, capacidad de persuasión y el atractivo social de un agente.",
        
        "step2_select_array_label": "Paso 2.1: Escoge un conjunto de valores",
      
        
        "step2_assign_stats_label": "Paso 2.2: Asigna los valores escogidos a tus características:",
        
        "step2_info_percentile": "Para cada característica, anota su valor percentil (Valor × 5). Si una característica es notablemente baja (por debajo de 9) o alta (por encima de 12), se considera un rasgo distintivo. Describe brevemente ese rasgo.",
       
        
        "distinguishing_feature_label": "Rasgo distintivo:",
        "distinguishing_feature_placeholder": "e.g., Excepcionalmente fuerte, Engorroso, Ingenioso, Distraído",
        
        "alert_assign_all_stats": "Asegúrate de que haya un valor asignado a cada característica.",
        "alert_unique_stat_values": "Cada valor del conjunto seleccionado debe ir asignado a solo una característica.",
        
        "step2_select_method_label": "Paso 2.1: Escoger el método de generación de características.",
        "stat_method_array": "Usar números predefinidos",
        "stat_method_roll": "Tirar dados (4d6 descartando más bajo)",
        // NOTE: "4d6 drop lowest" = roll 4 six-sided dice, remove the lowest result
        
        "step2_select_array_sublabel": "Escoge un conjunto:",
        "btn_roll_stats_text": "Generar nuevos valores",
        "rolled_values_label": "Tus valores obtenidos:",
        "click_to_roll_stats_label": "Presiona el botón para generar tus valores.",
        "step2_select_method_or_roll_label": "Por favor selecciona un método de generación y luego un conjunto, o genera los valores para continuar.",
        
        "stat_method_pointbuy": "Compra de puntos (72 puntos)",
        
        
        "pointbuy_info_text": "Distribuye {totalPoints} puntos entre las seis características. Cada característica debe tener un valor entre 3 y 18.",
        "pointbuy_points_remaining_label": "Puntos por asignar:",
        "step2_assign_stats_label_or_features": "Paso 2.2: Asignar valores / Definir rasgos distintivos",
        "step2_define_features_label": "Paso 2.2: Definir rasgos distintivos",
        "pointbuy_error_total_points": "Debes asignar exactamente {total} puntos. Actualmente has asignado {spent}.",
        "pointbuy_error_stat_range": "Cada característica debe tener entre 3 y 18 para la compra de puntos.",
        "pointbuy_points_summary_label": "Puntos asignados: {spent} / {total}  (Puntos pos asignar: {remaining})",
        
        "stat_method_manual": "Ingreso manual",
        "manual_entry_info_text": "Introduce directamente los valores de cada característica. Cada característica debe tener un valor entre 3 y 18.",
        "manual_entry_error_stat_range": "Para ingreso manual, cada característica debe tener entre 3 y 18.",
        
        // NOTE: There are duplicate entries for some step 2 keys below - translate consistently
        "step2_info_stats": "Las seis características de un agente definen sus capacidades físicas y mentales. Estos valores oscilan entre 3 y 18.",
        
        "stat_str_name": "Fuerza (FUE)",
        "stat_str_desc": "Mide la fuerza física bruta y la capacidad de levantamiento.",
        
        "stat_con_name": "Constitución (CON)",
        "stat_con_desc": "Refleja la salud, resistencia a daño, y aguante.",
        
        "stat_dex_name": "Destreza (DES)",
        "stat_dex_desc": "Denota agilidad, coordinación entre mano y ojo, y reflejos.",
        
        "stat_int_name": "Inteligencia (INT)",
        "stat_int_desc": "Gobierna el razonamiento, la memoria, intución, y habilidades analíticas.",
        
        "stat_pow_name": "Poder (POD)",
        "stat_pow_desc": "Representa la fuerza de voluntad, fortaleza mental, y potencial para habilidades inusuales.",
        
        "stat_cha_name": "Carisma (CAR)",
        "stat_cha_desc": "Indica magnetismo personal, cualidades de liderazgo, e influencia social.",
        
        "step2_select_array_label": "Paso 2.1: Escoge un conjunto de valores para distribuir entre las características.",
        "step2_assign_stats_label": "Paso 2.2: Asigna los números seleccionados a tus características:",
        "step2_stat_value_label": "Valor",
        "step2_stat_x5_label": "Valoración x5",
       
        
        "step2_info_distinguishing_feature": "Si el valor de una característica es 8 o menos, o 13 o más, es digna de una mención. Utiliza un adjetivo o frase para describir esta característica.",
        "distinguishing_feature_label": "Rasgo distintivo:",
        "distinguishing_feature_placeholder": "e.g., Corpulento, Frágil, Perspicaz, Obsesivo",
        
        "alert_select_stat_array": "Primero debes seleccionar un conjunto de valores.",
        "alert_assign_all_stats": "Por favor asigna un valor del conjunto a cada característica.",
        "alert_unique_stat_values": "Cada valor del conjunto seleccionado solo se puede usar una vez por característica.",
        
        "stat_array_option_label": "{values}",
        // NOTE: {values} will be replaced with something like "15, 14, 13, 12, 10, 8"
        
        // ====================================================================
        // STEP 3: DERIVED ATTRIBUTES
        // ====================================================================
        // These are calculated from the base statistics
        
        "step3_info_derived": "Los atributos derivados son características secundarias, calculadas usando las características principales de tu agente.",
        "step3_info_derived_title": "Paso 3: Definir los atributos derivados",
        "step3_info_derived_intro": "Estos atributos son calculados directamente usando los valores de las características principales de tu agente, definiendo aún más sus habilidades.",
        
        "attr_hp_name": "Puntos de salud (PS)",
        "attr_hp_desc": "Indica la capacidad de un agente de resistir daño físico. Se calcula como (FUE + CON) / 2, redondeado hacia arriba.",
        // NOTE: There are two versions of attr_hp_desc - translate consistently
        
        "attr_wp_name": "Puntos de voluntad (PV)",
        
        "attr_wp_desc": "Indica resiliencia mental y la capacidad de superar la adversidad. Equivalente al POD.",
        
        "attr_san_name": "Puntos de cordura (COR)",
        "attr_san_desc": "Mide el apego de un agente a la realidad convencional. Calculado como POD × 5.",
        
        // TC: This key, "attr_san_desc", is duplicated.
        "attr_san_desc": "Mide la estabilidad mental de un agente y su conexión con la realidad. Calculado como POD × 5.",
        
		// TC: The "Devir" translation does not have an abbreviation for the breaking point. I am adding the first letters of the translation (PR) as one.
        "attr_bp_name": "Punto de Ruptura (PR)",
        "attr_bp_desc": "El límite de cordura a partir del cual trauma adicional puede provocar un nuevo trastorno mental. Calculado como COR - POD.",
		
       // TC: This key, "attr_bp_desc", is duplicated.
        "attr_bp_desc": "El nivel de cordura a partir del cual un trauma significativo puede provocar un trastorno mental duradero. Calculado como COR - POD.",
        
        "derived_attributes_title": "Paso 3: Atributos derivados",
        "derived_attribute_label": "Atributo",
        "derived_value_label": "Valor",
        "derived_description_label": "Descripción",
        
        // ====================================================================
        // STEP 4: BONDS & MOTIVATIONS
        // ====================================================================
        
        "step4_info_bonds_mot": "Si bien su profesión, habilidades y características describen las aptitudes de tu agente, sus Lazos y Motivaciones aportan profundidad a su personalidad como individuo.",
        "step4_title_bonds_motivations": "Paso 4: Detallar Lazos y Motivaciones",
        "step4_info_bonds_mot_intro": "Más allá de sus aptitudes, un agente está definido por sus conexiones personales (Lazos), y su impulso interior (Motivaciones). Estos elementos aportan una profundidad crucial a tu personaje.",
        
        // Bonds Section
        "step4_1_bonds_title": "Paso 4.1: Definir los Lazos",

        
        "step4_info_bonds1": "Los Lazos representan las conexiones humanas más importantes de la vida de tu agente. Pueden ser personas concretas (como su pareja, hijos, o mentor) o grupos muy unidos (como una antigua unidad militar, o una familia muy unida).",
      
        
        "step4_info_bonds2": "Las profesiones más exigentes suelen limitar el número de Lazos que un agente puede mantener. Inicialmente, los Lazos solo requieren un nombre y la naturaleza de la relación.",
        "step4_info_bonds2": "El valor inicial de cada Lazo se determina por Carisma (CAR) del agente. Cuando se deteriora el valor de un Lazo, se deteriora la relación que representa.",
        "step4_info_bonds3": "La naturaleza de la profesión de un agente puede afectar el número de Lazos que puede mantener de forma realista. Consulta la profesión escogida para conocer el número específico, o el número que has establecido si has creado una personalizada. ",
        "step4_info_bonds4": "Por ahora, cada Lazo necesita una breve descripción que identifique a la persona o grupo y la naturaleza de la conexión, e.g., \"Mi exmujer, Sarah\" o \"El sargento Miller, mi antiguo jefe de pelotón\".",
        

        "bond_examples_label": "Ejemplos de Lazos:",
        // NOTE: Duplicate - use "Illustrative Bond Examples:"
        
        "bond_examples_list": "Pareja/Ex-pareja; Hijo/Hija; Hermano cercano; Amigo de la infancia; Contacto profesional de confianza; Terapeuta; Unidad familiar (e.g., pareja e hijos); Equipo de trabajo cercano; Grupo de supervivientes de un evento traumático.",
       
        
        "bond_name_label": "Relación con Lazo",
        "bond_label_number": "Lazo {number}",
        "bond_description_placeholder": "e.g., Mi pareja, Alex Chen",
 
        "bond_score_label": "Valor inicial (CAR):",
       
        
        "num_bonds_for_profession": "Tu profesión escogida permite {count} Lazos.",
        
        "alert_define_bonds": "Por favor describe brevemente cada uno de los Lazos de tu agente.",
        
        // Motivations Section
        
        "step4_2_motivations_title": "Paso 4.2: Define las motivaciones",
        
        
        "step4_info_motivations1": "Las motivaciones son las creencias esenciales, los impulsos personales o incluso las obsesiones que mueven a tu agente. ¿Qué es lo que realmente les hace continuar? ¿Es el deseo de conocimiento, lealtad a una causa, una relación muy importante o algo más complejo?",
        
        "step4_info_motivations2": "Si la cordura de un agente cae hasta su Punto de Ruptura, normalmente se sustituye una motivación por un nuevo trastorno mental.",
        "step4_info_motivations2": "Puedes definir hasta cinco motivaciones iniciales. Estas pueden cambiar o ser sustituidas a medida que tu agente se enfrenta a los horrores de su trabajo y su personalidad se desarrolla.",
        "step4_info_motivations3": "Cuando la cordura de un agente alcanza su Punto de Ruptura debido a un trauma, una motivación suele ser sustituida por un nuevo trastorno mental, lo que refleja el impacto de sus experiencias.",
        
        "motivation_label": "Motivación",
        "motivation_label_number": "Motivación {number}",
        "motivation_placeholder": "e.g., Descubrir la verdad, cueste lo que cueste",
        
        // ====================================================================
        // STEP 4.3: TRAUMATIC BACKGROUND
        // ====================================================================
        
        "step4_3_traumatic_background_title": "Paso 4.3: Antecedentes traumáticos (Opcional)",
        "step4_3_traumatic_background_info": "Si tu agente es nuevo en Delta Green, puedes saltarte este paso. Sin embargo, si tu agente es un veterano que ya se ha enfrentado a los horrores sobrenaturales de Delta Green, puedes seleccionar un pasado traumático de entre las opciones que se indican a continuación. Cada pasado traumático representa una experiencia significativa del pasado que ha moldeado a tu agente y lo ha sumergido aun más en el mundo de Delta Green. Estos pasados modifican las características, habilidades y cordura de tu agente, reflejando el impacto duradero de sus experiencias traumáticas. Conversa con tu Supervisor para determinar los detalles específicos de lo que sucedió, y cómo llevó a tu agente a Delta Green.",
        
        "step4_traumatic_background_warning": "Por favor consulta con tu Supervisor antes de seleccionar un antecedente traumático.",
        
        "traumatic_background_none": "Ninguno",
        "traumatic_background_extreme_violence": "Violencia extrema",
        "traumatic_background_extreme_violence_desc": "+10% Ocultismo; -5 COR; -3 CAR (reduce 3 a cada Lazo). Estás adaptado a la violencia.",
       
        "traumatic_background_captivity": "Cautiverio o encarcelamiento",
        "traumatic_background_captivity_desc": "+10% Ocultismo; -5 COR; -3 POD (no afecta a COR). Estás adaptado a la indefensión.",
        
        "traumatic_background_hard_experience": "Experiencia dura",
        "traumatic_background_hard_experience_desc": "+10% Ocultismo; -5 COR; +10% a cuatro habilidades cualesquiera (excepto Antinatural). Elimina un Lazo.",
        
		// TC: Spanish does not capitalize words this way, but it's how it appears in the "Devir" translation.
        "traumatic_background_things_man": "Cosas que el Ser Humano no Debería Saber",
        "traumatic_background_things_man_desc": "+20% Ocultismo; reduce COR en POD; +10% Antinatural. Establece un nuevo Punto de Ruptura a la nueva COR menos POD. Obtén un trastorno causado por lo Antinatural.",
        
        "hard_experience_skill_selection_label": "Escoge cuatro habilidades para aumentar +10% (excepto Antinatural):",
        "hard_experience_skill_label": "Habilidad {number}:",
        "hard_experience_bond_removal_label": "Escoge un Lazo a eliminar:",
        "disorder_label": "Trastorno:",
        "disorder_placeholder": "e.g., Paranoia, Obsesión, etc.",
        
        // ====================================================================
        // STEP 5: PERSONAL INFORMATION
        // ====================================================================
        
        "step5_personal_info_title": "Información personal",
        "step5_personal_info_description": "Por favor, indica los siguientes datos personales de tu agente.",
        "personal_info_name_label": "Nombre",
        "personal_info_name_placeholder": "Introduce el nombre del agente",
		// TC: "Empleador" is the correct word, but the officially translated character sheets use "Compañía o agencia" instead.
        "personal_info_employer_label": "Compañía o agencia",
        "personal_info_employer_placeholder": "Introduce el empleador",
        "personal_info_sex_label": "Género",
        "personal_info_sex_placeholder": "Introduce el género",
        "personal_info_nationality_label": "Nacionalidad",
        "personal_info_nationality_placeholder": "Introduce la nacionalidad",
        "personal_info_age_label": "Edad",
        "personal_info_age_placeholder": "Introduce la edad",
        "personal_info_dob_label": "Fecha de nacimiento",
        "personal_info_dob_placeholder": "Introduce la fecha de nacimiento",
        
        // ====================================================================
        // SUMMARY / FINAL STEP
        // ====================================================================
        
        "summary_title": "Resumen del expediente del agente",
        "summary_label_name": "Nombre:",
        "summary_label_profession": "Profesión:",
        "summary_label_employer": "Compañía o agencia:",
        "summary_label_nationality": "Nacionalidad:",
        "summary_label_sex": "Género:",
        "summary_label_age_dob": "Edad/Nacimiento:",
        // NOTE: D.O.B. = Date of Birth
        
        "summary_label_education": "Educación/Vida Laboral:",
        "summary_label_statistical_data": "Datos característicos",
        "summary_label_psychological_data": "Datos psicológicos",
        "summary_col_statistic": "Característica",
        "summary_col_score": "Valor",
        "summary_col_x5": "x5",
        "summary_col_features": "Rasgos distintivos",
        "summary_label_physical_desc": "Descripción física",
        "summary_col_derived_attribute": "Atributo",
        "summary_col_maximum_value": "Máximo",
        "summary_col_current_value": "Actual",
        
        "profession_label": "Profesión",
        "statistics_label": "Característica",
        "derived_attributes_label": "Atributos derivados",
        "skills_label": "Habilidades",
        "bonds_summary_label": "Lazos",
        "motivations_summary_label": "Motivaciones",
        "not_selected": "No seleccionado",
        "not_defined": "No definido",
        
        "btn_print_summary": "Imprimir expediente",
        "btn_export_json": "Exportar como JSON",
        "btn_download_txt": "Descargar como TXT",
        
        "summary_section_personal_details": "Detalles personales",
        "summary_section_profession": "Profesión",
        "summary_section_statistics": "Características",
        "summary_section_derived_attr": "Atributos derivados",
        "summary_section_skills": "Habilidades",
        "summary_section_bonds": "Lazos",
        "summary_section_motivations": "Motivaciones",
        "summary_section_traumatic_background": "Antecedentes traumáticos",
        
        "summary_placeholder_name": "Nombre: _______________",
        "summary_placeholder_age": "Edad: __________",
        "summary_placeholder_sex": "Género: __________",
        "summary_placeholder_employer": "Compañía o agencia: ________________________",
        "summary_placeholder_nationality": "Nacionalidad: _____________________",
        
        // ====================================================================
        // CHARACTER MANAGEMENT
        // ====================================================================
        
        "character_list_title": "Personajes guardados",
        "no_characters_saved": "Ningún personaje se ha guardado todavía.",
        "view_character": "Ver",
        "delete_character": "Borrar",
        "rename_character": "Renombrar",
        "edit_name": "Editar nombre",
        "enter_new_name": "Introducir nuevo nombre:",
        "confirm_delete_character": "¿Estás seguro de querer eliminar a {name}?",
        "back_to_list": "Volver a lista",
        "character_not_found": "Personaje no encontrado.",
        "storage_limit_reached": "Límite de almacenamiento alcanzado. Se puede guardar un máximo de {limit} personajes. Por favor eliminar un personaje antes de guardar uno nuevo.",
        
        // ====================================================================
        // SHARING & IMPORT/EXPORT
        // ====================================================================
        
        "share_character": "Compartir personaje",
        "share_url_copied": "¡Enlace para compartir copiado en el portapapeles!",
        "share_error": "Error creando enlace para compartir",
        "import_character": "Importar personaje (JSON)",
        "import_success": "¡Personaje importado exitosamente!",
        "import_error": "Error importando personaje",
        "own_characters_title": "Mis personajes",
        "imported_characters_title": "Personajes importados",
        "characters_title": "Personajes",
        "create_character": "Crear personaje",
        "imported_character_label": "Importado",
        
        "made_by_others_title": "Creado por otros",
        "made_by_others_info": "Ayuda a mantener este espacio limpio: Denuncia los personajes incompletos o con contenido o texto ofensivo. Serán eliminados inmediatamente y revisados eventualmente.",
        "made_by_others_filter_all": "Todas las profesiones",
        "made_by_others_filter_custom": "Personalizados",
        "made_by_others_filter_empty": "Aún no hay personajes que coincidan con esta profesión.",
        "made_by_others_filter_aria_label": "Filtrar personajes de la comunidad por profesión",
        
        "load_from_database": "Importar",
        "load_more_characters": "Cargar más",
        "loading": "Cargando...",
        "load_more_error": "Error cargando más personajes",
        "upload_to_database": "Subir a base de datos",
        "uploading": "Subiendo...",
        "upload_success": "¡Personaje subido exitosamente!",
        "upload_error": "Error subiendo personaje",
        "upload_blocked_content": "El personaje contiene contenido prohibido y no puede ser subido.",
        "report_character": "Denunciar",
        "report_reason_prompt": "Por favor, indica el motivo por el que denuncias a este personaje:",
        "report_success": "Gracias por denunciar. Este personaje ha sido marcado para revisión.",
        "report_error": "Error denunciando personaje",
        "moderation_pending": "Esperando revisión",
        
        // ====================================================================
        // CUSTOM PROFESSION CREATION
        // ====================================================================
        
        "profession_custom_build_name": "Construcción de profesión personalizada",
        "label_custom_profession_name": "Indica el nombre de la profesión:",
        "custom_prof_title_bond_setup": "Profesión personalizada: Parte 1 - Indica Lazos & puntos de habilidad iniciales",
        "custom_prof_info_rules_title": "Pautas para crear una profesión personalizada:",
        "custom_prof_info_pick_skills": "Selecciona diez habilidades clave que definen esta nueva profesión.",
        "custom_prof_info_divide_points": "Tienes <strong>{totalPoints}</strong> puntos (base 400, modificado por los Lazos) para distribuir entre estas 10 habilidades.",
        "custom_prof_info_add_to_start": "Estos puntos asignados se añadirán al valor por defecto (base) de cada habilidad.",
        "custom_prof_info_rule_of_thumb": "Como regla general, intenta que el valor de las habilidades oscile entre 30% y 50% después de añadir estos puntos.",
        "custom_prof_info_max_skill": "Ninguna habilidad escogida puede tener un valor superior a 60% luego de asignar estos puntos (base + asignados).",
        "custom_prof_info_default_bonds": "Una profesión personalizada comienza con 3 Lazos por defecto.",
        "custom_prof_info_customize_bonds": "Ajustar Lazos: Gana 50 puntos de habilidad por cada Lazo eliminado (minimum 1). Pierde 50 puntos por cada Lazo añadido (máximo 4).",
        "custom_prof_label_current_bonds": "Lazos actuales:",
        "custom_prof_label_skill_point_budget": "Total de puntos de habilidad:",
        "custom_prof_btn_confirm_bonds": "Confirmar Lazos & continuar a asignación de habilidades",
        "custom_prof_title_skill_allocation": "Profesión personalizada: Parte 2 - Asignar puntos de habilidad",
        "custom_prof_info_skill_allocation": "Escoge hasta 10 habilidades y asigna tus <strong>{currentBudget}</strong> puntos. Recuerda, ninguna habilidad puede superar el 60% (base + asignados). Puntos restantes: <strong id='custom-skill-points-remaining'>{remainingPoints}</strong>",
        "custom_prof_skills_selected_label_prefix": "Habilidades escogidas:",
        "custom_prof_label_assign_points": "Puntos asignados:",
        "custom_prof_label_skill_total": "Resultado total:",
        "custom_prof_btn_confirm_skills": "Finalizar habilidades",
        "alert_max_10_custom_skills": "Debes seleccionar 10 habilidades.",
        "alert_distribute_all_custom_points": "Todos los {totalBudget} puntos de habilidad deben ser asignados. Te quedan {remainingPoints} puntos.",
        "alert_custom_skill_max_60": "La habilidad \"{skillName}\" no puede superar el 60% con los puntos asignados.",
        "alert_specify_type_for_custom_skill": "Por favor indica un tipo específico para la habilidad personalizada \"{skillName}\"."
    }
};

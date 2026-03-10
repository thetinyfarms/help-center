# Help Center Rewrite Plan

## Overview
Rewriting the tinyverse help center documentation entry by entry, verifying each against actual functionality before proceeding to the next. This plan addresses structural issues, removes unavailable features, consolidates redundancies, and ensures consistent branding and tone.

> [!warning]
> The codebase may contain features in development that are not yet available to users. Each entry must be verified against the master branch to ensure we only document live, accessible functionality.

---

## General Writing Guidelines

### Branding & Tone
- **"tinyverse"** always lowercase with article: "The tinyverse is..." not "Tinyverse is..."
- **Avoid technical jargon**: Use simple language (e.g., "smart devices" instead of "IoT devices", avoid "WebSocket", "Blockly", "PWA")
- **Device-agnostic**: Describe features for "devices" in general, not specifically "TinyFarm" (planning non-Tiny device support)
- **Professional but approachable**: Clear, concise, helpful - avoid unnecessary superlatives

### Terminology Consistency
- "My experiments page" (not "Experiments page")
- "Class project" (not just "project")
- "The tinyverse" (with article)
- "Smart devices" or just "devices" (not "IoT devices")
- "Class ID" (not "class code")

### Entry Format Template
Use this structure for each entry:

```markdown
## Entry Title

[Brief 1-2 sentence description of what this feature does]

[Optional paragraph for additional context - only if needed]

**Key features:**
- Feature 1
- Feature 2
- Feature 3

**How to use:**
1. Step 1
2. Step 2
3. Step 3

> [!tip]
> Helpful tip here

> [!warning]
> Warning or troubleshooting note

**Related:** Link to related entries

📷 *Screenshot: [description of what should be shown]*

🎥 *Video tutorial: [description of what should be covered]* (optional)
```

**Format Guidelines:**
- Avoid unnecessary subsections with bold labels (like "**Tips:**" or "**Common issues:**")
- Use heading elements (h3 `###`) for subsections when truly needed
- Keep h3 subsections to a minimum - only when organizing complex content
- Callouts should stand alone without bold labels
- Let content flow naturally without over-structuring
- **Media placement:** Screenshots and videos should be placed exactly where they would appear in the final version, not just at the end. Place them adjacent to the content they illustrate.
- **No numbers in titles:** Entry titles should NOT include numbers (e.g., "Creating a Teacher Account" not "1.2 Creating a Teacher Account"). Numbers are only for internal organization in filenames and the plan structure. This makes entries cleaner and ready for final help center implementation.

### Content Guidelines
- **Numbered lists** for step-by-step instructions
- **Bullet lists** for feature descriptions, options, tips
- **Paragraphs** for conceptual explanations only (use sparingly)
- **Consistent perspective:** Maintain the same point of view throughout an entry (e.g., don't switch between "students need to..." and "you need to...")
- **Avoid redundancy:** Don't repeat the same information in multiple subsections. Integrate details inline where they're most relevant rather than creating separate "What you need" and "How to do it" sections that duplicate information
- **Conciseness:** Focus on the primary/most common way to do things. Avoid listing every possible method unless truly necessary
- **Callouts** using Obsidian/GitHub alert syntax:
  - `> [!tip]` for tips and helpful suggestions
  - `> [!info]` for important information (use for lists of options, available choices, or secondary details to keep main text clean)
  - `> [!warning]` for warnings and cautions
- **Move details to callouts:** When there are lists of available options (languages, formats, etc.), consider placing them in `[!info]` callouts rather than inline in the main text to improve readability
- **Screenshot placeholders** - Include placeholders like `📷 *Screenshot: [description of what the screenshot should show]*` positioned exactly where they should appear in the final entry, with captions when needed for context
- **Video placeholders** - Include placeholders like `🎥 *Video tutorial: [description of what the video should cover]*` positioned exactly where they should appear in the final entry
- **Cross-references** - Always link to other sections when mentioned, including:
  - In body text (e.g., "Go to your [My experiments page](#31-creating-new-experiment)")
  - In callouts (e.g., "Students can also [join your class themselves](#14-how-students-join-class)")
  - In Related sections (e.g., "[Managing Students](#04-managing-students)")
  - Use anchor links with the format: `[Link Text](#section-number-slug)` where slug matches the filename
- **Each entry verified** against master branch functionality before moving to next

---

## New Structure

### 1. Getting Started
- **1.1 What is the tinyverse?** - Overview of platform, who it's for, key capabilities
- **1.2 Creating a Teacher Account** - Registration with email or SSO (Google/Microsoft)
- **1.3 Teacher Onboarding** - Language and school selection process
- **1.4 How Students Join a Class** - Class ID, username, PIN system
- **1.5 Navigating the Dashboard** - Separate teacher and student dashboard layouts
- **1.6 Language & Theme Settings** - How to change language and switch light/dark mode

### 2. Classes & Students (TEACHERS ONLY)
- **2.1 Creating a Class** - How to create and name a class
- **2.2 Sharing the Class ID with Students** - Copy ID, join link, share dialog
- **2.3 Adding Students Manually** - Pre-creating student accounts
- **2.4 Managing Students** - View list, look up/reset PINs, remove students
- **2.5 Managing Class Devices** - Adding devices to a class (verify current functionality - comment suggests this doesn't make devices available to all students yet)
- **2.6 Managing Class Projects** - Turn experiments into class projects
- **2.7 Tracking Class Projects** - View student experiments created from projects

### 3. Experiments
- **3.1 Creating a New Experiment** - Title, description, language selection
- **3.2 Understanding the Experiment Editor** - Module toolbar, page tabs, canvas overview (brief - details in 3.4 and 3.5)
- **3.3 Working with Pages** - Add, reorder, rename, change icon, duplicate, delete
- **3.4 What is a Module?** - NEW ENTRY - Define modules, common parts (title, content, footer), common configuration (color, visibility, data source), common actions (duplicate, lock, delete)
- **3.5 Adding & Arranging Modules** - Drag from toolbar, click to add, resize, snap to grid, select and configure
- **3.6 Managing Experiments** - Edit details, duplicate, delete, share link, turn into class project

### 4. Modules
*Each entry focuses ONLY on module-specific features - do NOT repeat how to add/configure (covered in 3.4 and 3.5)*

- **4.1 Sensor Module** - Live sensor readings, device selection, sensor types available
- **4.2 Control Module** - Device controls: lights (RGB, wavelength, intensity), water pump, nutrient pump, fan
- **4.3 Chart Module** - Historical data visualization, line/bar charts, time ranges, legend, export options (3 formats)
- **4.4 Table Module** - Display sensor data or custom data, sorting, pagination, import/export (CSV, Excel, image)
- **4.5 Camera Module** - Take photos, view latest image, timelapse playback, download options
- **4.6 Gallery Module** - Browse all photos, group by week/month, select multiple, download ZIP, timelapse from selection
- **4.7 Media Module** - Upload images/videos, paste YouTube links, AI image generation, captions
- **4.8 Text Module** - Rich text editor with formatting, headings, lists, colors, links
- **4.9 Note Module** - Quick sticky notes, basic formatting, style options
- **4.10 Divider Module** - Visual separator, auto-orientation
- **4.11 Bit Module** - Embed info cards from Bit Library, create custom bits
- **4.12 Link Module** - Display web links as preview cards with auto-fetched metadata
- **4.13 Program Module** - Visual block programming workspace (overview - details in Section 6)

### 5. Devices
- **5.1 Adding a Device to an Experiment** - Device name and PIN authentication
- **5.2 Understanding Device Status** - Online/offline indicators, last-seen timestamp, connection issues (merge troubleshooting here)
- **5.3 Viewing Device Data** - Where device data appears (sensor modules, charts, tables), data retention policy (verify how long data is stored)

### 6. Block Programming
- **6.1 Introduction to Block Programming** - What it is, who it's for, capabilities (use simple language - avoid "Blockly")
- **6.2 The Programming Workspace** - Toolbox, workspace, toolbars (top AND bottom - verify actual controls)
- **6.3 Available Blocks** - Base, Logic, Loops, Device-specific categories
- **6.4 Saving & Sharing Programs** - Save to experiment, share with class
- **6.5 Running Programs** - Send to device, running status, stop button
- **6.6 Device Locks** - Manual locking with code, duration options, unlocking (verify if device auto-locks when program runs)
- **6.7 Example Programs** - Where to find them, common patterns

### 7. Group Experiments (STUDENTS ONLY)
- **7.1 Working in Groups** - Creating groups, inviting classmates, accepting invitations
- **7.2 Real-Time Collaboration** - Who's viewing, real-time updates
- **7.3 Group Notifications** - Viewing invites, member updates, mark as read
- **7.4 Leaving a Group** - How to leave, what happens to the experiment

### 8. Community (TEACHERS ONLY)
- **8.1 Browsing Community Experiments** - Trending/Recent sorting, language filter
- **8.2 Viewing a Community Experiment** - Preview pages, see devices used, author info
- **8.3 Duplicating an Experiment** - Create editable copy, where it appears
- **8.4 Publishing Your Experiment** - Share dialog, public visibility, automatic translations

### 9. Data & Export
- **9.1 Exporting Chart Data** - 3 export options (verify formats), where data comes from
- **9.2 Exporting Table Data** - Download button in module actions, 2 data formats + image option
- **9.3 Importing Table Data** - Import with empty module or from import button, supported formats
- **9.4 Downloading Photos & Timelapses** - Single photos, multiple as ZIP, timelapse video generation (camera auto timelapse + gallery period/selection timelapses)

### 10. Account & Settings
- **10.1 Teacher Profile Settings** - Display name, email, school affiliation, other options (verify all available settings)
- **10.2 Student Profile Settings** - Username, PIN, language, theme
- **10.3 Changing Your Email** - Dual confirmation process (verify if both emails need confirmation)
- **10.4 Resetting Your Password** - Forgot password flow (teachers), teacher resets student PIN
- **10.5 Deleting Your Account** - Permanent deletion, data removal, export first
- **10.6 Email Preferences** - Unsubscribe options

### 11. AI Features & Data Privacy
*Consolidated section addressing AI functionality and data usage*

- **11.1 AI Image Generation** - Where available (Media module, experiment thumbnails), how to use
- **11.2 Automatic Experiment Translation** - When translations are generated (on publish), how to access different languages
- **11.3 How We Use Your Data with AI** - What data is processed, safety measures, privacy protections

### 12. Help & Feedback
- **12.1 Submitting Feedback** - Accessing from (?) button, give feedback vs report bug, available tags/options (verify actual form fields)
- **12.2 Content Moderation** - Current moderation approach (verify - comment suggests minimal active moderation)

### 13. FAQ / Troubleshooting
- **13.1 My device shows offline - what do I do?** - Power, WiFi, restart steps (reference 5.2)
- **13.2 I can't control a device** - Check online status, device locks (reference 6.6)
- **13.3 A student forgot their PIN** - Teacher reset from class page (reference 2.4)
- **13.4 Device is locked** - Manual locks vs program locks (verify if programs auto-lock), how to unlock
- **13.5 My chart shows no data** - Device linked, online, time range, data availability
- **13.6 How do I change the interface language?** - Settings + bottom right corner toggle
- **13.7 Can I use the tinyverse without a device?** - Yes - manual modules
- **13.8 How do I share my experiment with students?** - Class projects (reference 2.6), share link (verify if link sharing works)
- **13.9 Can multiple students use the same device?** - Yes - simultaneous viewing, one program at a time (verify)
- **13.10 What browsers does the tinyverse support?** - Chrome, Safari, Firefox, Edge; better on tablets/laptops than phones; clarify PWA availability

---

## Sections REMOVED (Not Yet Implemented)
- **School Management** - Not accessible in current version
- **Orbie AI Assistant** - Not yet available (note: AI image generation and translation ARE available under different UI)
- **AI Experiment Generator** - Not yet available

---

## High-Priority Fixes Applied

1. ✅ Fixed section numbering consistency
2. ✅ Removed unavailable features (School Management, Orbie, AI generation)
3. ✅ Added new entry 3.4 "What is a Module?" before individual module types
4. ✅ Consolidated device status + troubleshooting into single entry (5.2)
5. ✅ Removed redundant "how to add module" instructions (covered once in 3.5)
6. ✅ Separated teacher-only and student-only sections clearly
7. ✅ Standardized "tinyverse" branding throughout
8. ✅ Replaced technical jargon with simple language
9. ✅ All AI features consolidated into Section 11 with data privacy info

---

## Implementation Process

### For Each Entry:
1. **Draft** - Write entry following format template and guidelines above
2. **Review** - User verifies against actual UI/functionality in master branch
3. **Revise** - Address feedback and corrections
4. **Approve** - Move to next entry
5. **Create MD file** - Save approved entry to `/help-center/[section-folder]/[entry-file].md`

### Folder Structure:
```
help-center/
├── 01-getting-started/
├── 02-classes-and-students/
├── 03-experiments/
├── 04-modules/
├── 05-devices/
├── 06-block-programming/
├── 07-group-experiments/
├── 08-community/
├── 09-data-and-export/
├── 10-account-and-settings/
├── 11-ai-features/
├── 12-help-and-feedback/
├── 13-faq-troubleshooting/
└── PLAN.md (this file)
```

### Entry Filename Format:
- Use section number + descriptive slug
- Example: `01-what-is-tinyverse.md`, `02-creating-teacher-account.md`

---

## Questions to Resolve During Writing

These require verification against actual functionality:

1. **Device locks** (6.6, 13.4) - Do programs automatically lock devices, or only manual locks?
2. **Class devices** (2.5) - Does adding a device to a class make it available to all students, or just saved in teacher's account?
3. **Data retention** (5.3, 9.1) - How long is sensor data stored? Every data point forever or aggregated over time?
4. **Email change** (10.3) - Does it require confirmation from both old and new email?
5. **Share link** (3.6, 13.8) - Is direct link sharing functional for experiments, or only class projects?
6. **Multiple programs** (13.9) - Can multiple programs run on one device simultaneously, or only one at a time?
7. **PWA** (13.10) - Is progressive web app install actually available?
8. **Moderation** (12.2) - What content moderation is actually active? AI filtering on generation only?
9. **Language availability** (1.6) - Should be dynamic based on database, not hardcoded list
10. **Experiment translation** (11.2) - Only happens on publish to community, or available for private experiments too?

---

## Next Steps

1. Create folder structure in `/help-center/`
2. Begin with **Section 1: Getting Started**
3. Write and review entries one by one
4. Address questions/verifications as they arise
5. Maintain this PLAN.md with progress tracking

---

## Progress Tracker

- [ ] Section 1: Getting Started (0/6)
- [ ] Section 2: Classes & Students (0/7)
- [ ] Section 3: Experiments (0/6)
- [ ] Section 4: Modules (0/13)
- [ ] Section 5: Devices (0/3)
- [ ] Section 6: Block Programming (0/7)
- [ ] Section 7: Group Experiments (0/4)
- [ ] Section 8: Community (0/4)
- [ ] Section 9: Data & Export (0/4)
- [ ] Section 10: Account & Settings (0/6)
- [ ] Section 11: AI Features (0/3)
- [ ] Section 12: Help & Feedback (0/2)
- [ ] Section 13: FAQ / Troubleshooting (0/10)

**Total: 0/75 entries completed**

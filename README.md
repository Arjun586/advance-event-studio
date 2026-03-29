# Advanced Event Studio

A mini JavaScript web app built to learn modern DOM events in a practical, industry-style way.

This project focuses on **real event-driven UI behavior** instead of toy examples. It is designed to help you understand not only how to use events, but also why professional frontend apps structure event handling in a certain way.

## Project Goal

Build a small interactive task studio that teaches:
- Click events
- Form submission events
- Input events
- Keyboard events
- Event delegation
- Pointer events
- DOM updates from user interaction

The idea is to move from beginner-level event handling to more advanced, scalable patterns used in real applications.

## Features

### Step 1 features
- Toggle light and dark theme
- Filter tasks by status
- Live title validation while typing
- Intercept form submission with `preventDefault()`
- Create new task cards dynamically
- Show interaction logs in the UI

### Advanced features planned or added later
- Event delegation for toolbar and task actions
- Keyboard shortcuts
- Pointer-based interactions
- Drag behavior
- Better state management
- Cleaner reusable event architecture

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Fontshare fonts

No framework is used. This is intentional so the event system stays clear and easy to inspect.

## Why this project matters

In real frontend development, events are everywhere:
- Buttons trigger UI actions
- Forms submit user data
- Inputs validate as users type
- Keyboard shortcuts improve productivity
- Pointer and touch events improve interaction quality

This project helps you practice these ideas in one place.

## Folder Structure

```bash
project-folder/
├── advanced-event-studio.html
└── README.md
```

If you later split the project, you can use:

```bash
project-folder/
├── advanced-event-studio.html
├── styles/
│   └── style.css
├── scripts/
│   └── app.js
└── README.md
```

## How to Run

1. Download or clone the project.
2. Open `advanced-event-studio.html` in your browser.
3. Start testing the interactions.

No build step or package installation is required.

## What you learn in Step 1

### 1. `addEventListener()`
Used to register event handlers on elements.

Examples in this project:
- Theme button click
- Toolbar click
- Input typing
- Form submit

### 2. `preventDefault()`
The form normally reloads the page when submitted.
We stop that default browser behavior so JavaScript can validate and update the UI manually.

### 3. `input` event
Runs whenever the user types in the title field.
This is useful for live validation.

### 4. Event delegation
Instead of attaching a separate listener to every filter button, one listener is attached to the toolbar parent.
That listener figures out which child button was clicked.

This pattern is more scalable and is commonly used in production apps.

## Current App Flow

1. User clicks a filter button.
2. The toolbar listener detects which filter was clicked.
3. Matching tasks stay visible.
4. User types a title.
5. Input validation runs immediately.
6. User submits the form.
7. JavaScript prevents page reload.
8. A new task card is created and inserted into the DOM.
9. An action log is added.

## Key Concepts Practiced

- DOM selection
- Event listeners
- Event objects
- `event.target`
- `closest()`
- `dataset`
- Form handling
- Dynamic DOM creation
- UI feedback
- Conditional rendering with JavaScript

## Common Mistakes This Project Helps Avoid

- Using `onclick` everywhere instead of `addEventListener()`
- Listening to button click instead of form `submit`
- Forgetting `preventDefault()` on forms
- Writing duplicated listeners for similar controls
- Updating UI without validating user input
- Mixing logic and DOM code in a messy way

## Suggested Learning Path

### Beginner
- Understand click, input, and submit events
- Learn DOM selection
- Learn how values are read from form fields

### Intermediate
- Understand bubbling
- Learn event delegation
- Add keyboard shortcuts
- Refactor repeated logic into reusable functions

### Advanced
- Add pointer events
- Add drag interactions
- Build a small state-driven architecture
- Separate UI rendering from event wiring

## Practice Tasks

Try these after completing Step 1:

1. Add a task count section.
2. Add a delete button to every card.
3. Use event delegation for delete actions.
4. Add keyboard shortcut `/` to focus the title input.
5. Add keyboard shortcut `Escape` to clear the current input.
6. Add a status badge style for each task.

## Interview Preparation

Use this project to answer questions like:

- What is the difference between `click`, `input`, and `submit` events?
- Why do we use `preventDefault()`?
- Why is event delegation useful?
- What is bubbling in JavaScript events?
- Why is listening on the form better than listening on the submit button?
- How do dynamically added elements still work with delegated events?

## Behind the Scenes

When a user interacts with the page, the browser creates an event object and sends it through the event system.
Your listener runs only when that event reaches the target you registered for.

For delegated events, the event first happens on a child element, then bubbles upward to its parent. That is why a parent listener can react to child clicks.

For forms, the browser wants to perform a default action like page navigation or reload. `preventDefault()` stops that so your app stays in control.

## Future Improvements

- Add drag and drop behavior
- Add pointer tracking area
- Add keyboard navigation support
- Add local state object
- Refactor code into modules
- Add accessibility improvements
- Add animations carefully

## Suggested Commit Messages

- `feat: build base event studio layout`
- `feat: add toolbar filter events`
- `feat: implement live form validation`
- `feat: handle form submit and create tasks`
- `feat: add advanced delegated event handling`

## Daily Progress Plan

### Complete today
- Base UI layout
- Theme toggle
- Filter buttons
- Live validation
- Safe form submission

### Improve tomorrow
- Keyboard events
- Better event delegation
- More reusable functions
- Cleaner state management

## Final Note

This project is not just about making a task app.
It is a training ground for understanding how JavaScript events work in real interfaces.

If you build this properly, explain each listener clearly, and keep improving it step by step, it becomes a strong beginner-to-intermediate JavaScript project for GitHub.

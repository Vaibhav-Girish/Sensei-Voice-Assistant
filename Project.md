# Sensei

## Project Vision

Sensei is a modern AI-powered voice assistant designed to provide natural, intelligent, and conversational interactions through voice.

Unlike a traditional chatbot, Sensei should feel like an intelligent companion that listens, thinks, and responds naturally.

The project prioritizes user experience, smooth animations, modular architecture, and clean software engineering.

---

# Objectives

Primary Goals

- Natural voice conversations
- Fast response time
- Modern user interface
- Real-time speech recognition
- Natural voice output
- Maintain conversation history

Secondary Goals

- Beautiful animations
- Modular architecture
- Easy future expansion
- Competition-quality presentation

---

# Technology Stack

Frontend

- HTML5
- CSS3
- Vanilla JavaScript

Backend

- Python
- FastAPI

AI

- Google Gemini 2.5 Flash API

Voice Recognition

- Browser Web Speech API

Voice Output

- Browser SpeechSynthesis API

Version Control

- Git
- GitHub

IDE

- Antigravity

---

# Folder Structure

```text
Sensei/

├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── gemini.py
│   │   ├── config.py
│   │   ├── prompts.py
│   │   └── models.py
│   │
│   ├── requirements.txt
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── assets/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── docs/
├── screenshots/
│
├── README.md
├── plan.md
├── LICENSE
└── PROJECT.md
```

---

# Architecture

Browser

↓

Speech Recognition

↓

Frontend

↓

FastAPI Backend

↓

Gemini API

↓

Response

↓

Speech Synthesis

↓

User

---

# Assistant States

The assistant must always be in one of the following states.

Idle

Listening

Understanding

Thinking

Speaking

These states should drive animations and UI.

---

# User Flow

User opens application

↓

Animated home screen

↓

User presses microphone

↓

Speech Recognition starts

↓

Speech converted to text

↓

Request sent to backend

↓

Gemini generates response

↓

Frontend receives response

↓

Typing animation

↓

Speech output

↓

Conversation saved

↓

Wait for next interaction

---

# UI Design

Theme

Modern

Minimal

Dark

Glassmorphism

Accent Color

Blue

Purple

Cyan gradients

Typography

Inter

Spacing

Large

Rounded Corners

20px

Animations

Glow

Fade

Scale

Pulse

Typing Indicator

Speaking Animation

Listening Wave

---

# Homepage Layout

--------------------------------------------------

Sensei

Animated AI Orb

Status

Conversation Window

Microphone Button

Settings Button

--------------------------------------------------

---

# Components

Frontend

App

Chat

Orb

Status Indicator

Microphone Button

Message Card

Typing Indicator

Backend

Gemini Client

Prompt Manager

Configuration

Models

API Server

---

# Coding Standards

Use descriptive variable names.

Separate logic into functions.

Avoid duplicate code.

Keep functions small.

Use async where appropriate.

Comment only where necessary.

---

# Future Features

Wake Word

Weather

Calculator

Clipboard

PDF Assistant

Email Assistant

Calendar

File Summarizer

Vision

Offline Mode

Multi-language Support

---

# Competition Focus

The judging criteria should prioritize

- Smooth user experience
- Beautiful interface
- Reliable voice interaction
- Fast response
- Clean architecture
- Professional code structure

Do not overcomplicate the project.

A polished, complete assistant is preferred over many unfinished features.
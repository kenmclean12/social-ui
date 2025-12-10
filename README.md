## React Social Media UI
A fully-featured social media web application built with React, Vite, React Query, and Material UI. This frontend integrates with the social-api NestJS backend and uses WebSockets for real-time messaging and notifications.

## Features
Authentication: Login, registration, auto-refreshing access tokens, and protected routes with persistent sessions.

Personalized Feed: Infinite scrolling feed based on followed users, with live updates through React Query.

Explore Feed: View global posts and discover new users and content.

Posts: Create posts with text or media, view post details, and interact with them.

Comments & Replies: Threaded comments with replies, real-time updates, and dynamic comment sections.

Likes & Follows: Like posts, follow users, and see updates instantly through cache updates and WebSocket events.

User Profiles: View and edit profile details, posts, followers, and followings.

Search: Debounced server-side search for users by first name, last name, email, or username.

Messages & Conversations: Real-time messaging system with multi-member conversations powered by WebSockets.

Live Notifications: Receive real-time notifications for likes, follows, comments, messages, and other user actions.

Optimistic UI: Fast interface updates powered by React Query mutations and intelligent caching.

Responsive UI: Built entirely with Material UI and custom layout components.

## Technologies
React (Vite)

React Query

Material UI

Axios

WebSockets (for live messages and notifications)

React Router

TypeScript

## Getting started
## Prerequisites
Node.js 20+

A running instance of the social-api NestJS backend

Valid environment variables for API URL
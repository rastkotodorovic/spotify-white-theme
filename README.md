# Spotify Clone

A full-featured Spotify web client built with Next.js 15, React 18, and the Spotify Web API. Authenticate with your real Spotify account to browse your library, control playback, manage playlists, and discover new music — all from a clean, light-themed UI.

## Features

### Playback
- Full playback controls (play, pause, skip, previous)
- Seek bar and volume slider with debounced updates
- Device switcher — transfer playback between your Spotify Connect devices
- Queue panel showing upcoming tracks
- Add any track to the playback queue

### Library
- Browse your saved playlists, albums, artists, and liked tracks
- Follow and unfollow artists and albums
- Save and remove tracks from your library
- View user profiles

### Playlists
- Create new playlists with name and description
- Rename and delete playlists you own
- Add tracks to any of your playlists from every track row
- Remove tracks from playlists you own

### Discovery
- Home page with featured playlists, new releases, and recently played albums/tracks
- Personalized recommendations based on your top artists and tracks
- Artist detail pages with top tracks, albums, and related artists
- Search across tracks, albums, artists, and playlists

### Search
- Real-time search with debounced input
- Results grouped by tracks, albums, artists, and playlists

## Tech Stack

- **Next.js 15** (App Router) with **React 18** and **TypeScript**
- **Tailwind CSS 3** for styling
- **NextAuth v4** with Spotify OAuth provider
- **Zustand** for client-side state management
- **spotify-web-api-node** as the Spotify API client
- **@headlessui/react** and **@heroicons/react** for UI components

## Prerequisites

- Node.js 18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) application
- A Spotify Premium account (required for playback control)

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/rastkotodorovic/spotify-white-theme.git
   cd spotify-white-theme
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a Spotify app**

   Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), create a new app, and add `http://localhost:3000/api/auth/callback/spotify` as a Redirect URI.

4. **Configure environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |----------|-------------|
   | `NEXTAUTH_URL` | Your app URL, e.g. `http://localhost:3000` |
   | `SPOTIFY_ID` | Client ID from your Spotify app |
   | `SPOTIFY_SECRET` | Client Secret from your Spotify app |
   | `JWT_SECRET` | Any random secret string for signing JWTs |

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) and log in with your Spotify account.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |

## Project Structure

```
app/                    # Next.js App Router pages
  (main)/               # Authenticated routes (home, search, collection, users)
  login/                # Login page
  api/auth/             # NextAuth API route
components/
  layout/               # Shell layout — sidebar, header, player
    player/             # Playback controls, seek bar, volume
    sidebar/            # Navigation, profile, search, playlist list
  shared/               # Reusable components — Card, Track, Tracks (infinite scroll)
  album/                # Album detail page
  artist/               # Artist detail page
  playlist/             # Playlist detail, create modal, add-to-playlist menu
  collection/           # Library browsing pages
  search/               # Search results
  landing/              # Home page content
  user/                 # User profile page
hooks/                  # Custom React hooks (useSpotify, useAccessToken, etc.)
lib/                    # Spotify API helpers and utilities
store/                  # Zustand stores for player, playlist, queue, device state
```

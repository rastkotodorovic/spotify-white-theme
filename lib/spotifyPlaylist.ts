import spotifyFetch from './spotifyFetch'

type CreatePlaylistOptions = {
  description?: string
  public?: boolean
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  options: CreatePlaylistOptions = {}
): Promise<any> {
  return spotifyFetch(accessToken, `/users/${userId}/playlists`, {
    method: 'POST',
    body: {
      name,
      description: options.description || '',
      public: options.public ?? false,
    },
  })
}

export async function updatePlaylistDetails(
  accessToken: string,
  playlistId: string,
  details: { name?: string; description?: string }
): Promise<void> {
  return spotifyFetch(accessToken, `/playlists/${playlistId}`, {
    method: 'PUT',
    body: details,
  })
}

export async function unfollowPlaylist(
  accessToken: string,
  playlistId: string
): Promise<void> {
  return spotifyFetch(accessToken, `/playlists/${playlistId}/followers`, {
    method: 'DELETE',
  })
}

export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  trackUris: string[]
): Promise<any> {
  return spotifyFetch(accessToken, `/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: { uris: trackUris },
  })
}

export async function removeTracksFromPlaylist(
  accessToken: string,
  playlistId: string,
  trackUris: string[]
): Promise<any> {
  return spotifyFetch(accessToken, `/playlists/${playlistId}/tracks`, {
    method: 'DELETE',
    body: {
      tracks: trackUris.map((uri) => ({ uri })),
    },
  })
}

export async function reorderPlaylistTracks(
  accessToken: string,
  playlistId: string,
  rangeStart: number,
  insertBefore: number,
  rangeLength: number = 1
): Promise<any> {
  return spotifyFetch(accessToken, `/playlists/${playlistId}/tracks`, {
    method: 'PUT',
    body: {
      range_start: rangeStart,
      insert_before: insertBefore,
      range_length: rangeLength,
    },
  })
}

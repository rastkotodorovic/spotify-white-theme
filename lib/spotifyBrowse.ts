import spotifyFetch from './spotifyFetch'

export async function getNewReleases(
  accessToken: string,
  options: { limit?: number; country?: string } = {}
): Promise<any> {
  return spotifyFetch(accessToken, '/browse/new-releases', {
    params: {
      limit: options.limit,
      country: options.country,
    },
  })
}

export async function getMyTopTracks(
  accessToken: string,
  options: { limit?: number } = {}
): Promise<any> {
  return spotifyFetch(accessToken, '/me/top/tracks', {
    params: {
      limit: options.limit,
    },
  })
}

export async function getRecommendations(
  accessToken: string,
  options: {
    seedArtists?: string[]
    seedTracks?: string[]
    limit?: number
  } = {}
): Promise<any> {
  return spotifyFetch(accessToken, '/recommendations', {
    params: {
      seed_artists: options.seedArtists?.join(','),
      seed_tracks: options.seedTracks?.join(','),
      limit: options.limit,
    },
  })
}

export async function getArtistTopTracks(
  accessToken: string,
  artistId: string,
  market: string = 'US'
): Promise<any> {
  return spotifyFetch(accessToken, `/artists/${artistId}/top-tracks`, {
    params: { market },
  })
}

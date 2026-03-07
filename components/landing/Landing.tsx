'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import useSpotify from '../../hooks/useSpotify'
import useAccessToken from '../../hooks/useAccessToken'
import { getMyPlaylists } from '../../lib/spotifyLibrary'
import { getNewReleases, getMyTopTracks, getRecommendations } from '../../lib/spotifyBrowse'
import Cards from '../shared/Cards'
import Tracks from '../shared/Tracks'

export default function Landing() {
    const { data: session } = useSession()
    const spotifyApi = useSpotify()
    const accessToken = useAccessToken()
    const [ featuredPlaylists, setFeaturedPlaylists ] = useState<any[]>([])
    const [ topArtists, setTopArtists ] = useState<any[]>([])
    const [ recentAlbums, setRecentAlbums ] = useState<any[]>([])
    const [ recentlyPlayed, setRecentlyPlayed ] = useState<any[]>([])
    const [ newReleases, setNewReleases ] = useState<any[]>([])
    const [ recommendations, setRecommendations ] = useState<any[]>([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && accessToken) {
            getMyPlaylists(accessToken, { limit: 10 })
                .then((data) => {
                    setFeaturedPlaylists(data.items)
                })
                .catch(() => {})

            spotifyApi.getMyRecentlyPlayedTracks({ limit : 50 })
                    .then(function(data: { body: { items: any[] } }) {
                        setRecentlyPlayed(data.body.items)

                        const seenAlbumIds = new Set<string>()
                        const uniqueAlbums: any[] = []
                        for (const item of data.body.items) {
                            const album = item.track?.album
                            if (album && !seenAlbumIds.has(album.id)) {
                                seenAlbumIds.add(album.id)
                                uniqueAlbums.push(album)
                                if (uniqueAlbums.length >= 10) break
                            }
                        }
                        setRecentAlbums(uniqueAlbums)
                    })
                    .catch(function() {
                    })

            spotifyApi.getMyTopArtists()
                .then(function(data) {
                    setTopArtists(data.body.items)
                })
                .catch(function() {
                })

            getNewReleases(accessToken, { limit: 10, country: 'US' })
                .then(function(data) {
                    setNewReleases(data.albums.items)
                })
                .catch(function() {
                })
        }
    }, [session, spotifyApi, accessToken])

    useEffect(() => {
        if (accessToken && topArtists.length > 0) {
            getMyTopTracks(accessToken, { limit: 5 })
                .then(function(data) {
                    const seedArtists = topArtists.slice(0, 3).map((artist) => artist.id)
                    const seedTracks = data.items.slice(0, 2).map((track: any) => track.id)

                    return getRecommendations(accessToken, {
                        seedArtists,
                        seedTracks,
                        limit: 10,
                    })
                })
                .then(function(data) {
                    setRecommendations(data.tracks)
                })
                .catch(function() {
                })
        }
    }, [accessToken, topArtists])

    return (
        <div className="px-4 mt-6 mb-40 mx-8 sm:px-6 lg:px-8">
            <Cards playlists={featuredPlaylists} title="Featured playlists" href="playlist" />

            <Cards playlists={newReleases} title="New releases" href="albums" />

            <Cards playlists={topArtists} title="My top artists" href="artists" />

            {recommendations.length > 0 && (
                <>
                    <h2 className="text-gray-600 text-md font-medium tracking-wide">Recommended for you</h2>
                    <Tracks tracks={recommendations} />
                </>
            )}

            <Cards playlists={recentAlbums} title="Recently Played" href="albums" />

            <h2 className="text-gray-600 text-md font-medium tracking-wide">Recently played</h2>
            <Tracks tracks={recentlyPlayed} />
        </div>
    )
}

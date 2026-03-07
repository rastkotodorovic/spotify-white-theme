'use client'

import { SetStateAction, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import useSpotify from '../../hooks/useSpotify'
import useAccessToken from '../../hooks/useAccessToken'
import { getArtistTopTracks } from '../../lib/spotifyBrowse'
import Cards from '../shared/Cards'
import CurrentCard from '../shared/CurrentCard'
import Tracks from '../shared/Tracks'

export default function SelectedArtist() {
    const spotifyApi = useSpotify()
    const accessToken = useAccessToken()
    const params = useParams()
    const artistId = params?.artistId as string
    const [ albums, setAlbums ] = useState([])
    const [ artist, setArtist ] = useState([])
    const [ relatedArtists, setRelatedArtists ] = useState([])
    const [ topTracks, setTopTracks ] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && artistId) {
          spotifyApi.getArtist(artistId)
              .then(function(data: { body: SetStateAction<never[]> }) {
                setArtist(data.body)
              })
              .catch(function() {
              })

            spotifyApi.getArtistAlbums(artistId, { limit: 12 })
                .then(function(data: { body: { items: SetStateAction<never[]> } }) {
                  setAlbums(data.body.items)
                })
                .catch(function() {
                })

            spotifyApi.getArtistRelatedArtists(artistId)
                .then(function(data: { body: { artists: SetStateAction<never[]> } }) {
                  setRelatedArtists(data.body.artists)
                })
                .catch(function() {
                })

            if (accessToken) {
                getArtistTopTracks(accessToken, artistId)
                    .then(function(data: { tracks: SetStateAction<never[]> }) {
                      setTopTracks(data.tracks)
                    })
                    .catch(function() {
                    })
            }
        }
    }, [spotifyApi.getAccessToken(), artistId])

    return (
        <div className="px-4 mt-6 mx-8 sm:px-6 lg:px-8">
            <CurrentCard type="artist" playlist={artist} />

            {topTracks.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-gray-600 text-md font-medium tracking-wide">Top tracks</h2>
                    <Tracks tracks={topTracks} />
                </div>
            )}

            <div className="mt-10">
                <Cards playlists={albums} title="Albums" href="albums" />
            </div>

            {relatedArtists.length > 0 && (
                <div className="mt-10">
                    <Cards playlists={relatedArtists} title="Fans also like" href="artists" />
                </div>
            )}
        </div>
    )
}

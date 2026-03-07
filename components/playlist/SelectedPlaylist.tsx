'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

import Tracks from '../shared/Tracks'
import useSpotify from '../../hooks/useSpotify'
import useAccessToken from '../../hooks/useAccessToken'
import useRefreshPlaylists from '../../hooks/useRefreshPlaylists'
import { getPlaylistItems } from '../../lib/spotifyLibrary'
import { updatePlaylistDetails, unfollowPlaylist, removeTracksFromPlaylist } from '../../lib/spotifyPlaylist'
import CurrentCard from '../shared/CurrentCard'

interface Playlist {
    tracks: { items: any[] };
    id: string;
    name: string;
    owner: { id: string };
}

export default function SelectedPlaylist() {
    const spotifyApi = useSpotify()
    const accessToken = useAccessToken()
    const { data: session } = useSession()
    const router = useRouter()
    const refreshPlaylists = useRefreshPlaylists()
    const params = useParams()
    const playlistId = params?.playlistId as string
    const [ playlist, setPlaylist ] = useState(null as unknown as Playlist)
    const [ tracks, setTracks ] = useState<string[]>([])
    const [ offset, setOffset ] = useState(0)
    const [ isEditing, setIsEditing ] = useState(false)
    const [ editName, setEditName ] = useState('')
    const editInputRef = useRef<HTMLInputElement>(null)

    const isOwner = playlist && (session as any)?.user?.username === playlist.owner?.id

    useEffect(() => {
        setTracks([])
        setOffset(0)
    }, [playlistId])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && accessToken && playlistId) {
            spotifyApi.getPlaylist(playlistId)
                .then((data) => {
                    setPlaylist(data.body)
                })

            getPlaylistItems(accessToken, playlistId, { offset: offset, limit: 20 })
                .then((data) => {
                    if (tracks.length) {
                        setTracks((oldArray) => [...oldArray, ...data.items])
                    } else {
                        setTracks(data.items)
                    }
                })
        }
    }, [spotifyApi.getAccessToken(), accessToken, playlistId, offset])

    const handleStartEditing = () => {
        setEditName(playlist?.name || '')
        setIsEditing(true)
        setTimeout(() => editInputRef.current?.focus(), 0)
    }

    const handleSaveRename = () => {
        if (!accessToken || !editName.trim()) return
        updatePlaylistDetails(accessToken, playlistId, { name: editName.trim() })
            .then(() => {
                setPlaylist((previous) => ({ ...previous, name: editName.trim() }))
                setIsEditing(false)
                refreshPlaylists()
            })
            .catch(() => {})
    }

    const handleCancelEditing = () => {
        setIsEditing(false)
    }

    const handleDelete = () => {
        if (!accessToken) return
        unfollowPlaylist(accessToken, playlistId)
            .then(() => {
                refreshPlaylists()
                router.push('/collection/playlists')
            })
            .catch(() => {})
    }

    const handleRemoveTrack = (trackUri: string) => {
        if (!accessToken) return
        removeTracksFromPlaylist(accessToken, playlistId, [trackUri])
            .then(() => {
                setTracks((previous) =>
                    previous.filter((item: any) => {
                        const trackItem = item.track ? item.track : item
                        return trackItem.uri !== trackUri
                    })
                )
            })
            .catch(() => {})
    }

    return (
        <>
            <div className="px-4 mt-6 sm:px-6 lg:px-8">
                <CurrentCard type="playlist" playlist={playlist} />

                {isOwner && (
                    <div className="flex items-center space-x-3 mt-4">
                        {isEditing ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    ref={editInputRef}
                                    type="text"
                                    value={editName}
                                    onChange={(event) => setEditName(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') handleSaveRename()
                                        if (event.key === 'Escape') handleCancelEditing()
                                    }}
                                    className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                                <button
                                    onClick={handleSaveRename}
                                    className="text-green-600 hover:text-green-700"
                                    title="Save"
                                >
                                    <CheckIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleCancelEditing}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Cancel"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleStartEditing}
                                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                                title="Rename playlist"
                            >
                                <PencilIcon className="h-4 w-4" />
                                <span>Rename</span>
                            </button>
                        )}

                        <button
                            onClick={handleDelete}
                            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600"
                            title="Delete playlist"
                        >
                            <TrashIcon className="h-4 w-4" />
                            <span>Delete</span>
                        </button>
                    </div>
                )}
            </div>

            <Tracks
                tracks={tracks}
                setOffset={setOffset}
                playlist={playlist}
                onRemoveTrack={isOwner ? handleRemoveTrack : undefined}
            />
        </>
    )
}

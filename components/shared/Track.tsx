'use client'

import { useTrackStore } from '../../store/playerStore'
import useSpotify from '../../hooks/useSpotify'
import useAccessToken from '../../hooks/useAccessToken'
import millisToMinutesAndSeconds from '../../lib/time'
import { libraryAdd, libraryRemove } from '../../lib/spotifyLibrary'
import { addToQueue } from '../../lib/spotifyQueue'
import AddToPlaylistMenu from '../playlist/AddToPlaylistMenu'

type Props = {
    track: any
    key?: number
    isFollowed: boolean[]
    setIsFollowed: { (offset: boolean[]): void }
    number: number
    lastTrack?: any
    playlist?: any
    onRemoveTrack?: (trackUri: string) => void
    dragHandleListeners?: Record<string, any>
    dragHandleAttributes?: Record<string, any>
    sortableRef?: (node: HTMLElement | null) => void
    sortableStyle?: React.CSSProperties
    isDragging?: boolean
}

export default function Track({ track, number, isFollowed, setIsFollowed, lastTrack, playlist, onRemoveTrack, dragHandleListeners, dragHandleAttributes, sortableRef, sortableStyle, isDragging }: Props) {
    const spotifyApi = useSpotify()
    const accessToken = useAccessToken()
    const trackId = useTrackStore((state) => state.trackId)
    const setTrackId = useTrackStore((state) => state.setTrackId)
    const setIsPlaying = useTrackStore((state) => state.setIsPlaying)
    const setSeek = useTrackStore((state) => state.setSeek)

    const playSong = () => {
        const playOptions = playlist?.uri
            ? { context_uri: playlist.uri, offset: { position: number } }
            : { uris: [track.uri] }

        spotifyApi.play(playOptions)
            .then(function() {
                setTrackId(track.id)
                setSeek(0)
                setIsPlaying(true)
            })
            .catch(() => {})
    }

    const handleRemove = (event: { stopPropagation: () => void }) => {
        event.stopPropagation()
        if (onRemoveTrack) onRemoveTrack(track.uri)
    }

    const handleAddToQueue = (event: { stopPropagation: () => void }) => {
        event.stopPropagation()
        if (!accessToken) return
        addToQueue(accessToken, track.uri).catch(function () {})
    }

    const handleFollow = (event: { stopPropagation: () => void }) => {
        event.stopPropagation()
        if (!accessToken) return
        if (isFollowed[number]) {
            libraryRemove(accessToken, 'track', [track.id])
                .then(function () {
                    let newArr = [...isFollowed]
                    newArr[number] = false

                    setIsFollowed(newArr)
                })
                .catch(function () {
                })
        } else {
            libraryAdd(accessToken, 'track', [track.id])
                .then(function () {
                    let newArr = [...isFollowed]
                    newArr[number] = true

                    setIsFollowed(newArr)
                })
                .catch(function () {
                })
        }
    }

    const combinedRef = (node: HTMLElement | null) => {
        if (sortableRef) sortableRef(node)
        if (lastTrack) lastTrack(node)
    }

    return (
        <tr
            className={`hover:bg-gray-100 cursor-pointer ${trackId === track.id ? 'bg-gray-100' : ''} ${isDragging ? 'opacity-50' : ''}`}
            onClick={playSong}
            ref={combinedRef}
            style={sortableStyle}
        >
            <td className="px-6 py-4 max-w-0 w-5/12 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center space-x-3 lg:pl-2">
                    {dragHandleListeners && (
                        <button
                            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white"
                            onClick={(event) => event.stopPropagation()}
                            {...dragHandleAttributes}
                            {...dragHandleListeners}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <circle cx="5" cy="3" r="1.5" />
                                <circle cx="11" cy="3" r="1.5" />
                                <circle cx="5" cy="8" r="1.5" />
                                <circle cx="11" cy="8" r="1.5" />
                                <circle cx="5" cy="13" r="1.5" />
                                <circle cx="11" cy="13" r="1.5" />
                            </svg>
                        </button>
                    )}
                    <p className="text-sm text-gray-500 mr-1">{++number}</p>
                    <img
                        className="h-10 w-10 rounded"
                        src={track?.album?.images?.[0]?.url}
                        alt=""
                    />
                    <p className="truncate hover:text-gray-700 cursor-pointer">
                      <span>
                          {track.name}
                          <span className="text-gray-400 font-normal"> by {track.artists[0].name}</span>
                      </span>
                    </p>
                </div>
            </td>
            <td className="px-6 py-3 text-sm text-gray-500 font-medium w-4/12">
                <div className="flex items-center space-x-2">
                    <div className="flex flex-shrink-0 -space-x-1">
                        {track?.album?.name?.substring(0, 60)}
                    </div>
                </div>
            </td>
            <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                {track.added_at ? new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(track.added_at) : ''}
            </td>
            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium flex justify-between text-gray-500">
                <div className="flex items-center space-x-2">
                    <button onClick={handleFollow}>
                        {isFollowed[--number] ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-heart mt-4 fill-green-500" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-heart mt-4" viewBox="0 0 16 16">
                                <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                            </svg>
                        )}
                    </button>
                    <button onClick={handleAddToQueue} title="Add to queue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="mt-4 text-gray-500 hover:text-gray-900" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <AddToPlaylistMenu trackUri={track.uri} />
                    {onRemoveTrack && (
                        <button onClick={handleRemove} title="Remove from playlist">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="mt-4 text-gray-500 hover:text-red-600" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="mt-3">
                    {millisToMinutesAndSeconds(track.duration_ms)}
                </div>
            </td>
        </tr>
    )
}

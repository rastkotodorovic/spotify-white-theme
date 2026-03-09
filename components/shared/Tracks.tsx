'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensors,
    useSensor,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import Track from './Track'
import SortableTrack from './SortableTrack'
import useAccessToken from '../../hooks/useAccessToken'
import { libraryContains } from '../../lib/spotifyLibrary'

type Props = {
    tracks: any[]
    offset?: number|null
    setOffset?: { (offset: number): void } | null
    playlist?: any
    onRemoveTrack?: (trackUri: string) => void
    onReorderTrack?: (oldIndex: number, newIndex: number) => void
}

interface RefObject {
    disconnect: () => void
    observe: (node) => void
}

export default function Tracks({ tracks, offset = null, setOffset = null, playlist, onRemoveTrack, onReorderTrack }: Props) {
    const accessToken = useAccessToken()
    const [ isFollowed, setIsFollowed ] = useState<boolean[]>([])
    const [ activeDragIndex, setActiveDragIndex ] = useState<number | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    )

    const observer = useRef<RefObject>()
    const lastTrackRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && setOffset) {
                // @ts-ignore
                setOffset((prevOffset: number) => prevOffset + 20)
            }
        })
        if (node) observer.current.observe(node)
    }, [])

    useEffect(() => {
        if (accessToken && tracks?.length) {
            let ids: string[] = []
            tracks.map((track) => {
                ids.push(track.track ? track.track.id : track.id)
            })

            libraryContains(accessToken, 'track', ids.slice(0, 50))
                .then(function(data) {
                    setIsFollowed(data)
                })
                .catch(function() {
                })
        }
    }, [accessToken, tracks])

    const getTrackItem = (item: any) => item.track ? item.track : item

    const getSortableId = (item: any, index: number) => {
        const track = getTrackItem(item)
        return track.uri ? `${track.uri}-${index}` : `track-${index}`
    }

    const sortableIds = onReorderTrack
        ? tracks?.map((track, index) => getSortableId(track, index)) ?? []
        : []

    const handleDragStart = (event: DragStartEvent) => {
        const activeId = event.active.id as string
        const index = sortableIds.indexOf(activeId)
        setActiveDragIndex(index)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveDragIndex(null)
        const { active, over } = event
        if (!over || active.id === over.id || !onReorderTrack) return

        const oldIndex = sortableIds.indexOf(active.id as string)
        const newIndex = sortableIds.indexOf(over.id as string)
        if (oldIndex !== -1 && newIndex !== -1) {
            onReorderTrack(oldIndex, newIndex)
        }
    }

    const activeDragTrack = activeDragIndex !== null && tracks?.[activeDragIndex]
        ? getTrackItem(tracks[activeDragIndex])
        : null

    const renderTrackRows = () => {
        return tracks?.map((track, index: number) => {
            const isLastTrack = tracks.length === index + 1 && setOffset

            if (onReorderTrack) {
                return (
                    <SortableTrack
                        sortableId={getSortableId(track, index)}
                        key={getSortableId(track, index)}
                        lastTrack={isLastTrack ? lastTrackRef : undefined}
                        track={getTrackItem(track)}
                        number={index}
                        isFollowed={isFollowed}
                        setIsFollowed={setIsFollowed}
                        playlist={playlist}
                        onRemoveTrack={onRemoveTrack}
                    />
                )
            }

            return (
                <Track
                    key={index}
                    lastTrack={isLastTrack ? lastTrackRef : undefined}
                    track={getTrackItem(track)}
                    number={index}
                    isFollowed={isFollowed}
                    setIsFollowed={setIsFollowed}
                    playlist={playlist}
                    onRemoveTrack={onRemoveTrack}
                />
            )
        })
    }

    const tableContent = (
        <table className="min-w-full">
            <thead>
            <tr className="border-t border-gray-200">
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="lg:pl-2">Title</span>
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Album
                </th>
                <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date added
                </th>
                <th className="hidden md:table-cell px-6 py-3 border-b align-right border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {/*<ClockIcon className="w-5 h-5" />*/}
                </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
            {onReorderTrack ? (
                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                    {renderTrackRows()}
                </SortableContext>
            ) : (
                renderTrackRows()
            )}
            </tbody>
        </table>
    )

    return (
        <div className="hidden mt-8 sm:block mb-24">
            <div className="align-middle inline-block min-w-full border-b border-gray-200">
                {onReorderTrack ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        {tableContent}
                        <DragOverlay>
                            {activeDragTrack ? (
                                <div className="flex items-center space-x-3 bg-white shadow-lg rounded-lg px-4 py-3 border border-gray-200">
                                    <img
                                        className="h-10 w-10 rounded"
                                        src={activeDragTrack?.album?.images?.[0]?.url}
                                        alt=""
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{activeDragTrack.name}</p>
                                        <p className="text-sm text-gray-400">{activeDragTrack.artists?.[0]?.name}</p>
                                    </div>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    tableContent
                )}
            </div>
        </div>
    )
}

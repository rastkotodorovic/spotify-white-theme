'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Track from './Track'

type SortableTrackProps = {
    sortableId: string
    track: any
    number: number
    isFollowed: boolean[]
    setIsFollowed: (offset: boolean[]) => void
    lastTrack?: any
    playlist?: any
    onRemoveTrack?: (trackUri: string) => void
}

export default function SortableTrack({ sortableId, ...trackProps }: SortableTrackProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: sortableId })

    const sortableStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Track
            {...trackProps}
            dragHandleListeners={listeners}
            dragHandleAttributes={attributes}
            sortableRef={setNodeRef}
            sortableStyle={sortableStyle}
            isDragging={isDragging}
        />
    )
}

'use client'

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'

import { usePlaylistStore } from "../../store/playerStore"
import useRefreshPlaylists from '../../hooks/useRefreshPlaylists'
import Cards from "../shared/Cards"
import CreatePlaylistModal from '../playlist/CreatePlaylistModal'

export default function MyPlaylists() {
    const playlists = usePlaylistStore((state) => state.myPlaylists)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const refreshPlaylists = useRefreshPlaylists()

    return (
        <div className="px-4 mt-6 mx-8 sm:px-6 lg:px-8 mb-40">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 text-md font-medium tracking-wide">Playlists</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center space-x-1 rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600"
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Create Playlist</span>
                </button>
            </div>

            <Cards playlists={playlists} title="" href="playlist" />

            <CreatePlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreated={refreshPlaylists}
            />
        </div>
    )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from "next-auth/react"
import { PlusIcon } from '@heroicons/react/24/outline'

import Profile from "./Profile"
import SearchInput from "./SearchInput"
import Navigation from "./Navigation"
import MyPlaylists from "./MyPlaylists"
import CreatePlaylistModal from '../../playlist/CreatePlaylistModal'
import useRefreshPlaylists from '../../../hooks/useRefreshPlaylists'

export default function Sidebar() {
    const { data: session } = useSession()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const refreshPlaylists = useRefreshPlaylists()

    return (
        <>
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:pt-5 lg:pb-4 lg:bg-gray-100">
                <Link href="/">
                    <div className="flex items-center flex-shrink-0 px-6 cursor-pointer ml-1">
                        <img
                            className="h-9 w-auto"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png"
                            alt="Workflow"
                        />
                        <p className="ml-4 text-lg">Spotify</p>
                    </div>
                </Link>

                <div className="mt-6 h-0 flex-1 flex flex-col">
                    <Profile session={session} />

                    <SearchInput />

                    <div className="px-3 mt-6">
                        <Navigation />
                        <hr className="mt-3" />
                    </div>

                    <div className="px-3 mt-3">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full"
                        >
                            <PlusIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Create Playlist
                        </button>
                    </div>

                    <div className="px-3 mb-24 overflow-y-auto">
                        <MyPlaylists session={session} />
                    </div>
                </div>
            </div>

            <CreatePlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreated={refreshPlaylists}
            />
        </>
    )
}

'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

import useAccessToken from '../../hooks/useAccessToken'
import { usePlaylistStore } from '../../store/playerStore'
import { addTracksToPlaylist } from '../../lib/spotifyPlaylist'

type Props = {
  trackUri: string
}

export default function AddToPlaylistMenu({ trackUri }: Props) {
  const accessToken = useAccessToken()
  const playlists = usePlaylistStore((state) => state.myPlaylists)

  const handleAdd = (event: React.MouseEvent, playlistId: string) => {
    event.stopPropagation()
    if (!accessToken) return
    addTracksToPlaylist(accessToken, playlistId, [trackUri]).catch(() => {})
  }

  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
        title="Add to playlist"
        className="text-gray-500 hover:text-gray-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="mt-4" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
        </svg>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 bottom-full mb-1 z-50 w-56 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto">
          <div className="py-1">
            <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Add to playlist
            </p>
            {playlists.map((playlist) => (
              <Menu.Item key={playlist.id}>
                {({ active }) => (
                  <button
                    onClick={(event) => handleAdd(event, playlist.id)}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-sm text-left truncate`}
                  >
                    {playlist.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

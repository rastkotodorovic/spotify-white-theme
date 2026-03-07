'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useSession } from 'next-auth/react'

import useAccessToken from '../../hooks/useAccessToken'
import { createPlaylist } from '../../lib/spotifyPlaylist'

type Props = {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

export default function CreatePlaylistModal({ isOpen, onClose, onCreated }: Props) {
  const { data: session } = useSession()
  const accessToken = useAccessToken()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!accessToken || !name.trim()) return

    const userId = (session as any)?.user?.username
    if (!userId) return

    createPlaylist(accessToken, userId, name.trim(), {
      description: description.trim(),
    })
      .then(() => {
        setName('')
        setDescription('')
        onCreated()
        onClose()
      })
      .catch(() => {})
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                  Create playlist
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="playlist-name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      id="playlist-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="My playlist"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="playlist-description" className="block text-sm font-medium text-gray-700">
                      Description (optional)
                    </label>
                    <input
                      id="playlist-description"
                      type="text"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Add a description"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

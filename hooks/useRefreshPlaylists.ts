'use client'

import { useCallback } from 'react'

import useAccessToken from './useAccessToken'
import { getMyPlaylists } from '../lib/spotifyLibrary'
import { usePlaylistStore } from '../store/playerStore'

export default function useRefreshPlaylists() {
  const accessToken = useAccessToken()
  const setMyPlaylists = usePlaylistStore((state) => state.setMyPlaylists)

  return useCallback(() => {
    if (!accessToken) return
    getMyPlaylists(accessToken)
      .then((data) => {
        setMyPlaylists(data.items)
      })
      .catch(() => {})
  }, [accessToken, setMyPlaylists])
}

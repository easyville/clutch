import { kv } from '@vercel/kv'

// Type definitions
export interface Listing {
  id: string
  title: string
  description: string
  category: string
  type: string
  tags: string[]
  createdAt: string
  userId: string
  userName: string
  userEmail: string
}

// Check if KV is available (has environment variables)
function isKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

// In-memory fallback for local development
let memoryListings: Map<string, Listing> = new Map()

// Database operations with KV or memory fallback
export const db = {
  async getAllListings(): Promise<Listing[]> {
    if (isKVAvailable()) {
      try {
        const ids = await kv.smembers('listing_ids') as string[]
        if (ids.length === 0) {
          return []
        }
        const listings = await Promise.all(
          ids.map(id => kv.hgetall(`listing:${id}`))
        )
        return listings.filter(Boolean) as unknown as Listing[]
      } catch (error) {
        console.error('KV getAllListings error:', error)
        return Array.from(memoryListings.values())
      }
    }
    
    return Array.from(memoryListings.values())
  },

  async getListing(id: string): Promise<Listing | null> {
    if (isKVAvailable()) {
      try {
        return await kv.hgetall(`listing:${id}`) as unknown as Listing | null
      } catch (error) {
        console.error('KV getListing error:', error)
        return memoryListings.get(id) || null
      }
    }
    
    return memoryListings.get(id) || null
  },

  async createListing(listing: Listing): Promise<Listing> {
    if (isKVAvailable()) {
      try {
        await kv.hset(`listing:${listing.id}`, listing as unknown as Record<string, unknown>)
        await kv.sadd('listing_ids', listing.id)
        return listing
      } catch (error) {
        console.error('KV createListing error:', error)
        memoryListings.set(listing.id, listing)
        return listing
      }
    }
    
    memoryListings.set(listing.id, listing)
    return listing
  },

  async deleteListing(id: string): Promise<boolean> {
    if (isKVAvailable()) {
      try {
        await kv.del(`listing:${id}`)
        await kv.srem('listing_ids', id)
        return true
      } catch (error) {
        console.error('KV deleteListing error:', error)
        return memoryListings.delete(id)
      }
    }
    
    return memoryListings.delete(id)
  },

  // Saved listings
  async getSavedIds(userId: string): Promise<string[]> {
    if (isKVAvailable()) {
      try {
        return await kv.smembers(`saved:${userId}`) as string[]
      } catch (error) {
        console.error('KV getSavedIds error:', error)
        return []
      }
    }
    return []
  },

  async toggleSaved(userId: string, listingId: string): Promise<boolean> {
    if (isKVAvailable()) {
      try {
        const isSaved = await kv.sismember(`saved:${userId}`, listingId)
        if (isSaved) {
          await kv.srem(`saved:${userId}`, listingId)
          return false
        } else {
          await kv.sadd(`saved:${userId}`, listingId)
          return true
        }
      } catch (error) {
        console.error('KV toggleSaved error:', error)
        return false
      }
    }
    return false
  }
}

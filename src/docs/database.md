# Airbnb Clone Database Design

## Overview
This document defines the MongoDB database schema for the Airbnb clone using Mongoose. All collections use MongoDB's flexible document structure with proper validation, defaults, and indexing.

## User Collection
**Collection Name**: users

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| _id | ObjectId | Auto | - | MongoDB auto-generated ID |
| name | String | Yes | - | User's full name |
| email | String | Yes | - | Unique email address (indexed) |
| password | String | Yes | - | Hashed password |
| role | String | No | 'user' | User role: 'user' or 'admin' |
| avatar | String | No | null | URL to profile picture |
| phone | String | No | null | Phone number |
| isVerified | Boolean | No | false | Email verification status |
| createdAt | Date | Auto | Date.now | Account creation timestamp |
| updatedAt | Date | Auto | Date.now | Last update timestamp |

**Indexes**:
- email: unique
- createdAt: descending

## Post Collection
**Collection Name**: posts

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| _id | ObjectId | Auto | - | MongoDB auto-generated ID |
| title | String | Yes | - | Listing title |
| description | String | Yes | - | Detailed description |
| price | Number | Yes | - | Price per night (in cents) |
| currency | String | No | 'USD' | Currency code |
| location | Object | Yes | - | Location details (see below) |
| host | ObjectId (ref: users) | Yes | - | Reference to host user |
| images | [String] | No | [] | Array of image URLs |
| amenities | [String] | No | [] | Array of amenity names |
| maxGuests | Number | Yes | 1 | Maximum number of guests |
| bedrooms | Number | No | 1 | Number of bedrooms |
| bathrooms | Number | No | 1 | Number of bathrooms |
| propertyType | String | Yes | - | Type: 'apartment', 'house', 'room' |
| isActive | Boolean | No | true | Listing availability status |
| createdAt | Date | Auto | Date.now | Creation timestamp |
| updatedAt | Date | Auto | Date.now | Last update timestamp |

**Location Subdocument**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| address | String | Yes | - | Full address |
| city | String | Yes | - | City name |
| state | String | No | null | State/Province |
| country | String | Yes | - | Country name |
| zipCode | String | No | null | Postal code |
| coordinates | [Number] | No | null | [longitude, latitude] array |

**Indexes**:
- host: ascending
- location.city: text
- price: ascending
- createdAt: descending

## Booking Collection
**Collection Name**: bookings

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| _id | ObjectId | Auto | - | MongoDB auto-generated ID |
| listing | ObjectId (ref: listings) | Yes | - | Reference to booked listing |
| guest | ObjectId (ref: users) | Yes | - | Reference to booking guest |
| checkIn | Date | Yes | - | Check-in date |
| checkOut | Date | Yes | - | Check-out date |
| guests | Number | Yes | 1 | Number of guests |
| totalPrice | Number | Yes | - | Total booking price (in cents) |
| currency | String | No | 'USD' | Currency code |
| status | String | No | 'pending' | Status: 'pending', 'confirmed', 'cancelled', 'completed' |
| paymentStatus | String | No | 'unpaid' | Payment status: 'unpaid', 'paid', 'refunded' |
| specialRequests | String | No | null | Guest's special requests |
| createdAt | Date | Auto | Date.now | Booking creation timestamp |
| updatedAt | Date | Auto | Date.now | Last update timestamp |

**Indexes**:
- listing: ascending
- guest: ascending
- checkIn: ascending
- checkOut: ascending
- status: ascending
- createdAt: descending

## Review Collection (Future Extension)
**Collection Name**: reviews

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| _id | ObjectId | Auto | - | MongoDB auto-generated ID |
| listing | ObjectId (ref: listings) | Yes | - | Reference to reviewed listing |
| reviewer | ObjectId (ref: users) | Yes | - | Reference to reviewer user |
| booking | ObjectId (ref: bookings) | Yes | - | Reference to related booking |
| rating | Number | Yes | - | Rating 1-5 |
| comment | String | No | null | Review text |
| createdAt | Date | Auto | Date.now | Review creation timestamp |
| updatedAt | Date | Auto | Date.now | Last update timestamp |

**Indexes**:
- listing: ascending
- reviewer: ascending
- createdAt: descending

## Database Configuration
- **Database Name**: airbnb (configured in docker-compose.yml)
- **Connection**: MongoDB URI in .env (mongodb://localhost:27017/airbnb)
- **Validation**: All schemas use Mongoose built-in validation
- **Timestamps**: Automatic createdAt/updatedAt via timestamps: true
- **Population**: Use populate() for references in queries

## Data Relationships
- User → Listings (one-to-many): A user can host multiple listings
- User → Bookings (one-to-many): A user can make multiple bookings
- Listing → Bookings (one-to-many): A listing can have multiple bookings
- Booking → Listing (many-to-one): Each booking belongs to one listing
- Booking → User (many-to-one): Each booking belongs to one guest
- Review → Listing (many-to-one): Reviews belong to listings
- Review → User (many-to-one): Reviews belong to reviewers
- Review → Booking (one-to-one): Reviews are tied to bookings

## Migration Notes
- Start with User, Listing, Booking collections
- Add Review collection in future phases
- Use Mongoose migrations if schema changes are needed
- Backup data before any schema modifications
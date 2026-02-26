# 🏡 Real Estate Application – Overview Documentation

## 📌 Project Summary

###  This project is a Real Estate Management Platform designed to connect Users, Agents, and Admins for listing, managing, and discovering properties. The system supports property listings, user authentication, agent management, and admin moderation tools.

The application is structured with a scalable backend API and a role-based access control system to ensure secure operations.

## 👥 User Roles & Responsibilities

### 1️⃣ Users (Buyers / Renters)

Users are individuals who browse, search, and interact with property listings.

## Main Capabilities:

1. Register and login
2. View property listings
3. Search and filter properties
4. Save favorite properties
5. Contact agents
6. View property details
7. Like/disLike or Comment
8. message with agent who posted the property

## Example API Routes For Users:

* POST /api/v1/users/register --> Register User
* POST /api/v1/users/login    --> Login User
*  GET /api/v1/users/me (PROTECTED) --> Get User Profile
*  put /api/v1/users/me (PROTECTED) --> Update User Profile
### NOTE THE BECOME-AGENT 
*  GET /api/v1/users/become-agent (PROTECTED) --> Change Role from User To Agent 
### NOTE THE BECOME-AGENT ROUTE WILL GO INSIDE AGENT ROUTES FOLDER

## 2️⃣ Agents (Property Listers)

1. Register as an agent
2. Create, update, and delete property listings
3. Upload property images
4. Manage inquiries from users
5. View analytics on their listings
6. Response on comments
7. Message with users

## Example API Routes For Agents:
<!-- /api/v1/agent/property -->
1. ? /api/v1/agent/become-agent --> not created yet
2. Create, update, and delete property listings routes --> not created yet
3.  

## 3️⃣Admin (System Moderator)
Admins manage the entire platform and ensure system integrity.

## Main Capabilities:

1. Approve or reject agent accounts
2. Approve property listings
3. Manage users and agents
4. View platform statistics
5. Remove inappropriate listings

## Example API in Admin Routes:

* GET /api/v1/admin/usera --> get all Users
* GET /api/v1/admin/user/:userId    --> get signle User
*  DELETE /api/v1/admin/user/:userId --> Get User Profile
* GET /api/v1/admin/want-to-become-agent --> get pending tenants who want to become agent
* GET /api/v1/admin/want-to-become-agent    --> change tenant to agent role

# 🏘️ Properties Module
## Properties are the core entity in the system.
## Property Attributes (Sample Schema):

* id (string, UUID) – automatically generated unique property ID.
* agent (ObjectId / reference) – references User model, required.
* title (string) – title of the property.
* description (string / text) – detailed description of the property.
* propertyType (string) – "apartment" | "house" | "villa" | "room" | "studio" | "commercial" | "land".
* transaction (string) – "rent" | "sell" | "gerawi".
* location (object)
    * province (string) – required.
    * city (string) – required.
    * district (string) – required.
    * streetAddress (string) – required.
    * exactLocation (string) – optional, GPS coordinates or address.
    * landmark (string) – required, nearby landmark.
* details (object)
    * bedroom (number) – required.
    * bathroom (number) – required.
    * area (number) – optional, in square meters.
    * floor (number) – optional, floor number.
    * totalFloor (number) – optional, total floors in the building.
    * yearBuild (number) – optional, year property was built.
    * furniture (boolean) – optional, whether furnished.
    * parking (boolean) – required, parking availability.
    * security (string) – optional, type of security.
* amenities (array of strings)
    * Accepts any of: "parking" | "elevator" | "security" | "garden" | "pool" | "balcony" | "ac" | "heating" | "internet" | "calble_tv" | "pet_friendly" | "furniture"
* price (object)
    * amount (number) – required.
    * currency (string) – "afghani" | "doller", default: "afghani".
    * period (string) – optional, e.g., per month/year.
    * negotiable (boolean) – optional, default: false.
* media (array of objects)
    * url (string) – required, image URL.
    * public_id (string) – optional, cloud storage ID.
    * caption (string) – optional, max 200 chars, default: "One of the beautiest house in the market".
    * isPrimary (boolean) – optional, default: false.
* timestamps (auto)
    * createdAt (Date) – automatically set when created.
    * updatedAt (Date) – automatically updated when modified.

# 🔐 Authentication & Authorization
- Roles:
    - USER
    - AGENT
    - ADMIN
- Authorization Rules:
    - Users can only manage their own favorites and inquiries
    - Agents can only manage their own properties
    - Admins have full system access

# 🧩 System Architecture (High-Level)
- Frontend:
    - Web or Mobile client (React, NODE,REACTNATIVE)
- Backend::
    - REST API ( NODE, EXPRESS)
    - Database (MongoDB)
- Other Services:
    - Image Storage (Cloudinary / S3)
    - Email/SMS Notifications
    - Logging & Monitoring
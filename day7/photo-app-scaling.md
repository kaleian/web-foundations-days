# SnapShare: Photo-App Scaling Plan

## 1. Assumptions

This plan describes how SnapShare, a photo-sharing application, can scale to support millions of users who upload photos and view feeds from people they follow.

The following assumptions are used:

- SnapShare has 10 million registered users.
- 10% of registered users are active each day.
- Each daily active user uploads one original photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo averages 2 MB.
- Each photo generates one thumbnail of 50 KB.
- Calculations use 365 days per year and 86,400 seconds per day.
- Average traffic is spread across 24 hours for estimation purposes.
- Peak feed traffic is five times the average feed-view rate.
- Storage calculations use decimal units: 1 TB = 1,000 GB.
- Each feed page view is treated as one feed request for this estimate.
- The estimates exclude video, additional image variants, database metadata, backups, and storage replication overhead.

## 2. Traffic and Storage Estimates

### Daily Active Users

Daily active users (DAU) are calculated as:

10,000,000 × 10% = 1,000,000 users.

SnapShare therefore has approximately **1 million daily active users**.

### Photo Uploads per Second

Each active user uploads one photo per day.

Daily uploads:

1,000,000 × 1 = 1,000,000 uploads per day.

Average uploads per second:

1,000,000 ÷ 86,400 = 11.57 uploads per second.

SnapShare receives approximately **11.6 photo uploads per second on average**.

### Feed Views per Second

Each active user views 50 feed pages per day.

Daily feed views:

1,000,000 × 50 = 50,000,000 feed views per day.

Average feed views per second:

50,000,000 ÷ 86,400 = 578.7 feed views per second.

Peak feed views per second, using the required five-times multiplier:

578.7 × 5 = 2,893.5 feed views per second.

The system should therefore plan for approximately:

- Average: **579 feed views per second**
- Peak: **2,894 feed views per second**

These estimates represent average and planning peak rates. Actual traffic may be uneven and may produce higher short-lived spikes.

### Storage per Year

Each original photo is 2 MB, and each thumbnail is 50 KB.

Original photo storage per day:

1,000,000 × 2 MB = 2,000,000 MB = 2 TB per day.

Original photo storage per year:

2 TB × 365 = 730 TB per year.

Thumbnail storage per day:

1,000,000 × 50 KB = 50 GB per day.

Thumbnail storage per year:

50 GB × 365 = 18.25 TB per year.

Total new photo storage per year:

730 TB + 18.25 TB = 748.25 TB per year.

| Metric | Estimate |
|---|---:|
| Daily active users | 1,000,000 |
| Average uploads per second | 11.6 |
| Average feed views per second | 579 |
| Peak feed views per second | 2,894 |
| Original photo storage per year | 730 TB |
| Thumbnail storage per year | 18.25 TB |
| Total new photo storage per year | 748.25 TB |

These are estimates of new data stored, not the total accumulated storage across multiple years. Production storage requirements would be higher after accounting for backups, replicas, and other overhead.

## 3. Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system**.

Each active user uploads one photo but views 50 feed pages per day. This produces 50 million daily feed views compared with 1 million daily photo uploads.

The application must therefore serve substantially more reads than uploads. The architecture should prioritize fast feed delivery through a CDN, caching, database read replicas, and scalable application servers.

Uploads still require reliable writes to object storage and database metadata. However, feed delivery is expected to be the dominant workload.

## 4. Photo Storage Strategy

Photo files should be stored in object storage rather than directly inside the relational database.

Object storage is designed for large files and can scale to hundreds of terabytes or more. It also supports durable storage, independent scaling, and integration with a content delivery network (CDN).

The database should store information such as:

- Photo ID and owner ID.
- Caption and upload timestamp.
- Object-storage key or file URL.
- Thumbnail key or URL.
- Visibility and access permissions.

Separating metadata from image files prevents the database from becoming unnecessarily large and allows database capacity to scale independently from photo storage.

## 5. Architecture Diagram

The following diagram shows the main components and their relationships.

```text
                         USERS
                           |
                +----------+----------+
                |                     |
                v                     v
          +-----------+         +-------------+
          | CDN       |         | Load        |
          | Images    |         | Balancer    |
          +-----------+         +-------------+
                ^                     |
                |                     v
                |              +----------------+
                |              | App Servers    |
                |              | (stateless)    |
                |              +----------------+
                |                |      |      |
                |                |      |      |
                |                v      v      v
                |           +-------+ +--------+ +-----------+
                |           | Cache | | Primary| | Upload    |
                |           |       | | DB     | | Processing|
                |           +-------+ +--------+ +-----------+
                |                      |                    |
                |                      v                    v
                |                +-------------+      +-----------+
                |                | Read Replica|      | Object    |
                |                |             |      | Storage   |
                |                +-------------+      | Originals |
                |                                     +-----------+
                |                                           |
                |                                           v
                |                                     +-----------+
                |                                     | Queue     |
                |                                     +-----------+
                |                                           |
                |                                           v
                |                                     +-----------+
                |                                     | Thumbnail|
                |                                     | Worker   |
                |                                     +-----------+
                |                                           |
                |                                           v
                +-----------------------------------+---------------+
                                                    | Object Storage|
                                                    | Thumbnails    |
                                                    +---------------+
```

The CDN serves image files from object storage or its own cached copies. The load balancer distributes application requests across app servers. App servers handle feed logic, authorization, metadata operations, and upload coordination.

The queue and thumbnail worker process image transformations asynchronously so users do not have to wait for thumbnail generation before an upload request can finish.

## 6. What Each Component Solves

### CDN (Content Delivery Network)

The CDN caches and delivers frequently requested images closer to users, reducing latency and the load on origin storage.

### Load Balancer

The load balancer distributes incoming application requests across healthy app servers to prevent one server from becoming a bottleneck.

### App Servers

Stateless app servers handle authentication, feed generation, upload coordination, and business logic, allowing more servers to be added as traffic grows.

### Cache

The cache stores frequently accessed feed data, profile information, and other reusable results in fast memory, reducing repeated database queries.

### Primary Database

The primary database stores authoritative records such as users, follows, photo metadata, captions, and permissions, and handles writes that must be persisted.

### Database Read Replica

The read replica serves eligible read queries separately from the primary database, reducing read pressure on the primary and improving scalability.

### Object Storage

Object storage holds original photos and generated thumbnails durably and economically without placing large binary files inside database rows.

### Queue

The queue stores thumbnail-generation jobs until workers can process them, absorbing bursts of uploads and separating the upload path from slower image processing.

### Thumbnail Worker

The worker consumes queued jobs, resizes original images, creates thumbnails, and stores the resulting files in object storage.

## 7. Step-by-Step Photo Upload Flow

1. A user selects a photo and submits an upload request to SnapShare.
2. The load balancer routes the request to a healthy app server.
3. The app server authenticates the user and checks upload permissions and file constraints.
4. The original photo is uploaded to object storage. For large files or high upload volumes, the application can use a short-lived pre-signed upload URL so the client uploads directly to storage.
5. The application records the photo metadata, owner, storage key, and processing status in the primary database.
6. A thumbnail-generation job is added to the queue, referencing the original photo's storage key and metadata.
7. The upload can be acknowledged once the original file and required metadata are safely stored and the thumbnail job has been reliably queued.
8. A thumbnail worker retrieves the job and downloads the original photo from object storage.
9. The worker generates a thumbnail and uploads it to object storage.
10. The worker updates the photo's processing status and thumbnail reference in the database.
11. The CDN can deliver the thumbnail and original photo when authorized users view the photo. Cached copies are reused when available.

If thumbnail processing fails, the job can be retried, with limits and monitoring to avoid endless retries. A photo may remain available in its original form while its thumbnail is being processed, depending on the product's requirements.

## 8. Trade-Offs

### Trade-Off 1: CDN Caching vs. Freshness

Caching images at the CDN improves response times and reduces requests to origin storage. However, cached content can become stale after a photo is replaced or its access permissions change.

A practical solution is to use versioned object keys and cache-control policies, and to enforce authorization before serving private content. Permission changes may also require cache invalidation.

### Trade-Off 2: Database Read Replicas vs. Consistency

Read replicas distribute read traffic and reduce load on the primary database. However, replication is often asynchronous, so a recent upload or metadata update might not immediately appear on a replica.

The application can route critical read-after-write operations to the primary database and use replicas for feed and other reads that can tolerate a small delay.

### Trade-Off 3: Asynchronous Thumbnails vs. Immediate Availability

Using a queue and worker keeps uploads responsive and allows image processing capacity to scale independently. However, thumbnails may not be available immediately, and workers can fall behind during traffic spikes.

The system should track job status, retry transient failures, monitor queue depth, and display a temporary placeholder until the thumbnail is ready.

### Trade-Off 4: Direct-to-Object-Storage Uploads vs. Simplicity

Direct uploads using pre-signed URLs reduce application-server bandwidth and make large uploads easier to scale. However, they add complexity around permissions, URL expiration, validation, and coordinating metadata with uploaded files.

Pre-signed URLs should be short-lived and scoped to a specific object, and the application should verify the uploaded file before making it available.

## 9. Conclusion

SnapShare should use a horizontally scalable application tier, object storage for photos, a CDN for image delivery, caching for frequently requested data, and a primary database with a read replica. A queue and background workers should handle thumbnail generation asynchronously.

The estimates indicate approximately 1 million daily active users, 579 average feed views per second, a planning peak of 2,894 feed views per second, and 748.25 TB of new photo and thumbnail data per year.

Because the application is read-heavy, the design prioritizes efficient feed delivery while preserving reliable uploads, durable photo storage, and scalable background processing.

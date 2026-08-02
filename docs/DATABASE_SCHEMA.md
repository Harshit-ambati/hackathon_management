# Database Schema

The application uses MongoDB through Mongoose models.

## Users

Stores authentication, profile, and role data.

Important fields:

- `name`
- `email`
- `password`
- `role`: `admin`, `organizer`, `participant`, `judge`
- `isBlocked`
- `college`
- `skills`

## Hackathons

Stores organizer-created events.

Important fields:

- `title`
- `description`
- `theme`
- `mode`: `online`, `offline`, `hybrid`
- `venue`
- `startDate`
- `endDate`
- `registrationDeadline`
- `bannerImage`
- `prizePool`
- `maxTeamSize`
- `rules`
- `judgingCriteria`
- `status`
- `organizer`

## Registrations

Tracks participant registration requests.

Important fields:

- `hackathon`
- `participant`
- `status`: `pending`, `approved`, `rejected`, `cancelled`
- `note`
- `reviewedBy`
- `reviewedAt`

## Teams

Tracks hackathon teams and leadership.

Important fields:

- `hackathon`
- `name`
- `description`
- `leader`
- `members`: user, role, joinedAt

## Submissions

Tracks team project submissions.

Important fields:

- `hackathon`
- `team`
- `projectName`
- `problemStatement`
- `solution`
- `description`
- `githubRepository`
- `liveDemoUrl`
- `techStack`
- `screenshots`
- `presentationPdf`
- `demoVideoLink`
- `status`
- `statusNote`

## Reviews

Tracks judge evaluations.

Important fields:

- `hackathon`
- `submission`
- `judge`
- `scores`: innovation, technical complexity, user interface, functionality, scalability, documentation, presentation
- `totalScore`
- `feedback`
- `status`
- `completedAt`

# This is the official server repository of the SkillsSwap application

[Link to article that explains the build commands in package.json](https://www.totaltypescript.com/build-a-node-app-with-typescript-and-esbuild)

# Relationships in the Application

## 1. User and Skill (Many-to-Many through UserSkill)

This relationship is central to the app, as it connects users with the skills they can offer or want to learn. Because a user can have many skills and a skill can be associated with many users, this is a many-to-many relationship. The `UserSkill` model acts as a junction table (or join table) to facilitate this relationship, with additional fields to store whether a skill is offered or sought (`isOffered`) and a preference weighting (`weight`) for the skill.

### In Prisma Schema:
- `User.skills` links to multiple `UserSkill` records.
- `Skill.users` links to multiple `UserSkill` records.
- `UserSkill` references both `User` and `Skill` via their IDs, creating the many-to-many connection.

## 2. User and Rating (One-to-Many)

Users can receive multiple ratings and reviews from other users, establishing a one-to-many relationship between the `User` (reviewee) and `Rating`. A single `Rating` record is associated with one user who received the rating (reviewee) and one user who gave the rating (reviewer).

### In Prisma Schema:
- Each `Rating` has a `reviewerId` and `revieweeId` linking back to the `User` model.
- The `reviewer` and `reviewee` fields in the `Rating` model define the relations to the `User` model, indicating who gave and who received the rating, respectively.

## 3. Skill and Tag (Many-to-Many)

Skills can be categorized using tags, and a tag can be associated with many skills, forming a many-to-many relationship. This allows for flexible categorization of skills and enhances the skill matching algorithm by enabling searches and matches based on tags.

### In Prisma Schema:
- `Skill.tags` connects a skill to multiple tags.
- `Tag.skills` links a tag to multiple skills.
- This many-to-many relationship does not explicitly show a junction model in the schema you provided. However, Prisma manages the underlying join table automatically unless additional fields are needed in the junction table. If specific attributes on the relationship are required, you'd define a model for the join table and set up the relations manually, similar to `UserSkill`.

## Relation Attributes and Annotations
- The `@relation` attribute is used to specify the relationship between models, especially when defining one-to-many and many-to-many relationships with explicit back-references.
- `@@id([userId, skillId])` in `UserSkill` specifies a composite primary key, indicating that each record is uniquely identified by the combination of `userId` and `skillId`.
- `@default(cuid())` generates a globally unique identifier for each record upon creation, used here for IDs.
- `@updatedAt` automatically updates the timestamp whenever a record is modified.

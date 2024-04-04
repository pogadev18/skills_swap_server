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

# Tag Schema Explained

The Tag model is designed to categorize skills into more searchable and manageable groups. This categorization aids users in finding skills and other users more efficiently, especially as the number of skills on the platform grows.

## Functionality
Tags act as keywords or labels that can be attached to skills. For example, the skill "Coding" might have tags like "JavaScript", "Web Development", and "Programming Basics". This allows for more nuanced searches where users can find matches based on specific interests or expertise areas, rather than broad categories.

## User Flow Example
Bob is skilled in coding, and he's interested in learning guitar. When Bob adds "Coding" as a skill he can offer, SkillsSwap might suggest or allow him to select tags such as "JavaScript", "React", or "Software Engineering" to further specify his expertise. Similarly, when he searches for "Guitar", he might find Joe under tags like "Acoustic Guitar", "Music Theory", or "Beginner Guitar Lessons". This system enhances the matchmaking process by aligning users' specific interests and expertise.

# `Weight` in UserSkill Explained

The `weight` field in the UserSkill model is used to prioritize skills based on the user's preference or proficiency level. This can be particularly useful in optimizing the skill-matching algorithm.

## Functionality
The weight integer allows users to express how strongly they feel about learning or teaching a particular skill. A higher weight could indicate a stronger desire to learn a skill or a higher level of expertise in teaching it.

## User Flow Example
Bob is particularly proficient in "React", a subcategory of his coding skills, and he's very keen on learning "Classical Guitar", more so than just basic guitar skills. Bob could set a higher weight for his "React" skill when offering it and set a higher weight for "Classical Guitar" in his learning preferences. When Joe adds "Guitar" as a skill he can offer, he might specify his proficiency in "Classical Guitar" by assigning it a higher weight. The platform can then prioritize matching Bob and Joe for a skill swap in "React" and "Classical Guitar" due to the matching high weights, indicating a strong match in terms of both parties' preferences and proficiencies.

# Utilizing Tags and Weights for Enhanced Matching

Integrating the Tag and `weight` functionalities into SkillsSwap can significantly enhance the user experience by:

- **Improving Search Precision:** Tags help users perform more granular searches, increasing the likelihood of finding exactly what they're looking for.
- **Refining Matchmaking:** Weights allow the platform to consider not just whether users want to learn or teach a skill, but how strongly they feel about it, leading to more satisfying matches.

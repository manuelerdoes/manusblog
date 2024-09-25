# Manus Blog

Simple Blog for myself. It changes colours and backgrounds according to the topic of the blog.

npm run dev


## todo / Features

- BlogList.jsx: Searching and filtering ✅
- List of all blogs in blog view ✅
- edit and delete my blogs ✅
- startseit: aktuellster blog ✅
- markdown format ✅
- But Picture Upload trotz nicht eingeloggt ✅
- Username used verhindern ✅
- blog per url öffnen ✅
- ABO/Erinnerung per Mail. Button bei Details
- Disable Comments
- blog-ids with blogtitle

## Security

Potential Problems:
* many requests on Login and registering -> Firebase setting: max 100 new users per hour
* many new blogs
* big pictures 
* many pictures   

## Bugs

* New Blog after cancel makes two new blogs.
* Comments: each child of list should have unique key prop, error message.


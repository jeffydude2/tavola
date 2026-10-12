# Tavola - Restaurant Finder

Node/Express + MongoDB Atlas backend, plain HTML/CSS/JS frontend.

## Structure
- `backend/`  REST API (config, models, controllers, routes, middleware)
- `frontend/` Static pages (`assets/css`, `assets/js`, `assets/js/pages`)
- `docs/`     Put screenshots here (fc_home, fc_list, fc_search, fc_search_cuisine, fc_filter_borough, fc_aggregate)

## Run
1. `cd backend && npm install`
2. Copy `.env.example` to `.env` and paste your Atlas connection string (database `dbRestaurants`, collection `restaurants`).
3. `npm start`, then open http://localhost:3000

## Rubric map
- Aggregate: `GET /api/stats/top-rated` ($avg, $sort, $limit) -> top-rated.html
- Group by: `GET /api/stats/boroughs` ($group) -> boroughs.html
- Search: `GET /api/restaurants?q=&cuisine=` -> search.html
- Add / Edit / Delete: POST / PUT / DELETE `/api/restaurants` -> restaurants.html
- Atlas: connection string in `backend/.env`

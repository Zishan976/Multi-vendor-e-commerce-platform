# TODO: Implement Search and Category Filters

## Steps to Complete

1. **Update Navbar.jsx**

   - [x] Add search state (useState for searchTerm)
   - [x] Add onChange handler for search input (update state on input)
   - [x] Add onKeyDown handler for search input (navigate on Enter)
   - [x] Update select onChange to navigate with category_id
   - [x] Import useNavigate from react-router-dom
   - [x] Create navigate function to /shop with query params

2. **Update Filter.jsx**

   - [x] Same changes as Navbar.jsx for mobile version
   - [x] Add search state, handlers, useNavigate

3. **Update Shop.jsx**

   - [x] Import useSearchParams from react-router-dom
   - [x] Use useSearchParams to get search and category_id from URL
   - [x] Modify fetchProducts to accept search and category_id params
   - [x] Pass search and category_id to API call
   - [x] Add useEffect to reset currentPage to 1 when search or category_id changes
   - [x] Update fetchProducts call in useEffect to include params

4. **Test the Implementation**
   - Run the app
   - Test search functionality (type in search bar, press Enter)
   - Test category filter (select category)
   - Verify products update accordingly
   - Check URL updates with query params

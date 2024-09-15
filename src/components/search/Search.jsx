import React, { useEffect, useState } from 'react'
import "./search.css"
import { useBlogListStore } from '../../lib/blogListStore';
import { debounce } from 'lodash';

function Search({ setCurrentBlogId, setShowSearch }) {
    const [searchText, setSearchText] = useState("");
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    const { currentBlogList, fetchBlogListInfo } = useBlogListStore();

    const handleBlogClick = (id) => {
        console.log("clicked blog: " + id);
        setCurrentBlogId(id);
        setShowSearch(false);
    }

    useEffect(() => {
        const debouncedSearch = debounce((searchText) => {
            if (searchText.trim() === "") {
                setFilteredBlogs(currentBlogList);  // Show all blogs when search is empty
            } else {
                setFilteredBlogs(
                    currentBlogList.filter((blog) => 
                        blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
                        blog.username.toLowerCase().includes(searchText.toLowerCase()) ||
                        blog.topic.toLowerCase().includes(searchText.toLowerCase()) ||
                        blog.tags?.toLowerCase().includes(searchText.toLowerCase())
                    )
                );
            }
        }, 300);

        debouncedSearch(searchText);  // Trigger debounced search

        return () => {
            debouncedSearch.cancel();  // Cancel the debounce on cleanup
        };
    }, [searchText, currentBlogList]);

    return (
        <div className='search'>
            <div className="searchinput">
            <img src="./search.png" alt="" />
                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <div className="results">
                <table>
                    <tr>
                        <th>Title</th>
                        <th>Topic</th>
                        <th>Author</th>
                        <th>Tags</th>
                        <th>Date of creation</th>
                    </tr>

                    {filteredBlogs.map((blogentry) => (
                        <tr key={blogentry.id} className={`item ${blogentry.topic}`}
                            onClick={() => handleBlogClick(blogentry.id)}>
                            <td>{blogentry.title}</td>
                            <td>{blogentry.topic}</td>
                            <td>👤{blogentry.username}</td>
                            <td>{blogentry.tags}</td>
                            <td>{blogentry.created}</td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default Search
import React, { useState } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  //define api url
  const URL = 'http://openlibrary.org/search.json?q=';

  //define hooks 
  const [searchBook, setSerchBook] = useState('');
  const [books, setBooks] = useState([]);

  //get input data
  const onInputChange = (item) => {
    const input = item.target.value.split(" ").join("+");
    setSerchBook(input);
  }

  //on search click event
  const onSearch = (item) => {
    item.preventDefault();
    getBooks();
  }

  //get books from api
  const getBooks = async () => {
    try {
      const response = await axios.get(`${URL}${searchBook}`);

      setBooks(response.data.docs.sort((a, b) => a.title.localeCompare(b.title)));
    }
    catch (err) {
      console.log(err);
    }
  }

  //sort books by sortType
  const sortBooks = (type) => {
    const sortedBooks = [...books].sort((a,b) => {
      if(type === "Sort"){
        return a.title.localeCompare(b.title);
      }
      else if(type === "Oldest"){
        return parseInt(a.first_publish_year) - parseInt(b.first_publish_year);
      }
      else if(type === "Newest"){
        return parseInt(b.first_publish_year) - parseInt(a.first_publish_year);
      }
    })
    setBooks(sortedBooks);
  }

  return (
    <div>
      <section className='mt-3'>
        <form className='container' onSubmit={onSearch}>
          <div className='form-group row'>
            <label className='col-md-auto' for='searchBook'>Search here:</label>
            <input
              className='col'
              id="searchBook"
              type='search'
              placeholder="Harry Potter"
              onChange={onInputChange}
            />
            &nbsp;&nbsp;
            <button className='col col-lg-2 btn btn-primary' type="submit">Search</button>
            &nbsp;&nbsp;
            <select className='col col-lg-2' defaultValue="Sort" onChange={(item) => sortBooks(item.target.value)}>
              <option disabled value="Sort">Sort</option>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>

          </div>
        </form>
      </section>

      <div className="row row-cols-1 row-cols-md-6 g-5 m-2">
        {
          books.map((book, index) => {
            return (
              <div className='col'>
                <div className="card h-100">
                  <img className="card-img-top" src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} alt={book.title} />
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">{book.author_name}</p>
                    <p className="card-text"><small className="text-muted">{book.first_publish_year}</small></p>
                  </div>
                </div>
              </div>
            )
          })

        }
      </div>
    </div >
  );
}

export default App;

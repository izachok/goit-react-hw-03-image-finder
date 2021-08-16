import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import './App.css';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import { fetchImagesByQuery, IMAGES_PER_PAGE } from './services/pixabay-api';
import Button from './components/Button/Button';

const Status = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  NEED_LOADING: 'needLoading',
};

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isMoreAvailable: false,
    error: null,
    status: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page, images } = this.state;
    if (this.state.status === Status.NEED_LOADING) {
      this.setState({ status: Status.PENDING });

      fetchImagesByQuery(query, page)
        .then(results => {
          const resultsCount = results.hits.length;
          if (resultsCount === 0) {
            this.setState({
              error: new Error(`No search results for ${query}`),
              status: Status.REJECTED,
            });
            return;
          }

          const isMoreAvailable = this.checkAvailability(resultsCount);

          this.setState({
            images: [...images, ...results.hits],
            isMoreAvailable,
            page: 1,
            status: Status.RESOLVED,
          });
        })
        .then(() => {
          if (page !== 1) {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth',
            });
          }
        })
        .catch(error => {
          this.setState({ error, status: Status.REJECTED });
        });
    }
  }

  handleSearchSubmit = query => {
    this.setState({ images: [], query, page: 1, status: Status.NEED_LOADING });
  };

  handleLoadMore = () => {
    this.setState(() => ({
      page: this.state.page + 1,
      status: Status.NEED_LOADING,
    }));
  };

  checkAvailability = itemsLength => {
    return !(itemsLength < IMAGES_PER_PAGE);
  };

  render() {
    const { error, status, isMoreAvailable, images } = this.state;

    return (
      <div className="App">
        <Searchbar onSubmit={this.handleSearchSubmit} />
        {status === Status.REJECTED && <div>{error.message}</div>}
        <ImageGallery items={images} />
        {status === Status.PENDING && (
          <Loader
            type="Audio"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        )}
        {status === Status.RESOLVED && isMoreAvailable && (
          <Button onClick={this.handleLoadMore}>Load more</Button>
        )}
      </div>
    );
  }
}

export default App;

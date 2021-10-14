import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header'
import Footer from './components/footer'
import './index.scss'


class Page extends React.Component {

  render() {
    return (
      <>
        <Header />
        <Footer />
      </>
    )
  }
}


ReactDOM.render(
  <Page />,
  document.getElementById('root')
);

const Header = ({toggleRsvp}) =>
  <header>
    <h1>Joshua <em>&</em> Roxane <span>are getting married!</span></h1>
    <nav>
      <ul>
        <li><a href='#' onClick={toggleRsvp} >RSVP</a>|</li>
        <li><a href='#details'>Wedding Details</a>|</li>
        <li><a href='#registry'>Registry</a></li>
      </ul>
    </nav>
    <img src='/static/photo.jpg' alt='Picture of Josh and Roxy' />
  </header>

export default Header

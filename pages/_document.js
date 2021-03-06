
import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render () {
    return (
      <html lang='en'>
        <Head>
          <meta charset='utf-8' />
          <meta http-equiv='X-UA-Compatible' content='IE=edge' />
          <title>Joshua and Roxane are getting married!</title>
          <meta name='description' content='joshua and roxane wedding website' />
          <meta name='viewport' content='width=device-width, initial-scale=1, minimal-ui' />
          <link rel='stylesheet' href='/_next/static/style.css' />
          <link href='//fonts.googleapis.com/css?family=Niconne|Heebo|Montserrat|Arimo|Pacifico' rel='stylesheet' type='text/css' />
          <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css' integrity='sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB' crossorigin='anonymous' />
          <link rel='stylesheet' href='/_next/static/style.css' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

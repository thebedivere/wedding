
import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render () {
    return (
      <html>
        <Head>
          <meta charset='utf-8' />
          <meta http-equiv='X-UA-Compatible' content='IE=edge' />
          <title>Joshua and Roxane are getting married!</title>
          <meta name='description' content='joshua and roxane wedding website' />
          <meta name='viewport' content='width=device-width, initial-scale=1, minimal-ui' />
          <link rel='stylesheet' href='/_next/static/style.css' />
          <link href='http://fonts.googleapis.com/css?family=Montserrat:400,700|Open+Sans:400,700|Niconne|Heebo|Montserrat|Arimo|Pacifico|Roboto|Bree+serif|Questrial|Catamaran' rel='stylesheet' type='text/css' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

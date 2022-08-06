import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div data-theme="cupcake">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

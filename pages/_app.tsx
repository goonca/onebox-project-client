import { AppProps } from 'next/app';
import '../src/shared/style/global.scss';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

import style from './Quote.module.scss';

export type QuoteProps = {
  text: string;
};

const Quote = (props: QuoteProps) => {
  return (
    <>
      <blockquote className={style['quote']} data-component="quote">
        {props.text}
      </blockquote>
    </>
  );
};

export default Quote;

import style from './Spacing.module.scss';

export const Spacing = () => {
  return (
    <>
      <div className={style['spacing']}>
        <div>
          <label>top</label>
          <input type="number" min={0} max={5} />
        </div>
        <div className={style['draw']}>
          <div>
            <label>spacing</label>
          </div>
        </div>
        <div>
          <input type="number" min={0} max={5} />
          <label>bottom</label>
        </div>
      </div>
    </>
  );
};

import { BlockModel } from 'shared/types/api-type';
import style from './Block.module.scss';

type BlockEditorProps = {
  block: BlockModel;
};

export const BlockEditor: React.FC<BlockEditorProps> = (
  props?: BlockEditorProps
) => {
  return (
    <>
      <div className={style['block-editor']}>
        filters
        <br />
        custom display
      </div>
    </>
  );
};

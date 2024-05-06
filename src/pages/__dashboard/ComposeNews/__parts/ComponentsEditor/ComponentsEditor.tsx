import style from './ComponentsEditor.module.scss';
import { ComponentType } from '../FreeEditor/FreeEditor';

type ComponentsEditorProps = {
  onAddComponent: (componentType: ComponentType) => void;
};

const selectComponent = () => {};

export const ComponentsEditor: React.FC<ComponentsEditorProps> = (
  props: ComponentsEditorProps
) => {
  return (
    <>
      <div className={style['components-erditor']}>
        <div className={style['wrapper']}>
          <div>
            <label>picture</label>
            <div
              className={style['draggable']}
              onClick={() => props.onAddComponent('Figure')}
            >
              <img src="/static/comp-picture.svg" />
            </div>
          </div>

          <div>
            <label>quote</label>
            <div
              className={style['draggable']}
              onClick={() => props.onAddComponent('Quote')}
            >
              <img src="/static/comp-quote.svg" />
            </div>
          </div>

          <div>
            <label>text</label>
            <div
              className={style['draggable']}
              onClick={() => props.onAddComponent('Text')}
            >
              <img src="/static/comp-text.svg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

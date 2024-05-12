import { LoadingButton } from '@mui/lab';
import { Button, CircularProgress, Link } from '@mui/material';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import { useDropzone } from 'react-dropzone';
import { useFile } from 'shared/hooks/useFile';
import { ResponseType } from 'shared/hooks/useServices';
import { FileModel } from 'shared/types/api-type';

import style from './Draggable.module.scss';

export type DraggableProps = {
  onUpload: (files?: FileModel[]) => void;
  hideButtons?: boolean;
  showPreview?: boolean; //with preview, only one file at time is allowed
};

type CustomFile = File & {
  invalidMessage?: string[];
};

export const Draggable = forwardRef(function Draggable(
  props: DraggableProps,
  ref
) {
  useImperativeHandle(
    ref,
    () => {
      return {
        async submit() {
          await submitForm();
        },
        reset() {
          setBlobFiles(undefined);
          setPreviewFile(undefined);
        }
      };
    },
    []
  );

  const [blobFiles, setBlobFiles] = useState<CustomFile[]>();
  const [previewFile, setPreviewFile] = useState<FileModel>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [invalidFile, setInvalidFile] = useState<boolean>(false);
  const { readableSize } = useFile();

  const openSelector = () => {
    (
      document.querySelector(
        '#droppable input[type="file"]'
      ) as HTMLInputElement
    ).click();
  };

  const submitForm = async (files?: CustomFile[]) => {
    setUploading(true);
    const formData = new FormData();

    files = files ?? blobFiles ?? [];

    for (let i = 0; i < files.length; i++) {
      //if (!files[i].invalidMessage) {

      !files[i].invalidMessage?.length && formData.append('files', files[i]);
      //};
    }

    await fetch(process.env.NEXT_PUBLIC_APP_BASE_URL + '/files/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then(response => response.json())
      .then((res: ResponseType) => {
        setTimeout(() => {
          props.onUpload &&
            !props.showPreview &&
            props.onUpload(res.data as FileModel[]);
          setBlobFiles(undefined);
          setUploading(false);
          //console.log('res', res);
          props.showPreview &&
            setPreviewFile((res.data as Array<FileModel>)[0]);
        }, 1000);
      });
  };

  const onDrop = useCallback((allFiles: CustomFile[]) => {
    setInvalidFile(false);
    allFiles = allFiles.slice(0, props.showPreview ? 1 : 5);
    //submitForm(acceptedFiles);
    allFiles.map(file => {
      file.invalidMessage = [];
      file.size > 1024 * 1024 * 5 && file.invalidMessage.push('too big');

      !file.type.startsWith('image') &&
        file.invalidMessage.push('not an image');

      return file;
    });

    /*allFiles.forEach((file: CustomFile) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        //const binaryStr = reader.result;
        //console.log('binaryStr', binaryStr);
      };
      //const rFile = reader.readAsArrayBuffer(file);
      acceptedFiles.push(file);
    });*/

    setBlobFiles(allFiles);

    if (props.showPreview) {
      const invalidFile = !!allFiles.find(
        file => !!file.invalidMessage?.length
      );
      setInvalidFile(invalidFile);
      if (!invalidFile) {
        submitForm(allFiles);
      }
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    const ele = document.getElementById('droppable') as HTMLDivElement;
    const inp = document.querySelector(
      '#droppable input[type="file"]'
    ) as HTMLInputElement;

    props.showPreview && (inp.multiple = false);

    ele.addEventListener('dragover', function (e) {
      e.preventDefault();
    });

    ele.addEventListener('dragenter', function (e) {
      e.preventDefault();
      ele.classList.add(style['dragging']);
    });

    ele.addEventListener('dragleave', function (e) {
      e.preventDefault();
      ele.classList.remove(style['dragging']);
    });

    ele.addEventListener('drop', function (e) {
      e.preventDefault();
      ele.classList.remove(style['dragging']);
    });
  }, []);

  const cancelUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setBlobFiles(undefined);
    setPreviewFile(undefined);
  };

  const uploadAll = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await submitForm();
  };

  return (
    <>
      <div className={style['content']}>
        <div
          id="droppable"
          className={style['drop-area']}
          {...getRootProps()}
          onClick={e => {
            e.preventDefault();
          }}
        >
          {props.showPreview && previewFile && (
            <>
              <img
                className={style['preview']}
                src={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${previewFile.filename}`}
              />
            </>
          )}
          <input {...getInputProps()} />
          {(!blobFiles || props.showPreview) && (
            <div className={style['desc']}>
              {props.showPreview && uploading ? (
                <CircularProgress
                  color="inherit"
                  size={30}
                  className={style['loadingIndicator']}
                />
              ) : (
                !blobFiles &&
                !previewFile && (
                  <>
                    <p>
                      Drop some files here, or&nbsp;
                      <Link onClick={() => openSelector()}>
                        click here to select
                      </Link>
                    </p>
                    <small>Max 5 files at time / 5Mb each</small>
                  </>
                )
              )}
            </div>
          )}
          <div className={style['uploaded-files']}>
            {((props.showPreview && invalidFile) || !props.showPreview) && (
              <>
                {blobFiles?.map((file: CustomFile) => {
                  return (
                    <div key={file.name} className={style['file']}>
                      <p>{file.name}</p>
                      <span className={style['size']}>
                        {readableSize(file.size)}
                      </span>
                      {file.invalidMessage?.map(message => {
                        return (
                          <span
                            key={message}
                            className={style['invalid-message']}
                          >
                            {message}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            )}
            {(blobFiles || previewFile) &&
              ((props.showPreview && invalidFile) ||
                previewFile ||
                !props.showPreview) && (
                <>
                  <div className={style['footer']}>
                    <Button
                      size="small"
                      variant="contained"
                      disabled={uploading}
                      onClick={e => cancelUpload(e)}
                    >
                      Cancel
                    </Button>
                    {blobFiles &&
                      blobFiles.find(file => !file.invalidMessage?.length) && (
                        <LoadingButton
                          loading={uploading && !props.showPreview}
                          loadingIndicator={
                            <CircularProgress
                              color="inherit"
                              size={16}
                              className={style['loadingIndicator']}
                            />
                          }
                          data-dark
                          size="small"
                          variant="contained"
                          onClick={async e => await uploadAll(e)}
                        >
                          Upload
                        </LoadingButton>
                      )}
                    {!!previewFile && (
                      <Button data-dark size="small" variant="contained">
                        Use it
                      </Button>
                    )}
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
});
